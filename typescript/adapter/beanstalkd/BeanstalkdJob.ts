import {Job} from "../Job";
import {IErrorHandler} from "../../handler/error/IErrorHandler";

export class BeanstalkdJob extends Job {
    private client: any;
    private jobId: number;

    constructor(errorHandler:IErrorHandler, payload:any, client:any, jobId:number) {
        super(errorHandler, payload);
        this.client = client;
        this.jobId = jobId;
    }

    public delete():void {
        var self = this;

        super.delete();

        self.client.destroy(self.jobId, function(error: Error) {
            self.errorHandler.handle(error);
        });
    }
ê
    public release():void {
        super.release();

        this.client.release(this.jobId);
    }
}