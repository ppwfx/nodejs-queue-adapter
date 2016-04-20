import {BeanstalkdConfig} from "../../adapter/beanstalkd/BeanstalkdConfig";
import {BeanstalkdAdapter} from "../../adapter/beanstalkd/BeanstalkdAdapter";
import {JsonEncoder} from "../../encoder/JsonEncoder";
import {StdOutErrorHandler} from "../../handler/error/StdOutErrorHandler";
import concurrencyConfig = require('./ConcurrencyConfig');

class TestableBeanstalkdAdapter extends BeanstalkdAdapter {

    public getClientPromise():Promise {
        return super.getClientPromise();
    }
}

var encoder = new JsonEncoder();
var errorHandler = new StdOutErrorHandler();

var config = new BeanstalkdConfig();
config.port=process.env.BEANSTALKD_PORT;
config.host=process.env.BEANSTALKD_HOST;

export = new TestableBeanstalkdAdapter(errorHandler, encoder, config, concurrencyConfig);