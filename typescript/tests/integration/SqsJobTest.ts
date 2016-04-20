import * as Chai from 'chai';
import Promise = require('bluebird');
import AWS = require('aws-sdk');
import {SqsJob} from "../../adapter/sqs/SqsJob";
import SqsAdapter = require('../helper/TestableSqsAdapter');
import {JsonEncoder} from "../../encoder/JsonEncoder";
import {StdOutErrorHandler} from "../../handler/error/StdOutErrorHandler";


var encoder = new JsonEncoder();
var errorHandler = new StdOutErrorHandler();


describe('SqsJob', function () {
    describe('#delete()', function () {
        it('returns a promise', function (done) {
            var queueName='test_job';

            SqsAdapter.produce(queueName, {"hey": "ho"}).then(function(){
                SqsAdapter.getReceiveMessageParamsPromise(queueName).then(function (params:AWS.SQS.ReceiveMessageParams) {
                    SqsAdapter.getClient().receiveMessage(params, function (error:Error, result:AWS.SQS.ReceiveMessageResult) {
                        result.Messages.forEach(function (message:AWS.SQS.Message) {
                            var job = new SqsJob(errorHandler, encoder.decode(message.Body), params.QueueUrl, SqsAdapter.getClient(), message);
                            job.delete();
                            done();
                        });
                    });
                });
            });
        });
    });
});
