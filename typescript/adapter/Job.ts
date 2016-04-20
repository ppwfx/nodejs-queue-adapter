import {IErrorHandler} from "../handler/error/IErrorHandler";
import {IJob} from "./IJob";

export class Job implements IJob {
    protected errorHandler: IErrorHandler;
    protected payload: any;
    protected deleted:boolean;
    protected released:boolean;

    constructor(errorHandler: IErrorHandler, payload: any) {
        this.errorHandler = errorHandler;
        this.payload = payload;
    }

    public getPayload(): any {
        return this.payload;
    }

    public delete():void {
        this.deleted = true;
    }

    public isDeleted(): boolean {
        return this.deleted;
    }

    public release():void {
        this.released = true;
    }

    public isRelease(): boolean {
        return this.released;
    }
}
