"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Job_1 = require("../Job");
var ActiveMqJob = (function (_super) {
    __extends(ActiveMqJob, _super);
    function ActiveMqJob(errorHandler, payload, receiver, message) {
        _super.call(this, errorHandler, payload);
        this.receiver = receiver;
        this.message = message;
    }
    ActiveMqJob.prototype.delete = function () {
        _super.prototype.delete.call(this);
        this.receiver.accept(this.message);
    };
    ActiveMqJob.prototype.release = function () {
        _super.prototype.release.call(this);
        this.receiver.release(this.message);
    };
    return ActiveMqJob;
}(Job_1.Job));
exports.ActiveMqJob = ActiveMqJob;
