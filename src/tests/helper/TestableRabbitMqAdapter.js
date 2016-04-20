"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RabbitMqConfig_1 = require("../../adapter/rabbitmq/RabbitMqConfig");
var RabbitMqAdapter_1 = require("../../adapter/rabbitmq/RabbitMqAdapter");
var JsonEncoder_1 = require("../../encoder/JsonEncoder");
var StdOutErrorHandler_1 = require("../../handler/error/StdOutErrorHandler");
var concurrencyConfig = require('./ConcurrencyConfig');
var TestableRabbitMqAdapter = (function (_super) {
    __extends(TestableRabbitMqAdapter, _super);
    function TestableRabbitMqAdapter() {
        _super.apply(this, arguments);
    }
    TestableRabbitMqAdapter.prototype.getContextPromise = function () {
        return _super.prototype.getContextPromise.call(this);
    };
    TestableRabbitMqAdapter.prototype.getSubscribeSocketPromise = function () {
        return _super.prototype.getSubscribeSocketPromise.call(this);
    };
    TestableRabbitMqAdapter.prototype.getSubscribeConnectionPromise = function (queueName) {
        return _super.prototype.getSubscribeConnectionPromise.call(this, queueName);
    };
    TestableRabbitMqAdapter.prototype.getPublishSocketPromise = function () {
        return _super.prototype.getPublishSocketPromise.call(this);
    };
    TestableRabbitMqAdapter.prototype.getPublishConnectionPromise = function (queueName) {
        return _super.prototype.getPublishConnectionPromise.call(this, queueName);
    };
    TestableRabbitMqAdapter.prototype.getConnectionString = function (config) {
        return _super.prototype.getConnectionString.call(this, config);
    };
    return TestableRabbitMqAdapter;
}(RabbitMqAdapter_1.RabbitMqAdapter));
var encoder = new JsonEncoder_1.JsonEncoder();
var errorHandler = new StdOutErrorHandler_1.StdOutErrorHandler();
var config = new RabbitMqConfig_1.RabbitMqQueueConfig();
config.port = process.env.RABBITMQ_PORT;
config.host = process.env.RABBITMQ_HOST;
config.username = process.env.RABBITMQ_USERNAME;
config.password = process.env.RABBITMQ_PASSWORD;
module.exports = new TestableRabbitMqAdapter(errorHandler, encoder, config, concurrencyConfig);
