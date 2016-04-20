import {IEncoder} from "../encoder/IEncoder";
import {IErrorHandler} from "../handler/error/IErrorHandler";
import {IQueueAdapter} from "./IQueueAdapter";
import {IConfig} from "./IConfig";
import {IJob} from "./IJob";

export class QueueAdapter implements IQueueAdapter{

    protected errorHandler: IErrorHandler;
    protected encoder: IEncoder;
    protected config: IConfig;
    protected consumeConcurrencies: {[queueName: string]: number};
    protected consumedQueues: {[queueName: string]: {}};
    protected producedQueues: {[queueName: string]: {}};

    constructor(errorHandler:IErrorHandler, encoder:IEncoder, config:IConfig, consumeConcurrencies:{[queueName: string]: number}) {
        this.errorHandler = errorHandler;
        this.encoder = encoder;
        this.config = config;
        this.consumeConcurrencies = consumeConcurrencies;
    }

    consume(queueName:string, callback:(job:IJob)=>void) {
        var self = this;

        if(self.consumedQueues[queueName]) {
            throw Error();
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

    protected getConcurrency(queueName: string) {
        var self = this;

        if(self.consumeConcurrencies && self.consumeConcurrencies[queueName]) {
            return this.consumeConcurrencies[queueName];
        }

        return this.config.defaultConcurrency;
    }
}