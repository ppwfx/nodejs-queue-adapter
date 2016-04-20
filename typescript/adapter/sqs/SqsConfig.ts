import AWS = require('aws-sdk');
import {IConfig} from "../IConfig";

export interface SqsQueueConfig {
    //http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#sendMessage-property
    sendMessageParams?:AWS.SQS.SendMessageParams;

    //http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#receiveMessage-property
    receiveMessageParams?:AWS.SQS.ReceiveMessageParams;

    //http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#changeMessageVisibility-property
    changeMessageVisibilityParams?:AWS.SQS.ChangeMessageVisibilityParams;

    //http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#createQueue-property
    createQueueParams?:AWS.SQS.CreateQueueParams

    pollFrequencyMilliSeconds?: number;
}

export class SqsConfig implements IConfig {
    apiVersion:string = '2012-11-05';
    accessKeyId:string;
    secretAccessKey:string;
    region:string;
    signatureVersion:string = 'v4';
    defaultConcurrency:number = 1;
    queueConfigs:{[name:string]: SqsQueueConfig} = {};
    defaultQueueConfig:SqsQueueConfig = {
        sendMessageParams: {
            QueueUrl: null,
            MessageBody: null,
            DelaySeconds: 0
        },
        receiveMessageParams: {
            QueueUrl: null,
            VisibilityTimeout: 60,
            WaitTimeSeconds: 5
        },
        changeMessageVisibilityParams: {
            QueueUrl: null,
            ReceiptHandle: null,
            VisibilityTimeout: 0
        },
        createQueueParams: {
            QueueName: null,
            Attributes: null
        },
        pollFrequencyMilliSeconds: 500
    };
}
