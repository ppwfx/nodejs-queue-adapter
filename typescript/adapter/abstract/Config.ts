import {IConfig} from "./IConfig";

export class Config implements IConfig {
    defaultConcurrency = 1;
    consumeConcurrencies: {[queueName: string]: number} = {};

    public getConcurrency(queueName: string) {
        var self = this;

        if(self.consumeConcurrencies && self.consumeConcurrencies[queueName]) {
            return this.consumeConcurrencies[queueName];
        }

        return self.defaultConcurrency;
    }
}