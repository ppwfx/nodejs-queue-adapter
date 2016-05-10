import {IEncoder} from "../../encoder/IEncoder";
import {ActiveMqConfig} from "./ActiveMqConfig";
import Promise = require('bluebird');
import Amqp10 = require('amqp10');
import {IJob} from "../abstract/IJob";
import {ActiveMqJob} from "./ActiveMqJob";
import {QueueAdapter} from "../abstract/QueueAdapter";
import {IErrorHandler} from "../../handler/error/IErrorHandler";

export class ActiveMqAdapter extends QueueAdapter {

    protected config:ActiveMqConfig;
    protected clientPromises:{[concurrency: number]: Promise} = {};
    protected receiverPromises:{[queueName: string]: Promise} = {};
    protected senderPromises:{[queueName: string]: Promise} = {};

    constructor(errorHandler:IErrorHandler, encoder:IEncoder, config:ActiveMqConfig = new ActiveMqConfig()) {
        super(errorHandler, encoder, config);
    }

    public consume(queueName:string, callback:(job:IJob) => void) {
        var self = this;

        self.getReceiverPromise(queueName).then(function (receiver) {
            receiver.on('message', function (message) {
                var job = new ActiveMqJob(self.errorHandler, message.body, receiver, message);

                callback(job);
            })
        })
    }

    public produce(queueName:string, message:any) {
        var self = this;

        return self.getSenderPromise(queueName).then(function (sender) {
            return sender.send(message);
        })
    }

    protected getClientPromise(concurrency:number) {
        var self = this;

        if (!self.clientPromises[concurrency]) {
            var client = new Amqp10.Client(Amqp10.Policy.Utils.RenewOnSettle(concurrency, concurrency, Amqp10.Policy.ServiceBusQueue));
            self.clientPromises[concurrency] = new Promise(function (resolve, reject) {
                client.connect(self.getConnectionString(self.config))
                    .then(function () {
                        resolve(client)
                    })
                    .error(reject);
            })
        }

        return self.clientPromises[concurrency];
    }

    protected getSenderPromise(queueName:string):Promise {
        var self = this;
        var concurrency = self.config.getConcurrency(queueName);

        if (!self.senderPromises[queueName]) {
            self.senderPromises[queueName] = self.getClientPromise(concurrency).then(function (client) {
                return client.createSender(queueName);
            })
        }

        return self.senderPromises[queueName];
    }

    protected getReceiverPromise(queueName:string):Promise {
        var self = this;
        var concurrency = self.config.getConcurrency(queueName);

        if (!self.receiverPromises[queueName]) {
            self.receiverPromises[queueName] = self.getClientPromise(concurrency).then(function (client) {
                return client.createReceiver(queueName);
            })
        }

        return self.receiverPromises[queueName];
    }

    protected getConnectionString(config:ActiveMqConfig) {
        var connectionString = 'amqp://';

        if (config.username && config.password) {
            connectionString += config.username + ':' + config.password + '@';
        }

        connectionString += config.host;

        if (config.port) {
            connectionString += ':' + config.port;
        }

        return connectionString;
    }

}
