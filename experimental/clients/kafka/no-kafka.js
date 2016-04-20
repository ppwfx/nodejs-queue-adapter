var config = {
    clientId: 'no-kafka-client',
    connectionString: 'kafka:9092',
    asyncCompression: false,
    logger: {
        logLevel: 5,
        logstash: {
            enabled: false
        }
    }
};

var Kafka = require('no-kafka');
var producer = new Kafka.Producer(config);

return producer.init().then(function () {
        return producer.send({
            topic: 'test',
            partition: 0,
            message: {
                value: 'Hello!'
            }
        });
    })
    .then(function (result) {
        console.log('Result', result);
    });