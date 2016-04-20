import {BeanstalkdConfig} from "./BeanstalkdConfig";
import Fivebeans = require('fivebeans');
import Promise = require('bluebird');
import {Job} from "../Job";
import {BeanstalkdJob} from "./BeanstalkdJob";
import {IEncoder} from "../../encoder/IEncoder";
import {QueueAdapter} from "../QueueAdapter";

export class BeanstalkdAdapter extends QueueAdapter {

    protected config:BeanstalkdConfig;
    protected clientPromise:Promise;

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
                        self.errorHandler.handle(error);
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

        self.getClientPromise().then(function (client) {
            client.use(queueName, function (err, tubename) {
                client.put(0, 0, 600, self.encoder.encode(payload), function (error:Error, jobId:number) {
                    self.errorHandler.handle(error);
                });
            });
        });
    }

    //todo add local queue
    public consume(queueName:string, callback:(job:Job) => void) {
        var self = this;

        self.getClientPromise().then(function (client) {
            client.watch(queueName, function (err, tubename) {
                setInterval(function () {
                    client.reserve(function (error:Error, jobId:number, payload) {
                        self.errorHandler.handle(error);

                        var job = new BeanstalkdJob(self.errorHandler, self.encoder.decode(payload.toString('utf8')), client, jobId);
                        callback(job);
                    });
                }, 300);
            });
        });
    }
}