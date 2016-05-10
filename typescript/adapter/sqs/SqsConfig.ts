import AWS = require('aws-sdk');
import {IConfig} from "../abstract/IConfig";
import lodash = require('lodash');
import {Config} from "../abstract/Config";

export class SqsQueueConfig {
    //http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#sendMessage-property
    sendMessageParams:AWS.SQS.SendMessageParams = {
        QueueUrl: null,
        MessageBody: null,
        DelaySeconds: 0
    };

    //http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#receiveMessage-property
    receiveMessageParams:AWS.SQS.ReceiveMessageParams = {
        QueueUrl: null,
        VisibilityTimeout: 60,
        WaitTimeSeconds: 5
    };

    //http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#changeMessageVisibility-property
    changeMessageVisibilityParams:AWS.SQS.ChangeMessageVisibilityParams = {
        QueueUrl: null,
        ReceiptHandle: null,
        VisibilityTimeout: 0
    };

    //http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#createQueue-property
    createQueueParams:AWS.SQS.CreateQueueParams = {
        QueueName: null,
        Attributes: null
    };

    getQueueUrlParams: AWS.SQS.GetQueueUrlParams = {
        QueueName: null,
        QueueOwnerAWSAccountId: null
    };

    pollFrequencyMilliSeconds:number = 500;
}

export class SqsConfig extends Config {
    apiVersion:string = '2012-11-05';
    accessKeyId:string;
    secretAccessKey:string;
    region:string;
    signatureVersion:string = 'v4';
    defaultConcurrency:number = 1;
    queueConfigs:{[name:string]: SqsQueueConfig} = {};
    defaultQueueConfig:SqsQueueConfig = new SqsQueueConfig();

    public getSendMessageParams(queueName:string, queueUrl:string, payload:string):AWS.SQS.SendMessageParams {
        var self = this;

        var params:AWS.SQS.SendMessageParams = lodash.assign({}, self.defaultQueueConfig.sendMessageParams);

        if (self.queueConfigs[queueName] && self.queueConfigs[queueName].sendMessageParams) {
            params = lodash.assign(params, self.queueConfigs[queueName].sendMessageParams);
        }

        params.QueueUrl = queueUrl;
        params.MessageBody = payload;

        return params;
    }

    public getReceiveMessageParams(queueName:string, queueUrl:string):AWS.SQS.ReceiveMessageParams {
        var self = this;

        var params:AWS.SQS.ReceiveMessageParams = lodash.assign({}, self.defaultQueueConfig.receiveMessageParams);

        if (self.queueConfigs[queueName] && self.queueConfigs[queueName].receiveMessageParams) {
            params = lodash.assign(params, self.queueConfigs[queueName].receiveMessageParams);
        }

        params.QueueUrl = queueUrl;

        return params;
    }

    public getCreateQueueParams(queueName:string):AWS.SQS.CreateQueueParams {
        var self = this;

        var params:AWS.SQS.CreateQueueParams = lodash.assign({}, self.defaultQueueConfig.createQueueParams);

        if (self.queueConfigs[queueName] && self.queueConfigs[queueName].createQueueParams) {
            params = lodash.assign(params, self.queueConfigs[queueName].createQueueParams);
        }

        params.QueueName = queueName;

        return params;
    }

    public getGetQueueUrlParams(queueName):AWS.SQS.GetQueueUrlParams {
        var self = this;

        var params:AWS.SQS.GetQueueUrlParams = lodash.assign({}, self.defaultQueueConfig.getQueueUrlParams);

        if (self.queueConfigs[queueName] && self.queueConfigs[queueName].getQueueUrlParams) {
            params = lodash.assign(params, self.queueConfigs[queueName].getQueueUrlParams);
        }

        params.QueueName = queueName;

        return params;
    }

    public getPollFrequencyMilliSeconds(queueName:string):number {
        var self = this;

        var pollFrequencyMilliSeconds = self.defaultQueueConfig.pollFrequencyMilliSeconds;

        if (self.queueConfigs[queueName] && self.queueConfigs[queueName].pollFrequencyMilliSeconds) {
            pollFrequencyMilliSeconds = self.queueConfigs[queueName].pollFrequencyMilliSeconds;
        }

        return pollFrequencyMilliSeconds;
    }
}
