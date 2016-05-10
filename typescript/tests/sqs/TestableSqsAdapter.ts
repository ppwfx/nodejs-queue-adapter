import AWS = require('aws-sdk');
import {SqsConfig} from "../../adapter/sqs/SqsConfig";
import {JsonEncoder} from "../../encoder/JsonEncoder";
import {SqsAdapter} from "../../adapter/sqs/SqsAdapter";
import {StdOutErrorHandler} from "../../handler/error/StdOutErrorHandler";
import concurrencyConfig = require('./../helper/ConcurrencyConfig');
import {SqsQueueConfig} from "../../adapter/sqs/SqsConfig";

class TestableSqsAdapter extends SqsAdapter {

    public config:SqsConfig;

    public getClient():AWS.SQS {
        return super.getClient();
    }

    public getQueueUrlPromise(queueName:string):Promise {
        return super.getQueueUrlPromise(queueName);
    }

    public getCreateQueuePromise(queueName:string):Promise {
        return super.getCreateQueuePromise(queueName);
    }

    public getSendMessageParamsPromise(queueName:string, payload:any):Promise {
        return super.getSendMessageParamsPromise(queueName, payload);
    }

    public getReceiveMessageParamsPromise(queueName:string):Promise {
        return super.getReceiveMessageParamsPromise(queueName);
    }
}

var encoder = new JsonEncoder();
var errorHandler = new StdOutErrorHandler();

var config = new SqsConfig();
config.accessKeyId = process.env.SQS_ACCESSKEYID;
config.secretAccessKey = process.env.SQS_SECRETACCESSKEY;
config.region = process.env.SQS_REGION;

config.consumeConcurrencies = concurrencyConfig;

var test_concurrency_1_QueueConfig = new SqsQueueConfig();
test_concurrency_1_QueueConfig.pollFrequencyMilliSeconds = 1000;

var test_concurrency_2_QueueConfig = new SqsQueueConfig();
test_concurrency_2_QueueConfig.pollFrequencyMilliSeconds = 1000;

var test_config_QueueConfig = new SqsQueueConfig();
test_config_QueueConfig.pollFrequencyMilliSeconds = 2000;
test_config_QueueConfig.sendMessageParams = {
    QueueUrl: "test_config",
    MessageBody: "test_config",
    DelaySeconds: 100
};
test_config_QueueConfig.receiveMessageParams = {
    QueueUrl: "test_config",
    VisibilityTimeout: 100,
    WaitTimeSeconds: 100
};
test_config_QueueConfig.changeMessageVisibilityParams = {
    QueueUrl: "test_config",
    ReceiptHandle: "test_config",
    VisibilityTimeout: 100
};
test_config_QueueConfig.createQueueParams = {
    QueueName: "test_config",
    Attributes: "test_config",
};
test_config_QueueConfig.getQueueUrlParams = {
    QueueName: "test_config",
    QueueOwnerAWSAccountId: "test_config",
};

config.queueConfigs['test_concurrency_1'] = test_concurrency_1_QueueConfig;
config.queueConfigs['test_concurrency_2'] = test_concurrency_2_QueueConfig;
config.queueConfigs['test_config'] = test_config_QueueConfig;

export = new TestableSqsAdapter(errorHandler, encoder, config);
