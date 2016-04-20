import {IConfig} from "../IConfig";
import {Config} from "../Config";

export class RabbitMqQueueConfig extends Config {
    port:string;
    host:string;
    username:string;
    password:string;
    vhost:string;
}