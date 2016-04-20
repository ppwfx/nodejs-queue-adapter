"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ActiveMqConfig_1 = require("../../adapter/activemq/ActiveMqConfig");
var ActiveMqAdapter_1 = require("../../adapter/activemq/ActiveMqAdapter");
var JsonEncoder_1 = require("../../encoder/JsonEncoder");
var StdOutErrorHandler_1 = require("../../handler/error/StdOutErrorHandler");
var concurrencyConfig = require('./ConcurrencyConfig');
var TestableActiveMqAdapter = (function (_super) {
    __extends(TestableActiveMqAdapter, _super);
    function TestableActiveMqAdapter() {
        _super.apply(this, arguments);
    }
    TestableActiveMqAdapter.prototype.getClientPromise = function () {
        return _super.prototype.getClientPromise.call(this);
    };
    TestableActiveMqAdapter.prototype.getSenderPromise = function (queueName) {
        return _super.prototype.getSenderPromise.call(this, queueName);
    };
    TestableActiveMqAdapter.prototype.getReceiverPromise = function (queueName) {
        return _super.prototype.getReceiverPromise.call(this, queueName);
    };
    TestableActiveMqAdapter.prototype.getConnectionString = function (config) {
        return _super.prototype.getConnectionString.call(this, config);
    };
    return TestableActiveMqAdapter;
}(ActiveMqAdapter_1.ActiveMqAdapter));
var encoder = new JsonEncoder_1.JsonEncoder();
var errorHandler = new StdOutErrorHandler_1.StdOutErrorHandler();
var config = new ActiveMqConfig_1.ActiveMqConfig();
config.port = process.env.ACTIVEMQ_PORT;
config.host = process.env.ACTIVEMQ_HOST;
config.username = process.env.ACTIVEMQ_USERNAME;
config.password = process.env.ACTIVEMQ_PASSWORD;
module.exports = new TestableActiveMqAdapter(errorHandler, encoder, config, concurrencyConfig);
