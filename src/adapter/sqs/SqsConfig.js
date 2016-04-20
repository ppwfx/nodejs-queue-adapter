"use strict";
var SqsConfig = (function () {
    function SqsConfig() {
        this.apiVersion = '2012-11-05';
        this.signatureVersion = 'v4';
        this.defaultConcurrency = 1;
        this.queueConfigs = {};
        this.defaultQueueConfig = {
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
    return SqsConfig;
}());
exports.SqsConfig = SqsConfig;
