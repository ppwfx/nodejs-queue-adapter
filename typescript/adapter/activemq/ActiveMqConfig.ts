import {Config} from "../abstract/Config";

export class ActiveMqConfig extends Config {
    host:string = 'localhost';
    port:number = 5672;
    username:string;
    password:string;
}