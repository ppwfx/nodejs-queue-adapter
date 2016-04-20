"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Promise = require('bluebird');
var Amqp10 = require('amqp10');
var ActiveMqJob_1 = require("./ActiveMqJob");
var QueueAdapter_1 = require("../QueueAdapter");
var ActiveMqAdapter = (function (_super) {
    __extends(ActiveMqAdapter, _super);
    function ActiveMqAdapter(errorHandler, encoder, config, consumeConcurrencies) {
        _super.call(this, errorHandler, encoder, config, consumeConcurrencies);
        this.clientPromises = {};
        this.receiverPromises = {};
        this.senderPromises = {};
    }
    ActiveMqAdapter.prototype.consume = function (queueName, callback) {
        var self = this;
        self.getReceiverPromise(queueName).then(function (receiver) {
            receiver.on('message', function (message) {
                var job = new ActiveMqJob_1.ActiveMqJob(self.errorHandler, message.body, receiver, message);
                callback(job);
            });
        });
    };
    ActiveMqAdapter.prototype.produce = function (queueName, message) {
        var self = this;
        return self.getSenderPromise(queueName).then(function (sender) {
            return sender.send(message);
        });
    };
    ActiveMqAdapter.prototype.getClientPromiseYo = function (concurrency) {
        var self = this;
        if (!self.clientPromises[concurrency]) {
            var client = new Amqp10.Client(Amqp10.Policy.Utils.RenewOnSettle(concurrency, concurrency, Amqp10.Policy.ServiceBusQueue));
            self.clientPromises[concurrency] = new Promise(function (resolve, reject) {
                client.connect(self.getConnectionString(self.config))
                    .then(function () {
                    resolve(client);
                })
                    .error(reject);
            });
        }
        return self.clientPromises[concurrency];
    };
    ActiveMqAdapter.prototype.getSenderPromise = function (queueName) {
        var self = this;
        var concurrency = self.getConcurrency(queueName);
        if (!self.senderPromises[queueName]) {
            self.senderPromises[queueName] = self.getClientPromiseYo(concurrency).then(function (client) {
                return client.createSender(queueName);
            });
        }
        return self.senderPromises[queueName];
    };
    ActiveMqAdapter.prototype.getReceiverPromise = function (queueName) {
        var self = this;
        var concurrency = self.getConcurrency(queueName);
        if (!self.receiverPromises[queueName]) {
            self.receiverPromises[queueName] = self.getClientPromiseYo(concurrency).then(function (client) {
                return client.createReceiver(queueName);
            });
        }
        return self.receiverPromises[queueName];
    };
    ActiveMqAdapter.prototype.getConnectionString = function (config) {
        var connectionString = 'amqp://';
        if (config.username && config.password) {
            connectionString += config.username + ':' + config.password + '@';
        }
        connectionString += config.host;
        if (config.port) {
            connectionString += ':' + config.port;
        }
        return connectionString;
    };
    return ActiveMqAdapter;
}(QueueAdapter_1.QueueAdapter));
exports.ActiveMqAdapter = ActiveMqAdapter;
