import AWS = require('aws-sdk');
import lodash = require('lodash');

class SqsBatchRequestManager {

    protected flushMessagesToBeDeletedIntervalHandler;

    protected localSendMessageBatchQueue;
    protected sendMessageBag:{[queueUrl: string]: Array<AWS.SQS.Message>};

    protected localDeleteMessageBatchQueue;
    protected deleteMessageBag:{[queueUrl: string]: Array<AWS.SQS.Message>};

    protected localChangeVisibilityTimoutBatchQueue
    protected client:AWS.SQS;

    constructor(client:AWS.SQS, flushMessagesToBeDeletedIntervalMilliseconds:number) {
        this.client = client;

        this.initializeLocalMessageDeletionQueue();
        this.startFlushMessagesToBeDeletedInterval(flushMessagesToBeDeletedIntervalMilliseconds);
    }

    public deleteMessage(queueUrl:string, message:AWS.SQS.Message) {
        var self = this;

        self.deleteMessageBag[queueUrl].push(message);

        if (self.deleteMessageBag[queueUrl].length >= 10) {
            self.flushMessagesToBeDeleted(queueUrl);
        }
    }

    protected startFlushMessagesToBeDeletedInterval(milliseconds:number) {
        var self = this;

        self.flushMessagesToBeDeletedIntervalHandler = setInterval(function () {
            Object.keys(self.deleteMessageBag).forEach(function (key) {
                self.flushMessagesToBeDeleted(key);
            });
        }, milliseconds)
    }

    protected flushMessagesToBeDeleted(queueUrl:string) {
        var self = this;

        var deleteMessageBag = this.deleteMessageBag[queueUrl];
        self.deleteMessageBag[queueUrl] = [];
        var deleteMessageBagChunks = lodash.chunk(deleteMessageBag, 10);

        deleteMessageBagChunks.forEach(function (chunk:Array<AWS.SQS.Message>) {
            var params = self.getDeleteMessageBatchParams(queueUrl, chunk);
            self.localDeleteMessageBatchQueue.push(params);
        });
    }

    protected initializeLocalMessageDeletionQueue() {
        var self = this;

        self.localDeleteMessageBatchQueue = async.queue(function (params:AWS.SQS.DeleteMessageBatchParams, done:() => void) {
            self.getClient().deleteMessageBatch(params, function (error:Error, result:AWS.SQS.DeleteMessageBatchResult) {
                result.Failed.forEach(function (entry:AWS.SQS.BatchResultErrorEntry) {
                    done();
                })
            })
        });
    }

    protected getDeleteMessageBatchParams(queueUrl:string, messages:Array<AWS.SQS.Message>) {
        var params:AWS.SQS.DeleteMessageBatchParams = {
            Entries: [],
            QueueUrl: queueUrl
        };

        messages.forEach(function (message:AWS.SQS.Message) {
            params.Entries.push({
                Id: message.MessageId,
                ReceiptHandle: message.ReceiptHandle
            })
        });

        return params;
    }

    protected getClient():AWS.SQS {
        return this.client;
    }
}