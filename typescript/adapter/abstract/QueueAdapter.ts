import {IEncoder} from "../../encoder/IEncoder";
import {IErrorHandler} from "../../handler/error/IErrorHandler";
import {IQueueAdapter} from "./IQueueAdapter";
import {IConfig} from "./IConfig";
import {IJob} from "./IJob";
import {OnlyOneConsumerPerQueueError} from "./error/OnlyOneConsumerPerQueueError";

export class QueueAdapter implements IQueueAdapter{

    protected errorHandler: IErrorHandler;
    protected encoder: IEncoder;
    protected config: IConfig;
    protected consumedQueues: {[queueName: string]: {}};
    protected producedQueues: {[queueName: string]: {}};

    constructor(errorHandler:IErrorHandler, encoder:IEncoder, config:IConfig) {
        this.errorHandler = errorHandler;
        this.encoder = encoder;
        this.config = config;
    }

    consume(queueName:string, callback:(job:IJob)=>void) {
        var self = this;

        if(self.consumedQueues[queueName]) {
            throw OnlyOneConsumerPerQueueError();
        }

        self.consumedQueues[queueName] = {};
    }

    produce(queueName:string, payload:any) {
        var self = this;

        if(self.producedQueues[queueName]) {
            throw Error();
        }

        self.producedQueues[queueName] = {};
    }
}