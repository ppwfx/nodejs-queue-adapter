import * as Chai from 'chai';
import Promise = require('bluebird');
import rabbitMqAdapter = require('../TestableRabbitMqAdapter');
import {RabbitMqQueueConfig} from "../../../adapter/rabbitmq/RabbitMqConfig";
import {AdapterTestProvider} from "../../helper/AdapterTestProvider";

describe('rabbitMqAdapter', function () {
    describe('#getContextPromise()', function () {
        it('returns a promise', function (done) {
            Chai.assert.instanceOf(rabbitMqAdapter.getContextPromise(), Promise, 'is Instance of promise');

            done();
        });
    });

    describe('#getSubscribeSocketPromise()', function () {
        it('returns a promise', function (done) {
            Chai.assert.instanceOf(rabbitMqAdapter.getSubscribeSocketPromise(), Promise, 'is Instance of promise');

            done();
        });
    });

    describe('#getPublishSocketPromise()', function () {
        it('returns a promise', function (done) {
            Chai.assert.instanceOf(rabbitMqAdapter.getPublishSocketPromise(), Promise, 'is Instance of promise');

            done();
        });
    });

    describe('#getSubscribeConnectionPromise()', function () {
        it('returns a promise', function (done) {
            Chai.assert.instanceOf(rabbitMqAdapter.getSubscribeConnectionPromise('test'), Promise, 'is Instance of promise');

            done();
        });
    });

    describe('#getPublishConnectionPromise()', function () {
        it('returns a promise', function (done) {
            Chai.assert.instanceOf(rabbitMqAdapter.getPublishConnectionPromise('test'), Promise, 'is Instance of promise');

            done();
        });
    });

    describe('#getConnectionString()', function () {
        it('returns a promise', function (done) {
            var config = new RabbitMqQueueConfig();
            config.port = 1234;
            config.host = 'host';
            config.username = 'username';
            config.password = 'password';

            Chai.assert.equal(rabbitMqAdapter.getConnectionString(config), 'amqp://username:password@host:1234', 'is correct connection string');

            done();
        });
    });

    AdapterTestProvider.testConcurrencies('RabbitMqAdapter', rabbitMqAdapter);
});
