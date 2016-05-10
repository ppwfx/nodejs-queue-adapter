export interface IConfig {
    defaultConcurrency: number;
    consumeConcurrencies: {[queueName: string]: number};

    getConcurrency(queueName:string):number;
}
