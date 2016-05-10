import Rabbitjs = require('rabbit.js');
import Promise = require('bluebird');
import {RabbitMqQueueConfig} from "./RabbitMqConfig";
import {IEncoder} from "../../encoder/IEncoder";
import {RabbitMqJob} from "./RabbitMqJob";
import {QueueAdapter} from "../abstract/QueueAdapter";
import {IErrorHandler} from "../../handler/error/IErrorHandler";
import {IJob} from "../abstract/IJob";

export class RabbitMqAdapter extends QueueAdapter {

    protected config:RabbitMqQueueConfig;

    protected contextPromise:Promise;

    protected subscribeSocketPromise: Promise;
    protected subscribeConnectionPromises: {[queueName: string]: Promise} = {};

    protected publishSocketPromise: Promise;
    protected publishConnectionPromises: {[queueName: string]: Promise} = {};


    constructor(errorHandler:IErrorHandler, encoder:IEncoder, config:RabbitMqQueueConfig = new RabbitMqQueueConfig()) {
        super(errorHandler, encoder, config);
    }

    public produce(queueName: string, payload: any) {
        var self = this;

        return self.getPublishConnectionPromise(queueName).then(function (publishSocket:Rabbitjs.PushSocket) {
            return publishSocket.write(self.encoder.encode(payload), 'utf8');
        });
    }

    public consume(queueName: string, callback: (job: IJob) => void) {
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

        if(!self.contextPromise) {
            var context = Rabbitjs.createContext(self.getConnectionString(self.config));
            self.contextPromise = new Promise(function(resolve,reject){
                context.on('ready', function(){
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
            self.subscribeSocketPromise = self.getContextPromise().then(function(context: Rabbitjs.Context){
                return context.socket('WORKER', {persistent: true, prefetch: 1});
            }.bind(self));
        }

        return self.subscribeSocketPromise;
    }

    //todo see how to enable specific concurrency for each queue consumption
    protected getSubscribeConnectionPromise(queueName: string) {
        var self = this;

        if(!self.subscribeConnectionPromises[queueName]) {
            self.subscribeConnectionPromises[queueName] = self.getSubscribeSocketPromise().then(function(subscribeSocket: Rabbitjs.SubSocket){
                return new Promise(function(resolve, reject){
                    subscribeSocket.connect(queueName, function(){
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
            self.publishSocketPromise = self.getContextPromise().then(function(context: Rabbitjs.Context){
                return context.socket('PUSH', {persistent: true});
            }.bind(self));
        }

        return self.publishSocketPromise;
    }

    protected getPublishConnectionPromise(queueName: string) {
        var self = this;

        if(!self.publishConnectionPromises[queueName]) {
            self.publishConnectionPromises[queueName] = self.getPublishSocketPromise().then(function(publishSocket: Rabbitjs.SubSocket){
                return new Promise(function(resolve, reject){
                    publishSocket.connect(queueName, function(){
                        resolve(publishSocket);
                    }.bind(resolve));
                }.bind(publishSocket));
            });
        }

        return self.publishConnectionPromises[queueName];
    }

    protected getConnectionString(config: RabbitMqQueueConfig) {
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