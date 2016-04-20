"use strict";
var SqsJob_1 = require("../../adapter/sqs/SqsJob");
var SqsAdapter = require('../helper/TestableSqsAdapter');
var JsonEncoder_1 = require("../../encoder/JsonEncoder");
var StdOutErrorHandler_1 = require("../../handler/error/StdOutErrorHandler");
var encoder = new JsonEncoder_1.JsonEncoder();
var errorHandler = new StdOutErrorHandler_1.StdOutErrorHandler();
describe('SqsJob', function () {
    describe('#delete()', function () {
        it('returns a promise', function (done) {
            var queueName = 'test_job';
            SqsAdapter.produce(queueName, { "hey": "ho" }).then(function () {
                SqsAdapter.getReceiveMessageParamsPromise(queueName).then(function (params) {
                    SqsAdapter.getClient().receiveMessage(params, function (error, result) {
                        result.Messages.forEach(function (message) {
                            var job = new SqsJob_1.SqsJob(errorHandler, encoder.decode(message.Body), params.QueueUrl, SqsAdapter.getClient(), message);
                            job.delete();
                            done();
                        });
                    });
                });
            });
        });
    });
});
