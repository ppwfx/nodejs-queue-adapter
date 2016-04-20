import AWS = require('aws-sdk');
import {SqsConfig} from "../../adapter/sqs/SqsConfig";
import {JsonEncoder} from "../../encoder/JsonEncoder";
import {SqsAdapter} from "../../adapter/sqs/SqsAdapter";
import {StdOutErrorHandler} from "../../handler/error/StdOutErrorHandler";
import concurrencyConfig = require('./ConcurrencyConfig');

class TestableSqsAdapter extends SqsAdapter {

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

    public getCreateQueueParams(queueName:string):AWS.SQS.CreateQueueParams {
        return super.getCreateQueueParams(queueName);
    }

    public getPollFrequencyMilliSeconds(queueName:string):number {
        return super.getPollFrequencyMilliSeconds(queueName);
    }
}

var encoder = new JsonEncoder();
var errorHandler = new StdOutErrorHandler();

var config = new SqsConfig();
config.accessKeyId = process.env.SQS_ACCESSKEYID;
config.secretAccessKey = process.env.SQS_SECRETACCESSKEY;
config.region = process.env.SQS_REGION;

export = new TestableSqsAdapter(errorHandler, encoder, config, concurrencyConfig);
