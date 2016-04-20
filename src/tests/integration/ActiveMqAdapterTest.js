"use strict";
var ActiveMqAdapter = require('../helper/TestableActiveMqAdapter');
describe('ActiveMqAdapter', function () {
    describe('#produce()', function () {
        describe('#consume()', function () {
            it('produces and consumes a job', function (done) {
                var queueName = 'queueadapter_test_produce_and_consume';
                ActiveMqAdapter.produce(queueName, { "hey": "ho" }).then(function () {
                    ActiveMqAdapter.consume(queueName, function (job) {
                        job.delete();
                        done();
                    });
                });
            });
        });
    });
});
