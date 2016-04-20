"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Job_1 = require("../Job");
var SqsJob = (function (_super) {
    __extends(SqsJob, _super);
    function SqsJob(errorHandler, payload, queueUrl, client, message) {
        _super.call(this, errorHandler, payload);
        this.queueUrl = queueUrl;
        this.client = client;
        this.message = message;
    }
    SqsJob.prototype.addAsyncQueueCallback = function (asyncQueueCallback) {
        this.asyncQueueCallback = asyncQueueCallback;
    };
    SqsJob.prototype.delete = function () {
        var self = this;
        _super.prototype.delete.call(this);
        var params = {
            QueueUrl: self.queueUrl,
            ReceiptHandle: self.message.ReceiptHandle
        };
        self.client.deleteMessage(params, function (error, data) {
            self.asyncQueueCallback();
            self.errorHandler.handle(error);
        });
    };
    SqsJob.prototype.release = function () {
        var self = this;
        _super.prototype.release.call(this);
        var params = {
            QueueUrl: self.queueUrl,
            ReceiptHandle: self.message.ReceiptHandle,
            VisibilityTimeout: 0
        };
        self.client.changeMessageVisibility(params, function (error, data) {
            self.asyncQueueCallback();
            self.errorHandler.handle(error);
        });
    };
    return SqsJob;
}(Job_1.Job));
exports.SqsJob = SqsJob;
