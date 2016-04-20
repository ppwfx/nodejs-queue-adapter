import * as Chai from 'chai';
import Promise = require('bluebird');
import SqsAdapter = require('../helper/TestableSqsAdapter');
import {Job} from "../../adapter/Job";

describe('SqsAdapter', function () {
    describe('#getQueueUrlPromise()', function () {
        it('returns a promise', function (done) {
            var queueUrlPromise = SqsAdapter.getQueueUrlPromise('test');

            Chai.assert.instanceOf(queueUrlPromise, Promise, 'is Instance of promise');
            queueUrlPromise.then(function(queueUrl: string) {
                Chai.assert.isString(queueUrl, 'is a string');

                console.log('The queue url is: ' + queueUrl);

                done();
            });
        });
    });

    describe('#consume()', function () {
        it('produces and consumes a job', function (done) {
            var queueName='queueadapter_test_produce_and_consume';
            SqsAdapter.produce(queueName, {"hey": "ho"}).then(function(){
                SqsAdapter.consume(queueName, function(job:Job){
                    job.delete();
                    done();
                })
            })
        });
    });

    describe('#produce()', function () {
        it('produces a job', function (done) {
            var queueName='queueadapter_test_produce';
            SqsAdapter.produce(queueName, {"hey": "ho"}).then(function(){
                done();
            })
        });
    });
});
