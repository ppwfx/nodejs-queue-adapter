import {IErrorHandler} from "../../handler/error/IErrorHandler";
var rabbit = require('wascally');

rabbit.configure({
    // arguments used to establish a connection to a broker
    connection: {
        user: process.env.RABBITMQ_USERNAME,
        pass: process.env.RABBITMQ_PASSWORD,
        server: process.env.RABBITMQ_HOST,
        port: process.env.RABBITMQ_PORT,
        vhost: '/'
    },

    // define the exchanges
    exchanges: [
        {
            name: 'wascally-pubsub-requests-x',
            type: 'direct',
            autoDelete: true
        },
        {
            name: 'wascally-pubsub-messages-x',
            type: 'fanout',
            autoDelete: true
        }
    ],

    // setup the queues, only subscribing to the one this service
    // will consume messages from
    queues: [
        {
            name: 'wascally-pubsub-requests-q',
            autoDelete: true,
            subscribe: true,
            limit: 1
        },
        {
            name: 'wascally-pubsub-messages-q',
            autoDelete: true,
            subscribe: true,
            limit: 1
        }
    ],

    // binds exchanges and queues to one another
    bindings: [
        {
            exchange: 'wascally-pubsub-requests-x',
            target: 'wascally-pubsub-requests-q',
            keys: ['']
        },
        {
            exchange: 'wascally-pubsub-messages-x',
            target: 'wascally-pubsub-messages-q',
            keys: []
        }
    ]
});

rabbit.handle('publisher.message', function (msg) {
    msg.body;


    msg.ack();
});

rabbit.publish('wascally-pubsub-messages-x', {
    type: 'publisher.message',
    body: {message: 'Message ' + i}
});


import Rabbitjs = require('rabbit.js');
import Promise = require('bluebird');
import {RabbitMqQueueConfig} from "./RabbitMqConfig";
import {IEncoder} from "../../encoder/IEncoder";
import {RabbitMqJob} from "./RabbitMqJob";
import {Job} from "../Job";
import {QueueAdapter} from "../QueueAdapter";
import {IConfig} from "../IConfig";

export class RabbitMqAdapter extends QueueAdapter {

    protected config:RabbitMqQueueConfig;

    protected clientPromise: Promise;

    public getClientPromise():Promise {
        var self = this;

        if(!self.clientPromise) {
            self.clientPromise = new Promise(function (resolve, reject) {
                rabbit.configure({connection: this.config}).done(function () {
                    resolve(rabbit);
                });
            });
        }

        return self.clientPromise;
    }

    public produce(queueName:string, payload:any) {
        var self = this;

        self.getPublishConnectionPromise(queueName).then(function (publishSocket:Rabbitjs.PushSocket) {
            publishSocket.write(self.encoder.encode(payload), 'utf8');
        });
    }

    public consume(queueName:string, callback:(job:Job) => void) {
        var self = this;

        return self.getSubscribeConnectionPromise(queueName).then(function (subscribeSocket:Rabbitjs.WorkerSocket) {
            subscribeSocket.on('data', function (payload) {
                payload = self.encoder.decode(payload);

                var job = new RabbitMqJob(self.errorHandler, payload, subscribeSocket);
                callback(job);
            });
        });
    }

    protected getContextPromise() {
        var self = this;

        if (!self.contextPromise) {
            var context = Rabbitjs.createContext(self.getConnectionString(self.config));
            self.contextPromise = new Promise(function (resolve, reject) {
                context.on('ready', function () {
                    resolve(context)
                }.bind(context));

                context.on('error', reject)
            }.bind(context));
        }

        return self.contextPromise;
    }

    protected getSubscribeSocketPromise() {
        var self = this;

        if (!self.subscribeSocketPromise) {
            self.subscribeSocketPromise = self.getContextPromise().then(function (context:Rabbitjs.Context) {
                return context.socket('WORKER', {persistent: true, prefetch: 3});
            }.bind(self));
        }

        return self.subscribeSocketPromise;
    }

    //todo see how to enable specific concurrency for each queue consumption
    protected getSubscribeConnectionPromise(queueName:string) {
        var self = this;

        if (!self.subscribeConnectionPromises[queueName]) {
            self.subscribeConnectionPromises[queueName] = self.getSubscribeSocketPromise().then(function (subscribeSocket:Rabbitjs.SubSocket) {
                return new Promise(function (resolve, reject) {
                    subscribeSocket.connect(queueName, function () {
                        subscribeSocket.setEncoding('utf8');

                        resolve(subscribeSocket);
                    }.bind(resolve));
                }.bind(subscribeSocket));
            });
        }

        return self.subscribeConnectionPromises[queueName];
    }

    protected getPublishSocketPromise() {
        var self = this;

        if (!self.publishSocketPromise) {
            self.publishSocketPromise = self.getContextPromise().then(function (context:Rabbitjs.Context) {
                return context.socket('PUSH', {persistent: true});
            }.bind(self));
        }

        return self.publishSocketPromise;
    }

    protected getPublishConnectionPromise(queueName:string) {
        var self = this;

        if (!self.publishConnectionPromises[queueName]) {
            self.publishConnectionPromises[queueName] = self.getPublishSocketPromise().then(function (publishSocket:Rabbitjs.SubSocket) {
                return new Promise(function (resolve, reject) {
                    publishSocket.connect(queueName, function () {
                        resolve(publishSocket);
                    }.bind(resolve));
                }.bind(publishSocket));
            });
        }

        return self.publishConnectionPromises[queueName];
    }

    protected getConnectionString(config:RabbitMqQueueConfig) {
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