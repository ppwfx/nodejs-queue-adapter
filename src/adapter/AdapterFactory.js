"use strict";
var SqsAdapter_1 = require("./sqs/SqsAdapter");
var StdOutErrorHandler_1 = require("../handler/error/StdOutErrorHandler");
var JsonEncoder_1 = require("../encoder/JsonEncoder");
var BeanstalkdAdapter_1 = require("./beanstalkd/BeanstalkdAdapter");
var ActiveMqAdapter_1 = require("./activemq/ActiveMqAdapter");
var RabbitMqAdapter_1 = require("./rabbitmq/RabbitMqAdapter");
var AdapterFactory = (function () {
    function AdapterFactory() {
    }
    AdapterFactory.prototype.create = function (name, config, consumeConcurrence, errorhandler, encoder) {
        if (consumeConcurrence === void 0) { consumeConcurrence = {}; }
        if (errorhandler === void 0) { errorhandler = new StdOutErrorHandler_1.StdOutErrorHandler(); }
        if (encoder === void 0) { encoder = JsonEncoder_1.JsonEncoder; }
        var adapter = null;
        switch (name) {
            case 'sqs':
                adapter = new SqsAdapter_1.SqsAdapter(errorhandler, encoder, config, consumeConcurrence);
                break;
            case 'beanstalkd':
                adapter = new BeanstalkdAdapter_1.BeanstalkdAdapter(errorhandler, encoder, config, consumeConcurrence);
                break;
            case 'activemq':
                adapter = new ActiveMqAdapter_1.ActiveMqAdapter(errorhandler, encoder, config, consumeConcurrence);
                break;
            case 'rabbitmq':
                adapter = new RabbitMqAdapter_1.RabbitMqAdapter(errorhandler, encoder, config, consumeConcurrence);
                break;
            default:
                throw new Error(name + ' is not a supported queue adapter');
        }
        return adapter;
    };
    return AdapterFactory;
}());
exports.AdapterFactory = AdapterFactory;
