import SqsAdapter = require('../helper/TestableSqsAdapter');
import BeanstalkdAdapter = require('../helper/TestableBeanstalkdAdapter');
import RabbitMqAdapter = require('../helper/TestableRabbitMqAdapter');
import ActiveMqAdapter = require('../helper/TestableActiveMqAdapter');
import {Job} from "../../adapter/Job";
import * as Chai from 'chai';
import {QueueAdapter} from "../../adapter/QueueAdapter";

var adapters = {
    SqsAdapter: SqsAdapter,
    BeanstalkdAdapter: BeanstalkdAdapter,
    ActiveMqAdapter: ActiveMqAdapter,
    RabbitMqAdapter: RabbitMqAdapter,
};

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

var testNo = randomInt(0,99);

Object.keys(adapters).forEach(function(key){
    describe('Run generic integration test on: ' + key, function () {
        var adapter = adapters[key];

        describe('#check 1 concurrency', function () {
            it('check 1 concurrency', function (done) {
                test_concurrency(key, adapter, 1, testNo, done)
            });
        });

        describe('#check 2 concurrency', function () {
            it('check 2 concurrency', function (done) {
                test_concurrency(key, adapter, 2, testNo, done)
            });
        });
    });
});

function test_concurrency(adapterName: string, adapter: QueueAdapter, concurrency: number, testNo: number, done: () => void) {
    let noMessages = 6;
    let consumeCount = 0;
    let produceCount = 0;
    let currentConcurrency = 0;
    let maxConcurrency = 0;
    let queueName = 'queueadapter_' + adapterName + '_test_concurrency_' + concurrency;

    adapter.consume(queueName, function (job:Job) {
        console.log(queueName, job.getPayload());

        if(++currentConcurrency > maxConcurrency) {
            maxConcurrency = currentConcurrency;
        }

        setTimeout(function(){
            ++consumeCount;
            --currentConcurrency;

            job.delete();

            if(consumeCount == noMessages) {
                console.log('max concurrency: ', maxConcurrency);

                Chai.assert.equal(consumeCount, noMessages);
                Chai.assert.equal(concurrency, maxConcurrency);

                done();
            }
        }, 900);
    });

    let interval = setInterval(function () {
        adapter.produce(queueName, {value: produceCount, testNo: testNo});

        if(++produceCount == noMessages) {
            clearInterval(interval);
        }
    }, 300);
}