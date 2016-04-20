"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Rabbitjs = require('rabbit.js');
var Promise = require('bluebird');
var RabbitMqJob_1 = require("./RabbitMqJob");
var QueueAdapter_1 = require("../QueueAdapter");
var RabbitMqAdapter = (function (_super) {
    __extends(RabbitMqAdapter, _super);
    function RabbitMqAdapter() {
        _super.apply(this, arguments);
        this.subscribeConnectionPromises = {};
        this.publishConnectionPromises = {};
    }
    RabbitMqAdapter.prototype.produce = function (queueName, payload) {
        var self = this;
        self.getPublishConnectionPromise(queueName).then(function (publishSocket) {
            publishSocket.write(self.encoder.encode(payload), 'utf8');
        });
    };
    RabbitMqAdapter.prototype.consume = function (queueName, callback) {
        var self = this;
        return self.getSubscribeConnectionPromise(queueName).then(function (subscribeSocket) {
            subscribeSocket.on('data', function (payload) {
                payload = self.encoder.decode(payload);
                var job = new RabbitMqJob_1.RabbitMqJob(self.errorHandler, payload, subscribeSocket);
                callback(job);
            });
        });
    };
    RabbitMqAdapter.prototype.getContextPromise = function () {
        var self = this;
        if (!self.contextPromise) {
            var context = Rabbitjs.createContext(self.getConnectionString(self.config));
            self.contextPromise = new Promise(function (resolve, reject) {
                context.on('ready', function () {
                    resolve(context);
                }.bind(context));
                context.on('error', reject);
            }.bind(context));
        }
        return self.contextPromise;
    };
    RabbitMqAdapter.prototype.getSubscribeSocketPromise = function () {
        var self = this;
        if (!self.subscribeSocketPromise) {
            self.subscribeSocketPromise = self.getContextPromise().then(function (context) {
                return context.socket('WORKER', { persistent: true, prefetch: 1 });
            }.bind(self));
        }
        return self.subscribeSocketPromise;
    };
    //todo see how to enable specific concurrency for each queue consumption
    RabbitMqAdapter.prototype.getSubscribeConnectionPromise = function (queueName) {
        var self = this;
        if (!self.subscribeConnectionPromises[queueName]) {
            self.subscribeConnectionPromises[queueName] = self.getSubscribeSocketPromise().then(function (subscribeSocket) {
                return new Promise(function (resolve, reject) {
                    subscribeSocket.connect(queueName, function () {
                        subscribeSocket.setEncoding('utf8');
                        resolve(subscribeSocket);
                    }.bind(resolve));
                }.bind(subscribeSocket));
            });
        }
        return self.subscribeConnectionPromises[queueName];
    };
    RabbitMqAdapter.prototype.getPublishSocketPromise = function () {
        var self = this;
        if (!self.publishSocketPromise) {
            self.publishSocketPromise = self.getContextPromise().then(function (context) {
                return context.socket('PUSH', { persistent: true });
            }.bind(self));
        }
        return self.publishSocketPromise;
    };
    RabbitMqAdapter.prototype.getPublishConnectionPromise = function (queueName) {
        var self = this;
        if (!self.publishConnectionPromises[queueName]) {
            self.publishConnectionPromises[queueName] = self.getPublishSocketPromise().then(function (publishSocket) {
                return new Promise(function (resolve, reject) {
                    publishSocket.connect(queueName, function () {
                        resolve(publishSocket);
                    }.bind(resolve));
                }.bind(publishSocket));
            });
        }
        return self.publishConnectionPromises[queueName];
    };
    RabbitMqAdapter.prototype.getConnectionString = function (config) {
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
    return RabbitMqAdapter;
}(QueueAdapter_1.QueueAdapter));
exports.RabbitMqAdapter = RabbitMqAdapter;
