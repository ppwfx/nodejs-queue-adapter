"use strict";
var QueueAdapter = (function () {
    function QueueAdapter(errorHandler, encoder, config, consumeConcurrencies) {
        this.errorHandler = errorHandler;
        this.encoder = encoder;
        this.config = config;
        this.consumeConcurrencies = consumeConcurrencies;
    }
    QueueAdapter.prototype.consume = function (queueName, callback) {
        var self = this;
        if (self.consumedQueues[queueName]) {
            throw Error();
        }
        self.consumedQueues[queueName] = {};
    };
    QueueAdapter.prototype.produce = function (queueName, payload) {
        var self = this;
        if (self.producedQueues[queueName]) {
            throw Error();
        }
        self.producedQueues[queueName] = {};
    };
    QueueAdapter.prototype.getConcurrency = function (queueName) {
        var self = this;
        if (self.consumeConcurrencies && self.consumeConcurrencies[queueName]) {
            return this.consumeConcurrencies[queueName];
        }
        return this.config.defaultConcurrency;
    };
    return QueueAdapter;
}());
exports.QueueAdapter = QueueAdapter;
