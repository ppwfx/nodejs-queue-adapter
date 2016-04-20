"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Fivebeans = require('fivebeans');
var Promise = require('bluebird');
var BeanstalkdJob_1 = require("./BeanstalkdJob");
var QueueAdapter_1 = require("../QueueAdapter");
var BeanstalkdAdapter = (function (_super) {
    __extends(BeanstalkdAdapter, _super);
    function BeanstalkdAdapter() {
        _super.apply(this, arguments);
    }
    BeanstalkdAdapter.prototype.getClientPromise = function () {
        var self = this;
        if (!self.clientPromise) {
            var client = new Fivebeans.client(self.config.host, self.config.port);
            return self.clientPromise = new Promise(function (resolve, reject) {
                client
                    .on('connect', function () {
                    resolve(client);
                })
                    .on('error', function (error) {
                    self.errorHandler.handle(error);
                })
                    .on('close', function () {
                })
                    .connect();
            });
        }
        return self.clientPromise;
    };
    //todo add config
    BeanstalkdAdapter.prototype.produce = function (queueName, payload) {
        var self = this;
        self.getClientPromise().then(function (client) {
            client.use(queueName, function (err, tubename) {
                client.put(0, 0, 600, self.encoder.encode(payload), function (error, jobId) {
                    self.errorHandler.handle(error);
                });
            });
        });
    };
    //todo add local queue
    BeanstalkdAdapter.prototype.consume = function (queueName, callback) {
        var self = this;
        self.getClientPromise().then(function (client) {
            client.watch(queueName, function (err, tubename) {
                setInterval(function () {
                    client.reserve(function (error, jobId, payload) {
                        self.errorHandler.handle(error);
                        var job = new BeanstalkdJob_1.BeanstalkdJob(self.errorHandler, self.encoder.decode(payload.toString('utf8')), client, jobId);
                        callback(job);
                    });
                }, 300);
            });
        });
    };
    return BeanstalkdAdapter;
}(QueueAdapter_1.QueueAdapter));
exports.BeanstalkdAdapter = BeanstalkdAdapter;
