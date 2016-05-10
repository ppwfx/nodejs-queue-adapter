import * as Chai from 'chai';
import {IJob} from "../../adapter/abstract/IJob";
import {IQueueAdapter} from "../../adapter/abstract/IQueueAdapter";
import {IConfig} from "../../adapter/abstract/IConfig";

export class ConfigTestProvider {
    public static testGetConcurrency(config:IConfig){

        describe('#getConcurrency()', function () {
            it('check whether getConcurrency() returns the correct concurrency for given queues', function (done) {
                Chai.assert.equal(config.getConcurrency('default'), 1);
                Chai.assert.equal(config.getConcurrency('test_concurrency_1'), 1);
                Chai.assert.equal(config.getConcurrency('test_concurrency_2'), 2);

                done();
            });
        });
    }
}
