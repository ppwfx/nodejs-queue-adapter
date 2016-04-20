import {Job} from "../Job";
import AWS = require('aws-sdk');
import {IErrorHandler} from "../../handler/error/IErrorHandler";

export class SqsJob extends Job {
    private queueUrl: string;
    private client: AWS.SQS;
    private message: AWS.SQS.Message;
    private asyncQueueCallback: () => void;

    constructor(errorHandler: IErrorHandler, payload:any, queueUrl: string, client:AWS.SQS, message:AWS.SQS.Message) {
        super(errorHandler, payload);
        this.queueUrl = queueUrl;
        this.client = client;
        this.message = message;
    }

    public addAsyncQueueCallback(asyncQueueCallback: ()=>void) {
        this.asyncQueueCallback = asyncQueueCallback;
    }

    public delete():void {
        var self = this;

        super.delete();

        var params = {
            QueueUrl: self.queueUrl,
            ReceiptHandle: self.message.ReceiptHandle
        };

        self.client.deleteMessage(params, function(error: Error, data) {
            self.asyncQueueCallback();
            self.errorHandler.handle(error);
        });
    }

    public release():void {
        var self = this;

        super.release();

        var params = {
            QueueUrl: self.queueUrl,
            ReceiptHandle: self.message.ReceiptHandle,
            VisibilityTimeout: 0
        };

        self.client.changeMessageVisibility(params, function(error: Error, data) {
            self.asyncQueueCallback();
            self.errorHandler.handle(error)
        });
    }
}