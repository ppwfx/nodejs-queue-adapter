"use strict";
var SqsAdapter = require('../helper/TestableSqsAdapter');
var BeanstalkdAdapter = require('../helper/TestableBeanstalkdAdapter');
var RabbitMqAdapter = require('../helper/TestableRabbitMqAdapter');
var ActiveMqAdapter = require('../helper/TestableActiveMqAdapter');
var Chai = require('chai');
var adapters = {
    SqsAdapter: SqsAdapter,
    BeanstalkdAdapter: BeanstalkdAdapter,
    ActiveMqAdapter: ActiveMqAdapter,
    RabbitMqAdapter: RabbitMqAdapter
};
function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
var testNo = randomInt(0, 99);
Object.keys(adapters).forEach(function (key) {
    describe('Run generic integration test on: ' + key, function () {
        var adapter = adapters[key];
        describe('#check 1 concurrency', function () {
            it('check 1 concurrency', function (done) {
                test_concurrency(key, adapter, 1, testNo, done);
            });
        });
        describe('#check 2 concurrency', function () {
            it('check 2 concurrency', function (done) {
                test_concurrency(key, adapter, 2, testNo, done);
            });
        });
    });
});
function test_concurrency(adapterName, adapter, concurrency, testNo, done) {
    var noMessages = 3;
    var consumeCount = 0;
    var produceCount = 0;
    var currentConcurrency = 0;
    var maxConcurrency = 0;
    var queueName = 'queueadapter_' + adapterName + '_test_concurrency_' + concurrency;
    adapter.consume(queueName, function (job) {
        console.log(queueName, job.getPayload());
        if (++currentConcurrency > maxConcurrency) {
            maxConcurrency = currentConcurrency;
        }
        setTimeout(function () {
            ++consumeCount;
            --currentConcurrency;
            job.delete();
            if (consumeCount == noMessages) {
                console.log('max concurrency: ', maxConcurrency);
                Chai.assert.equal(consumeCount, noMessages);
                Chai.assert.equal(concurrency, maxConcurrency);
                done();
            }
        }, 900);
    });
    var interval = setInterval(function () {
        adapter.produce(queueName, { value: produceCount, testNo: testNo });
        if (++produceCount == noMessages) {
            clearInterval(interval);
        }
    }, 300);
}
