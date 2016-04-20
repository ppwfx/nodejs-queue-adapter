import {IErrorHandler} from "../handler/error/IErrorHandler";

export interface IJob {
    getPayload(): any;
    delete():void;
    isDeleted(): boolean;
    release():void;
    isRelease(): boolean;
}
