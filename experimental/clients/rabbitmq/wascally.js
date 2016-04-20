var rabbit = require('wascally');

rabbit.configure({
    // arguments used to establish a connection to a broker
    connection: {
        user: process.env.RABBITMQ_USERNAME,
        pass: process.env.RABBITMQ_PASSWORD,
        server: process.env.RABBITMQ_HOST,
        port: process.env.RABBITMQ_PORT,
        vhost: '%2f'
    },

    // define the exchanges
    exchanges: [
        {
            name: 'wascally-pubsub-requests-x',
            type: 'direct',
            autoDelete: true
        },
        {
            name: 'wascally-pubsub-messages-x',
            type: 'fanout',
            autoDelete: true
        }
    ],

    // setup the queues, only subscribing to the one this service
    // will consume messages from
    queues: [
        {
            name: 'wascally-pubsub-requests-q',
            autoDelete: true,
            subscribe: true,
            limit: 1
        },
        {
            name: 'wascally-pubsub-messages-q',
            autoDelete: true,
            subscribe: true,
            limit: 1
        }
    ],

    // binds exchanges and queues to one another
    bindings: [
        {
            exchange: 'wascally-pubsub-requests-x',
            target: 'wascally-pubsub-requests-q',
            keys: ['']
        },
        {
            exchange: 'wascally-pubsub-messages-x',
            target: 'wascally-pubsub-messages-q',
            keys: []
        }
    ]
});

// always setup your message handlers first

// this handler will respond to the subscriber request and trigger
// sending a bunch of messages
//rabbit.handle('subscriber.request', function (msg) {
//    console.log('Got subscriber request');
//    // replying to the message also ack's it to the queue
//    msg.reply({getReady: 'forawesome'}, 'publisher.response');
//    publish(msg.body.expected);
//});

// it can make a lot of sense to share topology definition across
// services that will be using the same topology to avoid
// scenarios where you have race conditions around when
// exchanges, queues or bindings are in place

function publish(total) {
    for (var i = 0; i < total; i++) {
        rabbit.publish('wascally-pubsub-messages-x', {
            type: 'publisher.message',
            body: {message: 'Message ' + i}
        });
    }
}

// variable to hold the timeout
var timeout;

// variable to hold starting time
var started;

// variable to hold received count
var received = 0;

// expected message count
var expected = 5;

// always setup your message handlers first

// this handler will handle messages sent from the publisher
var currentConcurrency = 0;
var maxConcurrency = 0;

rabbit.handle( 'publisher.message', function( msg ) {
    if(++currentConcurrency > maxConcurrency){
        maxConcurrency = currentConcurrency;
    }

    console.log( 'Received:', JSON.stringify( msg.body ) );

    setTimeout(function(){
        --currentConcurrency;
        msg.ack();
        if( ( ++received ) === expected ) {
            console.log( 'Received', received, 'messages after', ( Date.now() - started ), 'milliseconds' );
            console.log('max concurrency: ', maxConcurrency);
        }
    }, 1000);

} );


setTimeout(function(){
    publish(expected);
}, 3000);

// it can make a lot of sense to share topology definition across
// services that will be using the same topology to avoid
// scenarios where you have race conditions around when
// exchanges, queues or bindings are in place

// now that our handlers are set up and topology is defined,
// we can publish a request to let the publisher know we're up
// and ready for messages.

// because we will re-publish after a timeout, the messages will
// expire if not picked up from the queue in time.
// this prevents a bunch of requests from stacking up in the request
// queue and causing the publisher to send multiple bundles
//var requestCount = 0;
//notifyPublisher();
//
//
//
//function notifyPublisher() {
//    console.log( 'Sending request', ++requestCount );
//    rabbit.request( 'wascally-pubsub-requests-x', {
//        type: 'subscriber.request',
//        expiresAfter: 2500,
//        routingKey: '',
//        body: { ready: true, expected: expected }
//    } ).then( function( response ) {
//        started = Date.now();
//        // if we get a response, cancel any existing timeout
//        if( timeout ) {
//            clearTimeout( timeout );
//        }
//        response.ack();
//        console.log( 'Publisher replied.' );
//    } );
//    timeout = setTimeout( notifyPublisher, 3000 );
//}