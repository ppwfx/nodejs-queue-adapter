import {RabbitMqQueueConfig} from "../../adapter/rabbitmq/RabbitMqConfig";
import {RabbitMqAdapter} from "../../adapter/rabbitmq/RabbitMqAdapter";
import {JsonEncoder} from "../../encoder/JsonEncoder";
import {StdOutErrorHandler} from "../../handler/error/StdOutErrorHandler";
import concurrencyConfig = require('./ConcurrencyConfig');

class TestableRabbitMqAdapter extends RabbitMqAdapter {

    public getContextPromise():Promise {
        return super.getContextPromise();
    }

    public getSubscribeSocketPromise():Promise {
        return super.getSubscribeSocketPromise();
    }

    public getSubscribeConnectionPromise(queueName:string):Promise {
        return super.getSubscribeConnectionPromise(queueName);
    }

    public getPublishSocketPromise():Promise {
        return super.getPublishSocketPromise();
    }

    public getPublishConnectionPromise(queueName:string):Promise {
        return super.getPublishConnectionPromise(queueName);
    }

    public getConnectionString(config:RabbitMqQueueConfig):string {
        return super.getConnectionString(config);
    }
}

var encoder = new JsonEncoder();
var errorHandler = new StdOutErrorHandler();

var config = new RabbitMqQueueConfig();
config.port=process.env.RABBITMQ_PORT;
config.host=process.env.RABBITMQ_HOST;
config.username=process.env.RABBITMQ_USERNAME;
config.password=process.env.RABBITMQ_PASSWORD;

export = new TestableRabbitMqAdapter(errorHandler, encoder, config, concurrencyConfig);