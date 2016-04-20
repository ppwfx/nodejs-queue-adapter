import {Job} from "../Job";
import {IErrorHandler} from "../../handler/error/IErrorHandler";

export class ActiveMqJob extends Job {
    private receiver: any;
    private message: any;

    constructor(errorHandler:IErrorHandler, payload:any, receiver:any, message:any) {
        super(errorHandler, payload);
        this.receiver = receiver;
        this.message = message;
    }

    public delete():void {
        super.delete();

        this.receiver.accept(this.message);
    }

    public release():void {
        super.release();

        this.receiver.release(this.message);
    }
}