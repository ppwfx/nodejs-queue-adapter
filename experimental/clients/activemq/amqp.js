var config = {
    host: process.env.ACTIVEMQ_HOST,
    port: 5672,
    //login: process.env.ACTIVEMQ_LOGIN,
    //password: process.env.ACTIVEMQ_PASSWORD,
    //authMechanism: process.env.ACTIVEMQ_AUTHMETHOD,
    //vhost: process.env.ACTIVEMQ_VHOST,
    //ssl: {
    //    enabled: process.env.ACTIVEMQ_SSL_ENABLED,
    //    keyFile: process.env.ACTIVEMQ_SSL_KEYFILE,
    //    certFile: process.env.ACTIVEMQ_SSL_CERTFILE,
    //    caFile: process.env.ACTIVEMQ_SSL_CAFILE,
    //    rejectUnauthorized: process.env.ACTIVEMQ_SSL_REJECTUNAUTHORIZED
    //}
};


var amqp = require('amqp');


describe('amqp', function () {
    describe('#general_test()', function () {
        it('', function (done) {
            console.log('Hey');
            var connection = amqp.createConnection([config, {}]);
            console.log('Hey1');
            connection.on('ready', function () {
                console.log('Hey2');

                connection.queue('my-queue', function (q) {
                    // Catch all messages
                    q.bind('#');

                    // Receive messages
                    q.subscribe(function (message) {
                        // Print messages to stdout
                        console.log(message);

                        done();
                    });
                }).on('error', function (error) {
                    console.log(error);
                });

                var exc = connection.exchange('amq.topic', function (exchange) {
                    console.log('Exchange ' + exchange.name + ' is open');
                    exchange.publish('my-queue', 'Hi', null, null)

                });
            });
        });
    });
});

