"use strict";
var lodash = require('lodash');
var SqsBatchRequestManager = (function () {
    function SqsBatchRequestManager(client, flushMessagesToBeDeletedIntervalMilliseconds) {
        this.client = client;
        this.initializeLocalMessageDeletionQueue();
        this.startFlushMessagesToBeDeletedInterval(flushMessagesToBeDeletedIntervalMilliseconds);
    }
    SqsBatchRequestManager.prototype.deleteMessage = function (queueUrl, message) {
        var self = this;
        self.deleteMessageBag[queueUrl].push(message);
        if (self.deleteMessageBag[queueUrl].length >= 10) {
            self.flushMessagesToBeDeleted(queueUrl);
        }
    };
    SqsBatchRequestManager.prototype.startFlushMessagesToBeDeletedInterval = function (milliseconds) {
        var self = this;
        self.flushMessagesToBeDeletedIntervalHandler = setInterval(function () {
            Object.keys(self.deleteMessageBag).forEach(function (key) {
                self.flushMessagesToBeDeleted(key);
            });
        }, milliseconds);
    };
    SqsBatchRequestManager.prototype.flushMessagesToBeDeleted = function (queueUrl) {
        var self = this;
        var deleteMessageBag = this.deleteMessageBag[queueUrl];
        self.deleteMessageBag[queueUrl] = [];
        var deleteMessageBagChunks = lodash.chunk(deleteMessageBag, 10);
        deleteMessageBagChunks.forEach(function (chunk) {
            var params = self.getDeleteMessageBatchParams(queueUrl, chunk);
            self.localDeleteMessageBatchQueue.push(params);
        });
    };
    SqsBatchRequestManager.prototype.initializeLocalMessageDeletionQueue = function () {
        var self = this;
        self.localDeleteMessageBatchQueue = async.queue(function (params, done) {
            self.getClient().deleteMessageBatch(params, function (error, result) {
                result.Failed.forEach(function (entry) {
                    done();
                });
            });
        });
    };
    SqsBatchRequestManager.prototype.getDeleteMessageBatchParams = function (queueUrl, messages) {
        var params = {
            Entries: [],
            QueueUrl: queueUrl
        };
        messages.forEach(function (message) {
            params.Entries.push({
                Id: message.MessageId,
                ReceiptHandle: message.ReceiptHandle
            });
        });
        return params;
    };
    SqsBatchRequestManager.prototype.getClient = function () {
        return this.client;
    };
    return SqsBatchRequestManager;
}());
