"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Job_1 = require("../Job");
var BeanstalkdJob = (function (_super) {
    __extends(BeanstalkdJob, _super);
    function BeanstalkdJob(errorHandler, payload, client, jobId) {
        _super.call(this, errorHandler, payload);
        this.client = client;
        this.jobId = jobId;
    }
    BeanstalkdJob.prototype.delete = function () {
        var self = this;
        _super.prototype.delete.call(this);
        self.client.destroy(self.jobId, function (error) {
            self.errorHandler.handle(error);
        });
    };
    BeanstalkdJob.prototype.release = function () {
        _super.prototype.release.call(this);
        this.client.release(this.jobId);
    };
    return BeanstalkdJob;
}(Job_1.Job));
exports.BeanstalkdJob = BeanstalkdJob;
