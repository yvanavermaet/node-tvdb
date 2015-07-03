/*!
 * node-tvdb
 *
 * Node.js library for accessing TheTVDB API at <http://www.thetvdb.com/wiki/index.php?title=Programmers_API>
 *
 * Copyright (c) 2014-2015 Edward Wellbrook <edwellbrook@gmail.com>
 * MIT Licensed
 */

"use strict";

var request = require("request");

//
// API Client
//

var Client = (function(){var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var proto$0={};

    function Client(opts) {
        var TVDB_API_VERSION = "1.2.0";

        opts = opts || {};

        this.language = opts.language || "en";
        this.token = opts.token;

        this.request = request.defaults({
            baseUrl: "https://api-dev.thetvdb.com/",
            headers: {
                "User-Agent": "edwellbrook/node-tvdb",
                "Accept": ("application/vnd.thetvdb.v" + TVDB_API_VERSION)
            },
            json: true
        });
    }DP$0(Client,"prototype",{"configurable":false,"enumerable":false,"writable":false});


    // https://api-dev.thetvdb.com/swagger#!/Authentication/post_login

    proto$0.auth = function(apiKey) {
        var self = this;

        return new Promise(function(resolve, reject) {
            self.request.post({
                uri: "/login",
                body: {
                    apikey: apiKey
                }
            }, function(err, res, data) {
                if (err || res.statusCode !== 200) {
                    return handleError(err, res, data, reject);
                }
                self.token = data.token;
                resolve();
            });
        });
    };


    // https://api-dev.thetvdb.com/swagger#!/Authentication/get_refresh_token

    proto$0.refreshToken = function() {
        var self = this;

        return new Promise(function(resolve, reject) {
            self.request.get({
                uri: "/refresh",
                headers: {
                    Authorization: ("Bearer " + (self.token))
                }
            }, function(err, res, data) {
                if (err || res.statusCode !== 200) {
                    return handleError(err, res, data, reject);
                }
                self.token = data.token;
                resolve();
            });
        });
    };


    // https://api-dev.thetvdb.com/swagger#!/Languages/get_languages

    proto$0.getLanguages = function() {
        var self = this;

        return new Promise(function(resolve, reject) {
            self.request.get({
                uri: "/languages",
                headers: {
                    Authorization: ("Bearer " + (self.token))
                }
            }, function(err, res, data) {
                if (err || res.statusCode !== 200) {
                    return handleError(err, res, data, reject);
                }
                resolve(data.data);
            });
        });
    };


    // https://api-dev.thetvdb.com/swagger#!/Languages/get_languages_id

    proto$0.getLanguage = function(id) {
        var self = this;

        return new Promise(function(resolve, reject) {
            self.request.get({
                uri: ("/languages/" + id),
                headers: {
                    "Authorization": ("Bearer " + (self.token))
                }
            }, function(err, res, data) {
                if (err || res.statusCode !== 200) {
                    return handleError(err, res, data, reject);
                }
                resolve(data);
            });
        });
    };


    // https://api-dev.thetvdb.com/swagger#!/Search/get_search_series

    proto$0.searchSeries = function(key, value) {
        var self = this;

        // default to "name" key if only one param passed
        if (arguments.length === 1) {
            value = key;
            key = "name";
        }

        var query = {};
        query[key] = value;

        return new Promise(function(resolve, reject) {
            self.request.get({
                uri: "/search/series",
                headers: {
                    "Authorization": ("Bearer " + (self.token)),
                    "Accept-Language": self.language
                },
                qs: query
            }, function(err, res, data) {
                if (err || res.statusCode !== 200) {
                    return handleError(err, res, data, reject);
                }
                resolve(data.data);
            });
        });
    };


    // https://api-dev.thetvdb.com/swagger#!/Search/get_search_series_params

    proto$0.searchSeriesParams = function() {
        var self = this;

        return new Promise(function(resolve, reject) {
            self.request.get({
                uri: "/search/series/params",
                headers: {
                    "Authorization": ("Bearer " + (self.token)),
                    "Accept-Language": self.language
                }
            }, function(err, res, data) {
                if (err || res.statusCode !== 200) {
                    return handleError(err, res, data, reject);
                }
                resolve(data.data.params);
            });
        });
    };


    // https://api-dev.thetvdb.com/swagger#!/Series/get_series_id

    proto$0.getSeries = function(id) {
        var self = this;

        return new Promise(function(resolve, reject) {
            self.request.get({
                uri: ("/series/" + id),
                headers: {
                    "Authorization": ("Bearer " + (self.token)),
                    "Accept-Language": self.language
                }
            }, function(err, res, data) {
                if (err || res.statusCode !== 200) {
                    return handleError(err, res, data, reject);
                }
                resolve(data.data);
            });
        });
    };

MIXIN$0(Client.prototype,proto$0);proto$0=void 0;return Client;})();

//
// Utilities
//

function handleError(err, res, data, callback) {
    if (!err && data && data.Error) {
        err = new Error(data.Error);
    }

    if (res && res.statusCode) {
        err.status = err.statusCode = res.statusCode;
    }

    return callback(err);
}

//
// Exports
//

module.exports = Client;
