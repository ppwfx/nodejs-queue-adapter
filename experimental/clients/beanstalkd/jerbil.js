"use strict";

//var jerbil = require('jerbil');
//var worker = new jerbil.Worker(process.env.BEANSTALKD_PORT, process.env.BEANSTALKD_HOST)
//var producer = new jerbil.Producer(process.env.BEANSTALKD_PORT, process.env.BEANSTALKD_HOST)
//
//
//producer.connect(function(err) {
//    producer.use('mytube', function(err, tubeName) {
//        var job = {name: 'testjob', someProp: 10}
//        producer.put(job, {priority: 1, delay: 1, ttr: 10}, function(err, jobName) {
//            console.log('Added job', jobName)
//        })
//    })
//})
//
//worker.connect(function(err) {
//    worker.watch('mytube', function(err) {
//        worker.reserve(function(err, jobName, jobData) {
//            console.log('Received job', jobName)
//        })
//    })
//})


//describe('Fivebeans', function () {
//    describe('#scrape()', function () {
//        it('respond with matching records', function (done) {
//
//
//        });
//    });
//});
