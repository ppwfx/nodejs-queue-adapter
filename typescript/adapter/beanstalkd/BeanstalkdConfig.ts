import {Config} from "../abstract/Config";

export class BeanstalkdConfig extends Config {
    host:string = 'localhost';
    port:number = 11300;
}