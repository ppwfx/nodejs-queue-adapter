# nodejs-queue-adapter

[![Build Status](https://travis-ci.org/21stio/nodejs-queue-adapter.svg?branch=master)](https://travis-ci.org/21stio/nodejs-queue-adapter)
[![Test Coverage](https://codeclimate.com/github/21stio/nodejs-queue-adapter/badges/coverage.svg)](https://codeclimate.com/github/21stio/nodejs-queue-adapter/coverage)

Provides a simple interface to a variety of message queues

### Installation

```sh
npm install queue-adapter
```

### Supported Services

*	AWS SQS powered by [aws-sdk](https://www.npmjs.com/package/aws-sdk)
*	ActiveMq powered by [ampq10](https://www.npmjs.com/package/amqp10)
*	RabbitMq powered by [rabbit.js](https://www.npmjs.com/package/rabbit.js) (experimental)
*   Beanstalkd powered by [fivebeans](https://www.npmjs.com/package/fivebeans) (experimental)

### Usage

A more extensive documentation will be added shortly, please have a look at the tests so far


Basic Javascript

```javascript
var adapter = require('queue-adapter').create('sqs');

adapter.produce("my-queue", {foo: "bar"});

adapter.consume("my-queue", function(job){
    console.log(job.getPayload()); //prints {foo: "bar"}

    job.delete().then(function(){
        jod.done();
    });
});
```

Simple Configuration

```javascript
var sqsAdapter = require('queue-adapter').create('sqs');
var activeMqAdapter = require('queue-adapter').create('activemq');
var beanstalkdAdapter = require('queue-adapter').create('beanstalkd');
var rabbitMqAdapter = require('queue-adapter').create('rabbitmq');
```

Advanced Typescript

```javascript
var adapter = require('queue-adapter').create('sqs');

adapter.produce("my-queue", {foo: "bar"})
    .then(function(){
        console.log("Message sent");
    })
    .catch(function (error) {
        console.log(error);
    });

adapter.consume("my-queue", function(job: IJob){
    console.log(job.getPayload()); //prints {foo: "bar"}

    job.delete().then(function(){
        jod.done();
    });
```