"use strict";
var Job = (function () {
    function Job(errorHandler, payload) {
        this.errorHandler = errorHandler;
        this.payload = payload;
    }
    Job.prototype.getPayload = function () {
        return this.payload;
    };
    Job.prototype.delete = function () {
        this.deleted = true;
    };
    Job.prototype.isDeleted = function () {
        return this.deleted;
    };
    Job.prototype.release = function () {
        this.released = true;
    };
    Job.prototype.isRelease = function () {
        return this.released;
    };
    return Job;
}());
exports.Job = Job;
