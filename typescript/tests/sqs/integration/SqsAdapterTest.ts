import * as Chai from 'chai';
import Promise = require('bluebird');
import sqsAdapter = require('./../TestableSqsAdapter');
import {IJob} from "../../../adapter/abstract/IJob";
import {AdapterTestProvider} from "../../helper/AdapterTestProvider";

describe('SqsAdapter', function () {

    describe('#getQueueUrlPromise()', function () {
        it('returns a promise', function (done) {
            var queueUrlPromise = sqsAdapter.getQueueUrlPromise('test');

            Chai.assert.instanceOf(queueUrlPromise, Promise, 'is Instance of promise');
            queueUrlPromise.then(function(queueUrl: string) {
                Chai.assert.isString(queueUrl, 'is a string');

                done();
            });
        });
    });

    describe('#consume()', function () {
        it('produces and consumes a job', function (done) {
            var queueName='queueadapter_test_produce_and_consume';
            sqsAdapter.produce(queueName, {"hey": "ho"}).then(function(){
                sqsAdapter.consume(queueName, function(job:IJob){
                    job.delete();

                    done();
                })
            })
        });
    });

    describe('#produce()', function () {
        it('produces a job', function (done) {
            var queueName='queueadapter_test_produce';
            sqsAdapter.produce(queueName, {"hey": "ho"}).then(function(){
                done();
            })
        });
    });

    AdapterTestProvider.testConcurrencies('SqsAdapter', sqsAdapter);
});
