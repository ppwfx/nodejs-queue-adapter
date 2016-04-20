export interface IEncoder {
    encode(payload: any): any;
    decode(payload: any): any;
}