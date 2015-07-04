const assert = require("assert");
const Client = require("../");
const API_KEY = process.env.TVDB_KEY;

describe("Episode endpoints", function() {

    it("should return an object of the episode with id \"4768125\"", function(done) {
        const tvdb = new Client();

        tvdb.auth(API_KEY)
            .then(function() {
                return tvdb.getEpisode(4768125);
            })
            .then(function(episode) {
                assert.equal("object", typeof episode);
                assert.equal(4768125, episode.id);
                assert.equal("2014-03-30", episode.firstAired);
            })
            .catch(assert.ifError)
            .then(done.bind(null, null), done);
    });

    it("should return an error for a episode search with an invalid id", function(done) {
        const tvdb = new Client();

        tvdb.auth(API_KEY)
            .then(function() {
                return tvdb.getEpisode(0)
            })
            .catch(function(err) {
                assert.notEqual(null, err);
            })
            .then(done.bind(null, null), done);
    });

});
