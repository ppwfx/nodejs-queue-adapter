"use strict";

var fivebeans = require('fivebeans');

var client = new fivebeans.client(process.env.BEANSTALKD_HOST, process.env.BEANSTALKD_PORT);
client
    .on('connect', function()
    {
        //console.log('a')
    })
    .on('error', function(err)
    {
        //console.log('b')// connection failure
    })
    .on('close', function()
    {
        //console.log('c')
    })
    .connect();



describe('fivebeans', function () {
    describe('#list_tubes()', function () {
        it('', function (done) {
            client.list_tubes(function(err, tubenames) {
                console.log(tubenames);

                done();
            });
        });
    });

    describe('#use()', function () {
        it('', function (done) {
            client.use('test', function(err, tubename) {
                console.log(tubename);

                done();
            });
        });
    });

    describe('#list_tube_used()', function () {
        it('', function (done) {
            client.list_tube_used(function(err, tubename) {
                console.log(tubename);

                done();
            });
        });
    });

    describe('#put()', function () {
        it('', function (done) {
            client.put(1, 0, 60, "Ho", function(err, jobid) {
                console.log(jobid);

                done();
            });
        });
    });

    describe('#stats_tube()', function () {
        it('', function (done) {
            client.stats_tube('test', function(err, response) {
                console.log(response);

                done();
            });
        });
    });

    describe('#watch()', function () {
        it('', function (done) {
            client.watch('test', function(err, numwatched) {
                console.log(numwatched);

                done();
            });
        });
    });


    describe('#reserve()', function () {
        it('', function (done) {
            client.reserve(function(err, jobid, payload) {
                console.log(jobid);
                console.log(payload.toString());

                client.destroy(jobid, function(err) {
                    console.log(error);
                });
                done();
            });
        });
    });

});
