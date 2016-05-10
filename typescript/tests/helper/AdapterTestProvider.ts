import * as Chai from 'chai';
import {IJob} from "../../adapter/abstract/IJob";
import {IQueueAdapter} from "../../adapter/abstract/IQueueAdapter";


function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

var testNo = randomInt(0, 99);

export class AdapterTestProvider {
    public static testConcurrencies(adapterName:string, adapter:IQueueAdapter) {
        var self = this;

        describe('Run generic integration test on: ' + adapterName, function () {
            describe('#check double concurrency', function () {
                it('check concurrency: 2', function (done) {
                    self.testConcurrency(adapter, 2, testNo, done)
                });
            });

            describe('#check single concurrency', function () {
                it('check concurrency: 1', function (done) {
                    self.testConcurrency(adapter, 1, testNo, done)
                });
            });
        });
    }

    private static testConcurrency(adapter:IQueueAdapter, concurrency:number, testNo:number, done:() => void) {
        let noMessages = 10;
        let consumeCount = 0;
        let produceCount = 0;
        let currentConcurrency = 0;
        let maxConcurrency = 0;
        let queueName = 'test_concurrency_' + concurrency;
        let countDeliveries = {};


        adapter.consume(queueName, function (job:IJob) {
            console.log("Run: ", queueName, " Consume: ", job.getPayload());

            if (++currentConcurrency > maxConcurrency) {
                maxConcurrency = currentConcurrency;
            }

            countDeliveries[job.getPayload().value]++;

            setTimeout(function () {
                job.delete()
                    .then(function (data) {
                        ++consumeCount;
                        --currentConcurrency;

                        if (consumeCount == noMessages) {
                            console.log("Run: ", queueName, " Max Concurrency: ", maxConcurrency);

                            Chai.assert.equal(consumeCount, noMessages);
                            Chai.assert.equal(concurrency, maxConcurrency);

                            for (var key in countDeliveries) {
                                if (countDeliveries[key] > 1) {
                                    console.log("Run: ", queueName, " Delivered: {value:" + key + "} " + countDeliveries[key] + " times");
                                }
                            }
                            done();
                        }

                        job.done();
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

            }, 3000);
        });

        let interval = setInterval(function () {
            console.log("Run: ", queueName, " Produce: ", {queueName: queueName, testNo: testNo, value: produceCount});

            adapter.produce(queueName, {queueName: queueName, testNo: testNo, value: produceCount})
                .catch(function (error) {
                    console.log(error);
                });

            if (++produceCount == noMessages) {
                clearInterval(interval);
            }
        }, 1000);
    }
}
