import {IEncoder} from "./IEncoder";

export class JsonEncoder implements IEncoder{

    encode(payload:any):any {
        return JSON.stringify(payload);
    }

    decode(payload:string):any {
        return JSON.parse(payload);
    }
}