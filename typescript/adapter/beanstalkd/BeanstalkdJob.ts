import {AJob} from "../abstract/AJob";
import {IErrorHandler} from "../../handler/error/IErrorHandler";

export class BeanstalkdJob extends AJob {
    private client:any;
    private jobId:number;

    constructor(errorHandler:IErrorHandler, payload:any, client:any, jobId:number) {
        super(errorHandler, payload);
        this.client = client;
        this.jobId = jobId;
    }

    public delete():Promise {
        var self = this;

        self.deleted = true;

        return new Promise(function (resolve, reject) {
            self.client.destroy(self.jobId, function (error:Error) {
                if (error) {
                    reject(error);
                }

                resolve();
            });
        });
    }

    public release():Promise {
        var self = this;

        self.released = true;

        return new Promise(function (resolve, reject) {
            self.client.release(self.jobId, 1, 0, function (error:Error) {
                if (error) {
                    reject(error);
                }

                resolve();
            });
        });
    }

    public done():void {

    }
}