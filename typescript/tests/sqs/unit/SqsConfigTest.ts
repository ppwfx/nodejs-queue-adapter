import * as Chai from 'chai';
import Promise = require('bluebird');
import sqsAdapter = require('./../TestableSqsAdapter');
import {ConfigTestProvider} from "../../helper/ConfigTestProvider";

describe('SqsConfig', function () {

    var config = sqsAdapter.config;

    describe('#getPollFrequencyMilliSeconds()', function () {
        it('check whether getPollFrequencyMilliSeconds() returns the correct poll frequency for given queues', function (done) {
            Chai.assert.equal(config.getPollFrequencyMilliSeconds('default'), 500);
            Chai.assert.equal(config.getPollFrequencyMilliSeconds('test_concurrency_1'), 1000);
            Chai.assert.equal(config.getPollFrequencyMilliSeconds('test_concurrency_2'), 1000);
            Chai.assert.equal(config.getPollFrequencyMilliSeconds('test_config'), 2000);

            done();
        });
    });

    describe('#getSendMessageParams()', function () {
        it('check whether getSendMessageParams() returns the correct SendMessageParams for given queues', function (done) {
            Chai.assert.deepEqual(config.getSendMessageParams('default', 'default_url', 'default_payload'), {
                QueueUrl: 'default_url',
                MessageBody: 'default_payload',
                DelaySeconds: 0
            });
            Chai.assert.deepEqual(config.getSendMessageParams('test_config', 'test_config', 'test_config'), {
                QueueUrl: 'test_config',
                MessageBody: 'test_config',
                DelaySeconds: 100
            });

            done();
        });
    });

    describe('#getReceiveMessageParams()', function () {
        it('check whether getReceiveMessageParams() returns the correct ReceiveMessageParams for given queues', function (done) {
            Chai.assert.deepEqual(config.getReceiveMessageParams('default', 'default_url'), {
                QueueUrl: 'default_url',
                VisibilityTimeout: 60,
                WaitTimeSeconds: 5
            });
            Chai.assert.deepEqual(config.getReceiveMessageParams('test_config', 'test_config'), {
                QueueUrl: 'test_config',
                VisibilityTimeout: 100,
                WaitTimeSeconds: 100
            });

            done();
        });
    });

    describe('#getCreateQueueParams()', function () {
        it('check whether getPollFrequencyMilliSeconds() returns the correct poll frequency for given queues', function (done) {
            Chai.assert.deepEqual(config.getCreateQueueParams('default'), {
                QueueName: 'default',
                Attributes: null
            });
            Chai.assert.deepEqual(config.getCreateQueueParams('test_config'), {
                QueueName: 'test_config',
                Attributes: 'test_config'
            });

            done();
        });
    });

    describe('#getGetQueueUrlParams()', function () {
        it('check whether getGetQueueUrlParams() returns the correct GetQueueUrlParams for given queues', function (done) {
            Chai.assert.deepEqual(config.getGetQueueUrlParams('default'), {
                QueueName: 'default',
                QueueOwnerAWSAccountId: null
            });
            Chai.assert.deepEqual(config.getGetQueueUrlParams('test_config'), {
                QueueName: 'test_config',
                QueueOwnerAWSAccountId: 'test_config'
            });

            done();
        });
    });

    ConfigTestProvider.testGetConcurrency(config);
});
