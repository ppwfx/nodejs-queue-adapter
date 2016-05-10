import {IConfig} from "../abstract/IConfig";
import {Config} from "../abstract/Config";

export class RabbitMqQueueConfig extends Config {
    host:string = 'localhost';
    port:number = 5762;
    username:string = null;
    password:string = null;
}