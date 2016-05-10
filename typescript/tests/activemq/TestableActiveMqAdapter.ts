import {ActiveMqConfig} from "./../../adapter/activemq/ActiveMqConfig";
import {JsonEncoder} from "../../encoder/JsonEncoder";
import {StdOutErrorHandler} from "../../handler/error/StdOutErrorHandler";
import concurrencyConfig = require('./../helper/ConcurrencyConfig');
import {ActiveMqAdapter} from "../../adapter/activemq/ActiveMqAdapter";

class TestableActiveMqAdapter extends ActiveMqAdapter {

    public getClientPromise(concurrency: number):Promise {
        return super.getClientPromise(concurrency);
    }

    public getSenderPromise(queueName:string):Promise {
        return super.getSenderPromise(queueName);
    }

    public getReceiverPromise(queueName:string):Promise {
        return super.getReceiverPromise(queueName);
    }

    public getConnectionString(config:ActiveMqConfig):string {
        return super.getConnectionString(config);
    }
}

var encoder = new JsonEncoder();
var errorHandler = new StdOutErrorHandler();

var config = new ActiveMqConfig();
config.port=process.env.ACTIVEMQ_PORT;
config.host=process.env.ACTIVEMQ_HOST;
config.username=process.env.ACTIVEMQ_USERNAME;
config.password=process.env.ACTIVEMQ_PASSWORD;

config.consumeConcurrencies = concurrencyConfig;

export = new TestableActiveMqAdapter(errorHandler, encoder, config);