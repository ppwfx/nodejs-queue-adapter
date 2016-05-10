import {AJob} from "../abstract/AJob";
import * as Rabbitjs from "rabbit.js";
import Promise = require('bluebird');
import {IErrorHandler} from "../../handler/error/IErrorHandler";

export class RabbitMqJob extends AJob {
    private socket:Rabbitjs.WorkerSocket;

    constructor(errorHandler:IErrorHandler, payload:any, socket:Rabbitjs.WorkerSocket) {
        super(errorHandler, payload);
        this.socket = socket;
    }

    public delete():Promise {
        return new Promise(function(resolve, reject){
            try {
                this.socket.ack();
                resolve();
            } catch (error: Error){
                reject(error);
            }
        });
    }

    public release():Promise {
        return new Promise(function(resolve, reject){
            try {
                this.socket.ack();
                resolve();
            } catch (error: Error){
                reject(error);
            }
        });
    }

    done():void {}
}