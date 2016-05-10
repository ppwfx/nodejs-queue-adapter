import AWS = require('aws-sdk');
import {IErrorHandler} from "../../handler/error/IErrorHandler";
import {AJob} from "../abstract/AJob";

export class SqsJob extends AJob {
    private queueUrl:string;
    private client:AWS.SQS;
    private message:AWS.SQS.Message;
    private asyncQueueCallback:() => void;

    constructor(errorHandler:IErrorHandler, payload:any, queueUrl:string, client:AWS.SQS, message:AWS.SQS.Message) {
        super(errorHandler, payload);
        this.queueUrl = queueUrl;
        this.client = client;
        this.message = message;
    }

    public addAsyncQueueCallback(asyncQueueCallback:()=>void) {
        this.asyncQueueCallback = asyncQueueCallback;
    }

    public delete():Promise {
        var self = this;

        self.deleted = true;

        var params = {
            QueueUrl: self.queueUrl,
            ReceiptHandle: self.message.ReceiptHandle
        };

        return new Promise(function (resolve, reject) {
            self.client.deleteMessage(params, function (error:Error, data) {
                if (error) {
                    reject(error);
                }

                resolve(data);
            });
        });
    }

    public done() {
        this.asyncQueueCallback();
    }

    public release():Promise {
        var self = this;

        self.released = true;

        var params = {
            QueueUrl: self.queueUrl,
            ReceiptHandle: self.message.ReceiptHandle,
            VisibilityTimeout: 0
        };

        return new Promise(function (resolve, reject) {
            self.client.changeMessageVisibility(params, function (error:Error, data) {
                if (error) {
                    reject(error);
                }

                resolve(data);
            });
        });
    }
}