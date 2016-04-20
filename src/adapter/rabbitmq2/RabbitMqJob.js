"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Job_1 = require("../Job");
var RabbitMqJob = (function (_super) {
    __extends(RabbitMqJob, _super);
    function RabbitMqJob(errorHandler, payload, socket) {
        _super.call(this, errorHandler, payload);
        this.socket = socket;
    }
    RabbitMqJob.prototype.delete = function () {
        _super.prototype.delete.call(this);
        this.socket.ack();
    };
    return RabbitMqJob;
}(Job_1.Job));
exports.RabbitMqJob = RabbitMqJob;
