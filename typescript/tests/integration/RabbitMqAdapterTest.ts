import * as Chai from 'chai';
import Promise = require('bluebird');
import RabbitMqAdapter = require('../helper/TestableRabbitMqAdapter');
import {RabbitMqQueueConfig} from "../../adapter/rabbitmq/RabbitMqConfig";

describe('RabbitMqAdapter', function () {
    describe('#getContextPromise()', function () {
        it('returns a promise', function (done) {
            Chai.assert.instanceOf(RabbitMqAdapter.getContextPromise(), Promise, 'is Instance of promise');

            done();
        });
    });

    describe('#getSubscribeSocketPromise()', function () {
        it('returns a promise', function (done) {
            Chai.assert.instanceOf(RabbitMqAdapter.getSubscribeSocketPromise(), Promise, 'is Instance of promise');

            done();
        });
    });

    describe('#getPublishSocketPromise()', function () {
        it('returns a promise', function (done) {
            Chai.assert.instanceOf(RabbitMqAdapter.getPublishSocketPromise(), Promise, 'is Instance of promise');

            done();
        });
    });

    describe('#getSubscribeConnectionPromise()', function () {
        it('returns a promise', function (done) {
            Chai.assert.instanceOf(RabbitMqAdapter.getSubscribeConnectionPromise('test'), Promise, 'is Instance of promise');

            done();
        });
    });

    describe('#getPublishConnectionPromise()', function () {
        it('returns a promise', function (done) {
            Chai.assert.instanceOf(RabbitMqAdapter.getPublishConnectionPromise('test'), Promise, 'is Instance of promise');

            done();
        });
    });

    describe('#getConnectionString()', function () {
        it('returns a promise', function (done) {
            var config:RabbitMqQueueConfig = {
                defaultConcurrency: 1,
                port: 'port',
                host: 'host',
                username: 'username',
                password: 'password'
            };

            Chai.assert.equal(RabbitMqAdapter.getConnectionString(config), 'amqp://username:password@host:port', 'is correct connection string');

            done();
        });
    });
});
