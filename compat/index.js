/*!
 * node-tvdb
 *
 * Node.js library for accessing TheTVDB API at <http://www.thetvdb.com/wiki/index.php?title=Programmers_API>
 *
 * Copyright (c) 2014-2015 Edward Wellbrook <edwellbrook@gmail.com>
 * MIT Licensed
 */

"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var request = require("request");

//
// API Client
//

var Client = function () {
    function Client(opts) {
        _classCallCheck(this, Client);

        var TVDB_API_VERSION = "2.1.1";

        opts = opts || {};

        this.language = opts.language || "en";
        this.token = opts.token;

        this.request = request.defaults({
            baseUrl: "https://api.thetvdb.com",
            headers: {
                "User-Agent": "edwellbrook/node-tvdb",
                "Accept": "application/vnd.thetvdb.v" + TVDB_API_VERSION
            },
            json: true
        });
    }

    // https://api.thetvdb.com/swagger#!/Authentication/post_login

    _createClass(Client, [{
        key: "auth",
        value: function auth(apiKey) {
            var self = this;

            return new Promise(function (resolve, reject) {
                self.request.post({
                    uri: "/login",
                    body: {
                        apikey: apiKey
                    }
                }, function (err, res, data) {
                    if (err || res.statusCode !== 200) {
                        return handleError(err, res, data, reject);
                    }
                    self.token = data.token;
                    resolve();
                });
            });
        }

        // https://api.thetvdb.com/swagger#!/Authentication/get_refresh_token

    }, {
        key: "refreshToken",
        value: function refreshToken() {
            var self = this;

            return new Promise(function (resolve, reject) {
                self.request.get({
                    uri: "/refresh",
                    headers: {
                        Authorization: "Bearer " + self.token
                    }
                }, function (err, res, data) {
                    if (err || res.statusCode !== 200) {
                        return handleError(err, res, data, reject);
                    }
                    self.token = data.token;
                    resolve();
                });
            });
        }

        // https://api.thetvdb.com/swagger#!/Languages/get_languages

    }, {
        key: "getLanguages",
        value: function getLanguages() {
            var self = this;

            return new Promise(function (resolve, reject) {
                self.request.get({
                    uri: "/languages",
                    headers: {
                        Authorization: "Bearer " + self.token
                    }
                }, function (err, res, data) {
                    if (err || res.statusCode !== 200) {
                        return handleError(err, res, data, reject);
                    }
                    resolve(data.data);
                });
            });
        }

        // https://api.thetvdb.com/swagger#!/Languages/get_languages_id

    }, {
        key: "getLanguage",
        value: function getLanguage(id) {
            var self = this;

            return new Promise(function (resolve, reject) {
                self.request.get({
                    uri: "/languages/" + id,
                    headers: {
                        "Authorization": "Bearer " + self.token
                    }
                }, function (err, res, data) {
                    if (err || res.statusCode !== 200) {
                        return handleError(err, res, data, reject);
                    }
                    resolve(data.data);
                });
            });
        }

        // https://api.thetvdb.com/swagger#!/Search/get_search_series

    }, {
        key: "searchSeries",
        value: function searchSeries(key, value) {
            var self = this;

            // default to "name" key if only one param passed
            if (arguments.length === 1) {
                value = key;
                key = "name";
            }

            var query = {};
            query[key] = value;

            return new Promise(function (resolve, reject) {
                self.request.get({
                    uri: "/search/series",
                    headers: {
                        "Authorization": "Bearer " + self.token,
                        "Accept-Language": self.language
                    },
                    qs: query
                }, function (err, res, data) {
                    if (err || res.statusCode !== 200) {
                        return handleError(err, res, data, reject);
                    }
                    resolve(data.data);
                });
            });
        }

        // https://api.thetvdb.com/swagger#!/Search/get_search_series_params

    }, {
        key: "searchSeriesParams",
        value: function searchSeriesParams() {
            var self = this;

            return new Promise(function (resolve, reject) {
                self.request.get({
                    uri: "/search/series/params",
                    headers: {
                        "Authorization": "Bearer " + self.token,
                        "Accept-Language": self.language
                    }
                }, function (err, res, data) {
                    if (err || res.statusCode !== 200) {
                        return handleError(err, res, data, reject);
                    }
                    resolve(data.data.params);
                });
            });
        }

        // https://api.thetvdb.com/swagger#!/Series/get_series_id

    }, {
        key: "getSeries",
        value: function getSeries(id) {
            var self = this;

            return new Promise(function (resolve, reject) {
                self.request.get({
                    uri: "/series/" + id,
                    headers: {
                        "Authorization": "Bearer " + self.token,
                        "Accept-Language": self.language
                    }
                }, function (err, res, data) {
                    if (err || res.statusCode !== 200) {
                        return handleError(err, res, data, reject);
                    }
                    resolve(data.data);
                });
            });
        }

        // https://api.thetvdb.com/swagger#!/Series/get_series_id_episodes

    }, {
        key: "getSeriesEpisodes",
        value: function getSeriesEpisodes(id, page) {
            var self = this;

            return new Promise(function (resolve, reject) {
                self.request.get({
                    uri: "/series/" + id + "/episodes",
                    headers: {
                        "Authorization": "Bearer " + self.token,
                        "Accept-Language": self.language
                    },
                    qs: {
                        page: page ? page : 1
                    }
                }, function (err, res, data) {
                    if (err || res.statusCode !== 200) {
                        return handleError(err, res, data, reject);
                    }
                    resolve(data.data);
                });
            });
        }

        // https://api.thetvdb.com/swagger#!/Episodes/get_episodes_id

    }, {
        key: "getEpisode",
        value: function getEpisode(id) {
            var self = this;

            return new Promise(function (resolve, reject) {
                self.request.get({
                    uri: "episodes/" + id,
                    headers: {
                        "Authorization": "Bearer " + self.token,
                        "Accept-Language": self.language
                    }
                }, function (err, res, data) {
                    if (err || res.statusCode !== 200) {
                        return handleError(err, res, data, reject);
                    }
                    resolve(data.data);
                });
            });
        }

        // https://api.thetvdb.com/swagger#!/Series/get_series_id_episodes_query

    }, {
        key: "getEpisodeQuery",
        value: function getEpisodeQuery(id, params) {
            var self = this;

            return new Promise(function (resolve, reject) {
                self.request.get({
                    uri: "series/" + id + "/episodes/query",
                    headers: {
                        "Authorization": "Bearer " + self.token,
                        "Accept-Language": self.language
                    },
                    qs: params
                }, function (err, res, data) {
                    if (err || res.statusCode !== 200) {
                        return handleError(err, res, data, reject);
                    }
                    resolve(data.data);
                });
            });
        }

        // https://api.thetvdb.com/swagger#!/Series/get_series_id_episodes_query_params

    }, {
        key: "getSeriesEpisodesParams",
        value: function getSeriesEpisodesParams(id) {
            var self = this;

            return new Promise(function (resolve, reject) {
                self.request.get({
                    uri: "series/" + id + "/episodes/query/params",
                    headers: {
                        "Authorization": "Bearer " + self.token,
                        "Accept-Language": self.language
                    }
                }, function (err, res, data) {
                    if (err || res.statusCode !== 200) {
                        return handleError(err, res, data, reject);
                    }
                    resolve(data.data);
                });
            });
        }

        // https://api.thetvdb.com/swagger#!/Series/get_series_id_episodes_summary

    }, {
        key: "getSeriesEpisodeSummaries",
        value: function getSeriesEpisodeSummaries(id) {
            var self = this;

            return new Promise(function (resolve, reject) {
                self.request.get({
                    uri: "series/" + id + "/episodes/summary",
                    headers: {
                        "Authorization": "Bearer " + self.token,
                        "Accept-Language": self.language
                    }
                }, function (err, res, data) {
                    if (err || res.statusCode !== 200) {
                        return handleError(err, res, data, reject);
                    }
                    resolve(data.data);
                });
            });
        }

        // https://api.thetvdb.com/swagger#!/Series/get_series_id_filter

    }, {
        key: "getSeriesFilter",
        value: function getSeriesFilter(id, keys) {
            var self = this;

            return new Promise(function (resolve, reject) {
                self.request.get({
                    uri: "series/" + id + "/filter",
                    headers: {
                        "Authorization": "Bearer " + self.token,
                        "Accept-Language": self.language
                    },
                    qs: {
                        keys: keys
                    }
                }, function (err, res, data) {
                    if (err || res.statusCode !== 200) {
                        return handleError(err, res, data, reject);
                    }
                    resolve(data.data);
                });
            });
        }

        // https://api.thetvdb.com/swagger#!/Series/get_series_id_filter_params

    }, {
        key: "getSeriesFilterParam",
        value: function getSeriesFilterParam(id) {
            var self = this;

            return new Promise(function (resolve, reject) {
                self.request.get({
                    uri: "series/" + id + "/filter/params",
                    headers: {
                        "Authorization": "Bearer " + self.token,
                        "Accept-Language": self.language
                    }
                }, function (err, res, data) {
                    if (err || res.statusCode !== 200) {
                        return handleError(err, res, data, reject);
                    }
                    resolve(data.data);
                });
            });
        }

        // https://api.thetvdb.com/swagger#!/Series/get_series_id_images

    }, {
        key: "getSeriesImages",
        value: function getSeriesImages(id) {
            var self = this;

            return new Promise(function (resolve, reject) {
                self.request.get({
                    uri: "series/" + id + "/images",
                    headers: {
                        "Authorization": "Bearer " + self.token,
                        "Accept-Language": self.language
                    }
                }, function (err, res, data) {
                    if (err || res.statusCode !== 200) {
                        return handleError(err, res, data, reject);
                    }
                    resolve(data.data);
                });
            });
        }

        // https://api.thetvdb.com/swagger#!/Series/get_series_id_images_query

    }, {
        key: "getSeriesImagesQuery",
        value: function getSeriesImagesQuery(id, params) {
            var self = this;

            return new Promise(function (resolve, reject) {
                self.request.get({
                    uri: "series/" + id + "/images/query",
                    headers: {
                        "Authorization": "Bearer " + self.token,
                        "Accept-Language": self.language
                    },
                    qs: params
                }, function (err, res, data) {
                    if (err || res.statusCode !== 200) {
                        return handleError(err, res, data, reject);
                    }
                    resolve(data.data);
                });
            });
        }

        // https://api.thetvdb.com/swagger#!/Series/get_series_id_images_query_params

    }, {
        key: "getSeriesImagesParams",
        value: function getSeriesImagesParams(id) {
            var self = this;

            return new Promise(function (resolve, reject) {
                self.request.get({
                    uri: "series/" + id + "/images/query/params",
                    headers: {
                        "Authorization": "Bearer " + self.token,
                        "Accept-Language": self.language
                    }
                }, function (err, res, data) {
                    if (err || res.statusCode !== 200) {
                        return handleError(err, res, data, reject);
                    }
                    resolve(data.data);
                });
            });
        }

        // https://api.thetvdb.com/swagger#!/Updates/get_updated_query

    }, {
        key: "getUpdates",
        value: function getUpdates(fromTime, toTime) {
            var self = this;

            return new Promise(function (resolve, reject) {
                self.request.get({
                    uri: "updated/query",
                    headers: {
                        "Authorization": "Bearer " + self.token,
                        "Accept-Language": self.language
                    },
                    qs: {
                        fromTime: fromTime,
                        toTime: toTime
                    }
                }, function (err, res, data) {
                    if (err || res.statusCode !== 200) {
                        return handleError(err, res, data, reject);
                    }
                    resolve(data.data);
                });
            });
        }

        // https://api.thetvdb.com/swagger#!/Updates/get_updated_query_params

    }, {
        key: "getUpdatesParams",
        value: function getUpdatesParams() {
            var self = this;

            return new Promise(function (resolve, reject) {
                self.request.get({
                    uri: "updated/query/params",
                    headers: {
                        "Authorization": "Bearer " + self.token,
                        "Accept-Language": self.language
                    }
                }, function (err, res, data) {
                    if (err || res.statusCode !== 200) {
                        return handleError(err, res, data, reject);
                    }
                    resolve(data.data);
                });
            });
        }
    }]);

    return Client;
}();

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