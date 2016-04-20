import * as Chai from 'chai';
import Promise = require('bluebird');
import ActiveMqAdapter = require('../helper/TestableActiveMqAdapter');
import {Job} from "../../adapter/Job";

describe('ActiveMqAdapter', function () {
    describe('#produce()', function () {
        describe('#consume()', function () {
            it('produces and consumes a job', function (done) {
                var queueName='queueadapter_test_produce_and_consume';
                ActiveMqAdapter.produce(queueName, {"hey": "ho"}).then(function(){
                    ActiveMqAdapter.consume(queueName, function(job:Job){
                        job.delete();
                        done();
                    });
                });
            });
        });
    });
});
