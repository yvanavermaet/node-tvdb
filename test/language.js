const assert = require("assert");
const Client = require("../");
const API_KEY = process.env.TVDB_KEY;

describe("Language endpoints", function() {

    it("should return the default language as \"en\"", function() {
        const client = new Client();
        assert.equal("en", client.language);
    });

    it("should return the language as \"pt\" if initilaised with the language \"pt\"", function() {
        const client = new Client({language: "pt"});
        assert.equal("pt", client.language);
    });

    it("should return the lanaguage as \"pt\" if changed to \"pt\"", function() {
        const client = new Client();
        client.language = "pt";
        assert.equal("pt", client.language);
    });

    it("should return an array of available langauages", function(done) {
        const tvdb = new Client();

        tvdb.auth(API_KEY)
            .then(function() {
                return tvdb.getLanguages();
            })
            .then(function(langs) {
                assert.equal("object", typeof langs);
            })
            .catch(assert.ifError)
            .then(done.bind(null, null), done);
    });

    it("should return an object with information about the language with id \"7\"", function(done) {
        const tvdb = new Client();

        tvdb.auth(API_KEY)
            .then(function() {
                return tvdb.getLanguage(7);
            })
            .then(function(lang) {
                assert.equal("object", typeof lang);
                assert.equal("en", lang.abbreviation);
                assert.equal("English", lang.englishName);
            })
            .catch(assert.ifError)
            .then(done.bind(null, null), done);
    });

});
