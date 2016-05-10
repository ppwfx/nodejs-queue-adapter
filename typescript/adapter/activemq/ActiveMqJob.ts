import {AJob} from "../abstract/AJob";
import {IErrorHandler} from "../../handler/error/IErrorHandler";

export class ActiveMqJob extends AJob {
    private receiver:any;
    private message:any;

    constructor(errorHandler:IErrorHandler, payload:any, receiver:any, message:any) {
        super(errorHandler, payload);
        this.receiver = receiver;
        this.message = message;
    }

    public delete():Promise {
        var self = this;

        self.deleted = true;

        return new Promise(function (resolve, reject) {
            resolve(self.receiver.accept(self.message));
        });
    }

    public release():Promise {
        var self = this;

        self.released = true;

        return new Promise(function (resolve, reject) {
            resolve(self.receiver.reject(self.message));
        });
    }

    done():void {
    }
}