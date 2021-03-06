var assert = require("assert");
var TVDB = require("..");
var API_KEY = process.env.TVDB_KEY;

describe("Time endpoints", function() {

    describe("Callback API", function() {

        it("should return the current time from the server", function(done) {
            var client = new TVDB(API_KEY);
            client.getTime(function(error, response) {
                assert.ifError(error);
                assert.equal("string", typeof response);
                done();
            });
        });
    });

    describe("Promise API", function() {

        it("should return the current time from the server", function(done) {
            var client = new TVDB(API_KEY);
            client.getTime()
                .then(function(response) {
                    assert.equal("string", typeof response);
                })
                .then(done, done);
        });
    });
});
