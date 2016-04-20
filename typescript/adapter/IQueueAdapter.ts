import {IJob} from "./IJob";

export interface IQueueAdapter {
    consume(queueName:string, callback:(job:IJob) => void);
    produce(queueName:string, payload:any);
}