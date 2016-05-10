import * as Chai from 'chai';
import Promise = require('bluebird');
import beanstalkdAdapter = require('../TestableBeanstalkdAdapter');
import {AdapterTestProvider} from "../../helper/AdapterTestProvider";

describe('BeanstalkdAdapter', function () {
    AdapterTestProvider.testConcurrencies('BeanstalkdAdapter', beanstalkdAdapter);
});
