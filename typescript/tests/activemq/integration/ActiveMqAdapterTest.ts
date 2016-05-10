import * as Chai from 'chai';
import Promise = require('bluebird');
import activeMqAdapter = require('../TestableActiveMqAdapter');
import {IJob} from "../../../adapter/abstract/IJob";
import {AdapterTestProvider} from "../../helper/AdapterTestProvider";

describe('ActiveMqAdapter', function () {
    describe('#produce()', function () {
        describe('#consume()', function () {
            it('produces and consumes a job', function (done) {
                var queueName='queueadapter_test_produce_and_consume';
                activeMqAdapter.produce(queueName, {"hey": "ho"}).then(function(){
                    activeMqAdapter.consume(queueName, function(job:IJob){
                        job.delete().then(function(){
                            done();
                        });
                    });
                });
            });
        });
    });

    AdapterTestProvider.testConcurrencies('ActiveMqAdapter', activeMqAdapter);
});
