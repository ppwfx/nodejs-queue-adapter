"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SqsConfig_1 = require("../../adapter/sqs/SqsConfig");
var JsonEncoder_1 = require("../../encoder/JsonEncoder");
var SqsAdapter_1 = require("../../adapter/sqs/SqsAdapter");
var StdOutErrorHandler_1 = require("../../handler/error/StdOutErrorHandler");
var concurrencyConfig = require('./ConcurrencyConfig');
var TestableSqsAdapter = (function (_super) {
    __extends(TestableSqsAdapter, _super);
    function TestableSqsAdapter() {
        _super.apply(this, arguments);
    }
    TestableSqsAdapter.prototype.getClient = function () {
        return _super.prototype.getClient.call(this);
    };
    TestableSqsAdapter.prototype.getQueueUrlPromise = function (queueName) {
        return _super.prototype.getQueueUrlPromise.call(this, queueName);
    };
    TestableSqsAdapter.prototype.getCreateQueuePromise = function (queueName) {
        return _super.prototype.getCreateQueuePromise.call(this, queueName);
    };
    TestableSqsAdapter.prototype.getSendMessageParamsPromise = function (queueName, payload) {
        return _super.prototype.getSendMessageParamsPromise.call(this, queueName, payload);
    };
    TestableSqsAdapter.prototype.getReceiveMessageParamsPromise = function (queueName) {
        return _super.prototype.getReceiveMessageParamsPromise.call(this, queueName);
    };
    TestableSqsAdapter.prototype.getCreateQueueParams = function (queueName) {
        return _super.prototype.getCreateQueueParams.call(this, queueName);
    };
    TestableSqsAdapter.prototype.getPollFrequencyMilliSeconds = function (queueName) {
        return _super.prototype.getPollFrequencyMilliSeconds.call(this, queueName);
    };
    return TestableSqsAdapter;
}(SqsAdapter_1.SqsAdapter));
var encoder = new JsonEncoder_1.JsonEncoder();
var errorHandler = new StdOutErrorHandler_1.StdOutErrorHandler();
var config = new SqsConfig_1.SqsConfig();
config.accessKeyId = process.env.SQS_ACCESSKEYID;
config.secretAccessKey = process.env.SQS_SECRETACCESSKEY;
config.region = process.env.SQS_REGION;
module.exports = new TestableSqsAdapter(errorHandler, encoder, config, concurrencyConfig);
