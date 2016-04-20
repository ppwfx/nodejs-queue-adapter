import {IErrorHandler} from "./IErrorHandler";

export class StdOutErrorHandler implements IErrorHandler{

    handle(error:Error):any {
        if (error) {
            console.log(error);
        }
    }
}