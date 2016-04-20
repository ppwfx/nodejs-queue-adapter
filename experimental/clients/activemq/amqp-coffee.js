var config= {
    host: process.env.ACTIVEMQ_HOST,
    port: 5672,
    login: 'admin',
    password: 'admin',
    //vhost: process.env.ACTIVEMQ_VHOST,
    //heartbeat: 10000,
    //reconnect: true,
    //reconnectDelayTime: 1000,
    //hostRandom: false,
    //temporaryChannelTimeout: 2000,
    //connectionTimeout: 30000,
    //clientProperties : {},
    //ssl: process.env.ACTIVEMQ_SSL_ENABLED,
    //sslOptions: {
    //    cert: process.env.ACTIVEMQ_SSL_KEYFILE,
    //    key: process.env.ACTIVEMQ_SSL_CERTFILE,
    //    ca: process.env.ACTIVEMQ_SSL_CAFILE,
    //    secureProtocol: null,
    //    passphrase: null
    //}
};

console.log(config);

amqp = require('amqp-coffee')

describe('amqp-coffee', function () {
    describe('#general_test()', function () {
        it('', function (done) {
            console.log('bzz0');
            ampqClient = new amqp(config, function(error){
                console.log('bzz1');

                amqpClient.queue({name:'testQueue'}).declare().bind('amq.direct', 'testRoutingKey', function(){
                    expectedMessages = 3;
                    recievedMessages = 0;

                    consumer = amqpClient.consume('testQueue', {}, function(message){
                        console.error("Got Message:", message.data);
                        recievedMessages++;

                        if (recievedMessages == expectedMessages) {
                            console.error("Recieved all expected messages");

                            consumer.close(function() {
                                console.error("Closed the consumer");
                            });

                            amqpClient.close(function() {
                                console.error("Closed the connection");
                            });

                            done();
                        }
                    });

                    amqpClient.publish('amq.direct', 'testRoutingKey', 'testMessage');
                    amqpClient.publish('amq.direct', 'testRoutingKey', {json: 'this is a json object'});
                    amqpClient.publish('amq.direct', 'testRoutingKey', new Buffer(3));

                });

                console.log('yo');
            }).on('error', function(){
                console.log('Its error');
            }).on('ready', function(){
                console.log('Its ready');
            }).on('close', function(){
                console.log('Its close');
            });

        });
    });
});

