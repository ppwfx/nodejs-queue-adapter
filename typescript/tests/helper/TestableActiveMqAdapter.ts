import {ActiveMqConfig} from "../../adapter/activemq/ActiveMqConfig";
import {ActiveMqAdapter} from "../../adapter/activemq/ActiveMqAdapter";
import {JsonEncoder} from "../../encoder/JsonEncoder";
import {StdOutErrorHandler} from "../../handler/error/StdOutErrorHandler";
import concurrencyConfig = require('./ConcurrencyConfig');

class TestableActiveMqAdapter extends ActiveMqAdapter {

    public getClientPromise():Promise {
        return super.getClientPromise();
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

export = new TestableActiveMqAdapter(errorHandler, encoder, config, concurrencyConfig);