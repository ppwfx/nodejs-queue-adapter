"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Promise = require('bluebird');
var AWS = require('aws-sdk');
var SqsJob_1 = require("./SqsJob");
var QueueAdapter_1 = require("../QueueAdapter");
var async = require('async');
var lodash = require('lodash');
var SqsAdapter = (function (_super) {
    __extends(SqsAdapter, _super);
    function SqsAdapter(errorHandler, encoder, config, consumeConcurrencies) {
        _super.call(this, errorHandler, encoder, config, consumeConcurrencies);
        this.queueUrlPromises = {};
    }
    SqsAdapter.prototype.produce = function (queueName, payload) {
        var self = this;
        return new Promise(function (resolve, reject) {
            self.getSendMessageParamsPromise(queueName, payload).then(function (params) {
                self.getClient().sendMessage(params, function (error, result) {
                    self.errorHandler.handle(error);
                    resolve();
                });
            });
        });
    };
    SqsAdapter.prototype.consume = function (queueName, callback) {
        var self = this;
        self.getReceiveMessageParamsPromise(queueName).then(function (params) {
            var asyncQueue = async.queue(function (job, asyncQueueCallback) {
                function yo() {
                    asyncQueueCallback();
                    asyncQueue.empty();
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
                    self.getClient().receiveMessage(params, function (error, result) {
                        if (result.Messages && result.Messages.length != 0) {
                            result.Messages.forEach(function (message) {
                                var job = new SqsJob_1.SqsJob(self.errorHandler, self.encoder.decode(message.Body), params.QueueUrl, self.client, message);
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
        });
    };
    SqsAdapter.prototype.getClient = function () {
        var self = this;
        if (!self.client) {
            self.client = new AWS.SQS(self.config);
        }
        return self.client;
    };
    SqsAdapter.prototype.getQueueUrlPromise = function (queueName) {
        var self = this;
        if (!self.queueUrlPromises[queueName]) {
            var params = {
                QueueName: queueName
            };
            self.queueUrlPromises[queueName] = new Promise(function (resolve, reject) {
                self.getClient().getQueueUrl(params, function (error, result) {
                    if (error && error.code == 'AWS.SimpleQueueService.NonExistentQueue') {
                        return self.getCreateQueuePromise(queueName);
                    }
                    self.errorHandler.handle(error);
                    resolve(result.QueueUrl);
                });
            });
        }
        return this.queueUrlPromises[queueName];
    };
    SqsAdapter.prototype.getCreateQueuePromise = function (queueName) {
        var self = this;
        return new Promise(function (resolve, reject) {
            self.getClient().createQueue(self.getCreateQueueParams(queueName), function (error, result) {
                self.errorHandler.handle(error);
                resolve(result.QueueUrl);
            });
        });
    };
    SqsAdapter.prototype.getSendMessageParamsPromise = function (queueName, payload) {
        var self = this;
        return self.getQueueUrlPromise(queueName).then(function (queueUrl) {
            var params = self.config.defaultQueueConfig.sendMessageParams;
            if (self.config.queueConfigs[queueName] && self.config.queueConfigs[queueName].sendMessageParams) {
                params = lodash.assign(params, self.config.queueConfigs[queueName].sendMessageParams);
            }
            params.QueueUrl = queueUrl;
            params.MessageBody = self.encoder.encode(payload);
            return params;
        });
    };
    SqsAdapter.prototype.getReceiveMessageParamsPromise = function (queueName) {
        var self = this;
        return self.getQueueUrlPromise(queueName).then(function (queueUrl) {
            var params = self.config.defaultQueueConfig.receiveMessageParams;
            if (self.config.queueConfigs[queueName] && self.config.queueConfigs[queueName].receiveMessageParams) {
                params = lodash.assign(params, self.config.queueConfigs[queueName].receiveMessageParams);
            }
            params.QueueUrl = queueUrl;
            return params;
        });
    };
    SqsAdapter.prototype.getCreateQueueParams = function (queueName) {
        var self = this;
        var params = self.config.defaultQueueConfig.createQueueParams;
        if (self.config.queueConfigs[queueName] && self.config.queueConfigs[queueName].createQueueParams) {
            params = lodash.assign(params, self.config.queueConfigs[queueName].createQueueParams);
        }
        params.QueueName = queueName;
        return params;
    };
    SqsAdapter.prototype.getPollFrequencyMilliSeconds = function (queueName) {
        var self = this;
        var pollFrequencyMilliSeconds = self.config.defaultQueueConfig.pollFrequencyMilliSeconds;
        if (self.config.queueConfigs[queueName] && self.config.queueConfigs[queueName].pollFrequencyMilliSeconds) {
            pollFrequencyMilliSeconds = self.config.queueConfigs[queueName].pollFrequencyMilliSeconds;
        }
        return pollFrequencyMilliSeconds;
    };
    return SqsAdapter;
}(QueueAdapter_1.QueueAdapter));
exports.SqsAdapter = SqsAdapter;
