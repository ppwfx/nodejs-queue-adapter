import {IEncoder} from "../../encoder/IEncoder";
import Promise = require('bluebird');
import AWS = require('aws-sdk');
import {SqsConfig} from "./SqsConfig";
import {IErrorHandler} from "../../handler/error/IErrorHandler";
import {SqsJob} from "./SqsJob";
import {QueueAdapter} from "../abstract/QueueAdapter";
import async = require('async');
import lodash = require('lodash');
import {IJob} from "../abstract/IJob";

export class SqsAdapter extends QueueAdapter {

    protected config:SqsConfig;
    protected client:AWS.SQS;
    protected queueUrlPromises:{[queueName: string]: Promise} = {};

    constructor(errorHandler:IErrorHandler, encoder:IEncoder, config:SqsConfig = new SqsConfig()) {
        super(errorHandler, encoder, config);
    }

    public produce(queueName:string, payload:any):Promise {
        var self = this;

        return new Promise(function (resolve, reject) {
            self.getSendMessageParamsPromise(queueName, payload).then(function (params:AWS.SQS.SendMessageParams) {
                self.getClient().sendMessage(params, function (error:Error, result:AWS.SQS.SendMessageResult) {
                    if (error) {
                        reject(error);
                    }
                    resolve(result);
                });
            });
        });
    }

    public consume(queueName:string, callback:(job:IJob) => void) {
        var self = this;

        self.getReceiveMessageParamsPromise(queueName).then(function (params:AWS.SQS.ReceiveMessageParams) {
            var asyncQueue = async.queue(function (job:SqsJob, asyncQueueCallback:() => void) {
                function yo() {
                    asyncQueueCallback();
                    asyncQueue.empty()
                }

                job.addAsyncQueueCallback(yo);
                callback(job);
            }, self.config.getConcurrency(queueName));

            asyncQueue.empty = function () {

                var interval = setInterval(function () {
                    if (asyncQueue.length() >= self.config.getConcurrency(queueName)) {
                        clearInterval(interval);

                        return;
                    }

                    self.getClient().receiveMessage(params, function (error:Error, result:AWS.SQS.ReceiveMessageResult) {
                        if (result.Messages && result.Messages.length != 0) {
                            result.Messages.forEach(function (message:AWS.SQS.Message) {
                                var job = new SqsJob(self.errorHandler, self.encoder.decode(message.Body), params.QueueUrl, self.client, message);

                                asyncQueue.push(job, function (error) {
                                    self.errorHandler.handle(error);
                                });
                            });
                        }

                        self.errorHandler.handle(error);
                    });
                }, self.config.getPollFrequencyMilliSeconds(queueName));
            };

            asyncQueue.empty();
        })
    }

    protected getClient():AWS.SQS {
        var self = this;

        if (!self.client) {
            self.client = new AWS.SQS(self.config);
        }

        return self.client;
    }

    protected getQueueUrlPromise(queueName:string):Promise {
        var self = this;

        if (!self.queueUrlPromises[queueName]) {
            var params = self.config.getGetQueueUrlParams(queueName);

            self.queueUrlPromises[queueName] = new Promise(function (resolve, reject) {
                self.getClient().getQueueUrl(params, function (error, result) {
                    if (error) {
                        if (error.code == 'AWS.SimpleQueueService.NonExistentQueue') {
                            return self.getCreateQueuePromise(queueName)
                        } else {
                            reject(error);
                        }
                    }

                    resolve(result.QueueUrl);
                });
            });
        }

        return this.queueUrlPromises[queueName];
    }

    protected getCreateQueuePromise(queueName:string):Promise {
        var self = this;
        return new Promise(function (resolve, reject) {
            self.getClient().createQueue(self.config.getCreateQueueParams(queueName), function (error:Error, result:AWS.SQS.CreateQueueResult) {
                if (error) {
                    reject(error);
                }
                resolve(result.QueueUrl);
            })
        });
    }

    protected getSendMessageParamsPromise(queueName:string, payload:any):Promise {
        var self = this;

        return self.getQueueUrlPromise(queueName).then(function (queueUrl:string) {
            return self.config.getSendMessageParams(queueName, queueUrl, self.encoder.encode(payload));
        });
    }

    protected getReceiveMessageParamsPromise(queueName:string):Promise {
        var self = this;

        return self.getQueueUrlPromise(queueName).then(function (queueUrl:string) {
            return self.config.getReceiveMessageParams(queueName, queueUrl);
        });
    }
}