import {IErrorHandler} from "../../handler/error/IErrorHandler";

export interface IJob {
    getPayload(): any;
    delete():Promise;
    isDeleted(): boolean;
    release():Promise;
    done():void;
    isReleased(): boolean;
}
