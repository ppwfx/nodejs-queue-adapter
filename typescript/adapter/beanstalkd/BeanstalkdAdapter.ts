import {BeanstalkdConfig} from "./BeanstalkdConfig";
import Fivebeans = require('fivebeans');
import Promise = require('bluebird');
import {IJob} from "../abstract/IJob";
import {BeanstalkdJob} from "./BeanstalkdJob";
import {IEncoder} from "../../encoder/IEncoder";
import {QueueAdapter} from "../abstract/QueueAdapter";
import {IErrorHandler} from "../../handler/error/IErrorHandler";

export class BeanstalkdAdapter extends QueueAdapter {

    protected config:BeanstalkdConfig;
    protected clientPromise:Promise;

    constructor(errorHandler:IErrorHandler, encoder:IEncoder, config:BeanstalkdConfig = new BeanstalkdConfig()) {
        super(errorHandler, encoder, config);
    }

    protected getClientPromise():Promise {
        var self = this;

        if (!self.clientPromise) {
            var client = new Fivebeans.client(self.config.host, self.config.port);
            return self.clientPromise = new Promise(function (resolve, reject) {
                client
                    .on('connect', function () {
                        resolve(client)
                    })
                    .on('error', function (error) {
                        reject(error)
                    })
                    .on('close', function () {

                    })
                    .connect();
            });
        }

        return self.clientPromise;
    }

    //todo add config
    public produce(queueName:string, payload:any) {
        var self = this;

        return new Promise(function (resolve, reject) {
            self.getClientPromise().then(function (client) {
                client.use(queueName, function (err, tubename) {
                    client.put(0, 0, 600, self.encoder.encode(payload), function (error:Error, jobId:number) {
                        if (error) {
                            reject(error);
                        }

                        resolve(jobId);
                    });
                });
            });
        });
    }

    //todo add local queue
    public consume(queueName:string, callback:(job:IJob) => void) {
        var self = this;

        self.getClientPromise().then(function (client) {
            client.watch(queueName, function (err, tubename) {
                setInterval(function () {
                    client.reserve(function (error:Error, jobId:number, payload) {
                        self.errorHandler.handle(error);

                        var job = new BeanstalkdJob(self.errorHandler, self.encoder.decode(payload.toString('utf8')), client, jobId);
                        callback(job);
                    });
                }, 3000);
            });
        });
    }
}