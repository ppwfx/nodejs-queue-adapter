"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BeanstalkdConfig_1 = require("../../adapter/beanstalkd/BeanstalkdConfig");
var BeanstalkdAdapter_1 = require("../../adapter/beanstalkd/BeanstalkdAdapter");
var JsonEncoder_1 = require("../../encoder/JsonEncoder");
var StdOutErrorHandler_1 = require("../../handler/error/StdOutErrorHandler");
var concurrencyConfig = require('./ConcurrencyConfig');
var TestableBeanstalkdAdapter = (function (_super) {
    __extends(TestableBeanstalkdAdapter, _super);
    function TestableBeanstalkdAdapter() {
        _super.apply(this, arguments);
    }
    TestableBeanstalkdAdapter.prototype.getClientPromise = function () {
        return _super.prototype.getClientPromise.call(this);
    };
    return TestableBeanstalkdAdapter;
}(BeanstalkdAdapter_1.BeanstalkdAdapter));
var encoder = new JsonEncoder_1.JsonEncoder();
var errorHandler = new StdOutErrorHandler_1.StdOutErrorHandler();
var config = new BeanstalkdConfig_1.BeanstalkdConfig();
config.port = process.env.BEANSTALKD_PORT;
config.host = process.env.BEANSTALKD_HOST;
module.exports = new TestableBeanstalkdAdapter(errorHandler, encoder, config, concurrencyConfig);
