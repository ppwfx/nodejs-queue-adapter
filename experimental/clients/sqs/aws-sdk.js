var AWS = require('aws-sdk');

var config = {
    apiVersion: '2012-11-05',
    accessKeyId: 'AKIAIVJPSZBVAQ3I3DDQ',
    secretAccessKey: '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',
    region: 'eu-central-1',
    signatureVersion: 'v4'
};


var queueName = 'queueadaptertest';
var sqs = new AWS.SQS(config);

var params = {
    QueueName: queueName
};

sqs.getQueueUrl(params, function(err, data) {
    if (err) console.log(err, err.stack);
    else     console.log(data);
});

var params = {
    QueueName: queueName
};

sqs.createQueue(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
    /*
     data = {
     QueueUrl: "https://queue.amazonaws.com/012345678910/MyQueue"
     }
     */
});

var params = {
    MessageBody: 'STRING_VALUE', /* required */
    QueueUrl: 'STRING_VALUE', /* required */
    DelaySeconds: 0,
    MessageAttributes: {
        someKey: {
            DataType: 'STRING_VALUE', /* required */
            BinaryListValues: [
                new Buffer('...') || 'STRING_VALUE',
                /* more items */
            ],
            BinaryValue: new Buffer('...') || 'STRING_VALUE',
            StringListValues: [
                'STRING_VALUE',
                /* more items */
            ],
            StringValue: 'STRING_VALUE'
        },
        /* anotherKey: ... */
    }
};
sqs.sendMessage(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
});