import * as Chai from 'chai';
import Promise = require('bluebird');
import RabbitMqAdapter = require('../helper/TestableRabbitMqAdapter');

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
});
