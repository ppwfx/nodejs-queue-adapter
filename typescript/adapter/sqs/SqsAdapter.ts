import {IEncoder} from "../../encoder/IEncoder";
import Promise = require('bluebird');
import AWS = require('aws-sdk');
import {Job} from "../Job";
import {SqsConfig} from "./SqsConfig";
import {IErrorHandler} from "../../handler/error/IErrorHandler";
import {SqsJob} from "./SqsJob";
import {QueueAdapter} from "../QueueAdapter";
import async = require('async');
import lodash = require('lodash');

export class SqsAdapter extends QueueAdapter {

    protected config:SqsConfig;
    protected client:AWS.SQS;
    protected queueUrlPromises:{[queueName: string]: Promise} = {};

    constructor(errorHandler:IErrorHandler, encoder:IEncoder, config:SqsConfig, consumeConcurrencies:{}) {
        super(errorHandler, encoder, config, consumeConcurrencies);
    }

    public produce(queueName:string, payload:any):Promise {
        var self = this;

        return new Promise(function (resolve, reject) {
            self.getSendMessageParamsPromise(queueName, payload).then(function (params:AWS.SQS.SendMessageParams) {
                self.getClient().sendMessage(params, function (error:Error, result:AWS.SQS.SendMessageResult) {
                    self.errorHandler.handle(error);
                    resolve();
                });
            });
        });
    }

    public consume(queueName:string, callback:(job:Job) => void) {
        var self = this;

        self.getReceiveMessageParamsPromise(queueName).then(function (params:AWS.SQS.ReceiveMessageParams) {
            var asyncQueue = async.queue(function (job:SqsJob, asyncQueueCallback:() => void) {
                function yo() {
                    asyncQueueCallback();
                    asyncQueue.empty()
                }

                job.addAsyncQueueCallback(yo);
                callback(job);
            }, self.getConcurrency(queueName));

            asyncQueue.empty = function () {

                var interval = setInterval(function () {
                    if (asyncQueue.length() >= self.getConcurrency(queueName) * 3) {
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
                }, self.getPollFrequencyMilliSeconds(queueName));

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
            var params = {
                QueueName: queueName
            };

            self.queueUrlPromises[queueName] = new Promise(function (resolve, reject) {
                self.getClient().getQueueUrl(params, function (error, result) {
                    if (error && error.code == 'AWS.SimpleQueueService.NonExistentQueue') {
                        return self.getCreateQueuePromise(queueName)
                    }

                    self.errorHandler.handle(error);
                    resolve(result.QueueUrl);
                });
            });
        }

        return this.queueUrlPromises[queueName];
    }

    protected getCreateQueuePromise(queueName:string):Promise {
        var self = this;
        return new Promise(function (resolve, reject) {
            self.getClient().createQueue(self.getCreateQueueParams(queueName), function (error:Error, result:AWS.SQS.CreateQueueResult) {
                self.errorHandler.handle(error);
                resolve(result.QueueUrl);
            })
        });
    }

    protected getSendMessageParamsPromise(queueName:string, payload:any):Promise {
        var self = this;

        return self.getQueueUrlPromise(queueName).then(function (queueUrl:string) {
            var params = self.config.defaultQueueConfig.sendMessageParams;

            if (self.config.queueConfigs[queueName] && self.config.queueConfigs[queueName].sendMessageParams) {
                params = lodash.assign(params, self.config.queueConfigs[queueName].sendMessageParams);
            }

            params.QueueUrl = queueUrl;
            params.MessageBody = self.encoder.encode(payload);

            return params;
        });
    }

    protected getReceiveMessageParamsPromise(queueName:string):Promise {
        var self = this;

        return self.getQueueUrlPromise(queueName).then(function (queueUrl:string) {
            var params = self.config.defaultQueueConfig.receiveMessageParams;

            if (self.config.queueConfigs[queueName] && self.config.queueConfigs[queueName].receiveMessageParams) {
                params = lodash.assign(params, self.config.queueConfigs[queueName].receiveMessageParams);
            }

            params.QueueUrl = queueUrl;

            return params;
        });
    }

    protected getCreateQueueParams(queueName:string):AWS.SQS.CreateQueueParams {
        var self = this;

        var params = self.config.defaultQueueConfig.createQueueParams;

        if (self.config.queueConfigs[queueName] && self.config.queueConfigs[queueName].createQueueParams) {
            params = lodash.assign(params, self.config.queueConfigs[queueName].createQueueParams);
        }

        params.QueueName = queueName;

        return params;
    }

    protected getPollFrequencyMilliSeconds(queueName:string):number {
        var self = this;

        var pollFrequencyMilliSeconds = self.config.defaultQueueConfig.pollFrequencyMilliSeconds;

        if (self.config.queueConfigs[queueName] && self.config.queueConfigs[queueName].pollFrequencyMilliSeconds) {
            pollFrequencyMilliSeconds = self.config.queueConfigs[queueName].pollFrequencyMilliSeconds;
        }

        return pollFrequencyMilliSeconds;
    }
}