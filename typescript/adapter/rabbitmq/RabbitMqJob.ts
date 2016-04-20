import {Job} from "../Job";
import * as Rabbitjs from "rabbit.js";
import {IErrorHandler} from "../../handler/error/IErrorHandler";

export class RabbitMqJob extends Job {
    private socket:Rabbitjs.WorkerSocket;

    constructor(errorHandler:IErrorHandler, payload:any, socket:Rabbitjs.WorkerSocket) {
        super(errorHandler, payload);
        this.socket = socket;
    }

    public delete():void {
        super.delete();

        this.socket.ack();
    }
}