import {IErrorHandler} from "../../handler/error/IErrorHandler";
import {IJob} from "./IJob";

export abstract class AJob implements IJob {

    protected errorHandler: IErrorHandler;
    protected payload: any;
    protected deleted:boolean = false;
    protected released:boolean = false;

    constructor(errorHandler: IErrorHandler, payload: any) {
        this.errorHandler = errorHandler;
        this.payload = payload;
    }

    public getPayload(): any {
        return this.payload;
    }

    public isDeleted(): boolean {
        return this.deleted;
    }

    public isReleased(): boolean {
        return this.released;
    }
}
