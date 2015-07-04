/*!
 * node-tvdb
 *
 * Node.js library for accessing TheTVDB API at <http://www.thetvdb.com/wiki/index.php?title=Programmers_API>
 *
 * Copyright (c) 2014-2015 Edward Wellbrook <edwellbrook@gmail.com>
 * MIT Licensed
 */

"use strict";

const request = require("request");

//
// API Client
//

class Client {

    constructor(opts) {
        const TVDB_API_VERSION = "1.2.0";

        opts = opts || {};

        this.language = opts.language || "en";
        this.token = opts.token;

        this.request = request.defaults({
            baseUrl: "https://api-dev.thetvdb.com/",
            headers: {
                "User-Agent": "edwellbrook/node-tvdb",
                "Accept": `application/vnd.thetvdb.v${TVDB_API_VERSION}`
            },
            json: true
        });
    }


    // https://api-dev.thetvdb.com/swagger#!/Authentication/post_login

    auth(apiKey) {
        const self = this;

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
    }


    // https://api-dev.thetvdb.com/swagger#!/Authentication/get_refresh_token

    refreshToken() {
        const self = this;

        return new Promise(function(resolve, reject) {
            self.request.get({
                uri: "/refresh",
                headers: {
                    Authorization: `Bearer ${self.token}`
                }
            }, function(err, res, data) {
                if (err || res.statusCode !== 200) {
                    return handleError(err, res, data, reject);
                }
                self.token = data.token;
                resolve();
            });
        });
    }


    // https://api-dev.thetvdb.com/swagger#!/Languages/get_languages

    getLanguages() {
        const self = this;

        return new Promise(function(resolve, reject) {
            self.request.get({
                uri: "/languages",
                headers: {
                    Authorization: `Bearer ${self.token}`
                }
            }, function(err, res, data) {
                if (err || res.statusCode !== 200) {
                    return handleError(err, res, data, reject);
                }
                resolve(data.data);
            });
        });
    }


    // https://api-dev.thetvdb.com/swagger#!/Languages/get_languages_id

    getLanguage(id) {
        const self = this;

        return new Promise(function(resolve, reject) {
            self.request.get({
                uri: `/languages/${id}`,
                headers: {
                    "Authorization": `Bearer ${self.token}`
                }
            }, function(err, res, data) {
                if (err || res.statusCode !== 200) {
                    return handleError(err, res, data, reject);
                }
                resolve(data);
            });
        });
    }


    // https://api-dev.thetvdb.com/swagger#!/Search/get_search_series

    searchSeries(key, value) {
        const self = this;

        // default to "name" key if only one param passed
        if (arguments.length === 1) {
            value = key;
            key = "name";
        }

        let query = {};
        query[key] = value;

        return new Promise(function(resolve, reject) {
            self.request.get({
                uri: "/search/series",
                headers: {
                    "Authorization": `Bearer ${self.token}`,
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
    }


    // https://api-dev.thetvdb.com/swagger#!/Search/get_search_series_params

    searchSeriesParams() {
        const self = this;

        return new Promise(function(resolve, reject) {
            self.request.get({
                uri: "/search/series/params",
                headers: {
                    "Authorization": `Bearer ${self.token}`,
                    "Accept-Language": self.language
                }
            }, function(err, res, data) {
                if (err || res.statusCode !== 200) {
                    return handleError(err, res, data, reject);
                }
                resolve(data.data.params);
            });
        });
    }


    // https://api-dev.thetvdb.com/swagger#!/Series/get_series_id

    getSeries(id) {
        const self = this;

        return new Promise(function(resolve, reject) {
            self.request.get({
                uri: `/series/${id}`,
                headers: {
                    "Authorization": `Bearer ${self.token}`,
                    "Accept-Language": self.language
                }
            }, function(err, res, data) {
                if (err || res.statusCode !== 200) {
                    return handleError(err, res, data, reject);
                }
                resolve(data.data);
            });
        });
    }

    // https://api-dev.thetvdb.com/swagger#!/Series/get_series_id_episodes

    getSeriesEpisodes(id, page) {
        let self = this;

        return new Promise(function (resolve, reject) {
            self.request.get({
                uri: `/series/${id}/episodes`,
                headers: {
                    "Authorization": `Bearer ${self.token}`,
                    "Accept-Language": self.language
                },
                qs: {
                    page: page ? page : 1
                }
            }, function (err, res, data) {
                if (err) return reject(err);

                resolve(data.data);
            });
        });
    }

    // https://api-dev.thetvdb.com/swagger#!/Episodes
    // Episode ID

    getEpisode(id) {
        let self = this;

        return new Promise(function (resolve, reject) {
            self.request.get({
                uri: `episodes/${id}`,
                headers: {
                    "Authorization": `Bearer ${self.token}`,
                    "Accept-Language": self.language
                }
            }, function (err, res, data) {
                if (err) return reject(err);

                resolve(data.data);
            });
        });
    }

    // https://api-dev.thetvdb.com/swagger#!/Series/get_series_id_episodes_query
    // TO-DO: Check if query as parameters is ok
    getEpisodeQuery(id, params) {
        let self = this;

        return new Promise(function (resolve, reject) {
            self.request.get({
                uri: `series/${id}/episodes/query`,
                headers: {
                    "Authorization": `Bearer ${self.token}`,
                    "Accept-Language": self.language
                },
                qs: params
            }, function (err, res, data) {
                if (err) return reject(err);

                resolve(data.data);
            });
        });
    }

    // https://api-dev.thetvdb.com/swagger#!/Series/get_series_id_episodes_query_params

    getSeriesEpisodesParams(id) {
        let self = this;

        return new Promise(function (resolve, reject) {
            self.request.get({
                uri: `series/${id}/episodes/query/params`,
                headers: {
                    "Authorization": `Bearer ${self.token}`,
                    "Accept-Language": self.language
                }
            }, function (err, res, data) {
                if (err) return reject(err);

                resolve(data.data);
            });
        });
    }

    // https://api-dev.thetvdb.com/swagger#!/Series/get_series_id_episodes_summary

    getEpisodeSummary(id) {
        let self = this;

        return new Promise(function (resolve, reject) {
            self.request.get({
                uri: `series/${id}/episodes/summary`,
                headers: {
                    "Authorization": `Bearer ${self.token}`,
                    "Accept-Language": self.language
                }
            }, function (err, res, data) {
                if (err) return reject(err);

                resolve(data.data);
            });
        });
    }

    // https://api-dev.thetvdb.com/swagger#!/Series/get_series_id_filter

    getSeriesFilter(id, keys) {
        let self = this;

        return new Promise(function (resolve, reject) {
            self.request.get({
                uri: `series/${id}/filter`,
                headers: {
                    "Authorization": `Bearer ${self.token}`,
                    "Accept-Language": self.language
                },
                qs: {
                    keys: keys
                }
            }, function (err, res, data) {
                if (err) return reject(err);

                resolve(data.data);
            });
        });

    }

    // https://api-dev.thetvdb.com/swagger#!/Series/get_series_id_filter_params

    getSeriesFilterParam(id) {
        let self = this;

        return new Promise(function (resolve, reject) {
            self.request.get({
                uri: `series/${id}/filter/params`,
                headers: {
                    "Authorization": `Bearer ${self.token}`,
                    "Accept-Language": self.language
                }
            }, function (err, res, data) {
                if (err) return reject(err);

                resolve(data.data);
            });
        });
    }

    // https://api-dev.thetvdb.com/swagger#!/Series/get_series_id_images

    getSeriesImages(id) {
        let self = this;

        return new Promise(function (resolve, reject) {
            self.request.get({
                uri: `series/${id}/images`,
                headers: {
                    "Authorization": `Bearer ${self.token}`,
                    "Accept-Language": self.language
                }
            }, function (err, res, data) {
                if (err) return reject(err);

                resolve(data.data);
            });
        });
    }

    // https://api-dev.thetvdb.com/swagger#!/Series/get_series_id_images_query
    // TO-DO: verify how to send query params
    // keyType
    // resolution
    // subKey
    getSeriesImagesQuery(id, params) {
        let self = this;

        return new Promise(function (resolve, reject) {
            self.request.get({
                uri: `series/${id}/images/query`,
                headers: {
                    "Authorization": `Bearer ${self.token}`,
                    "Accept-Language": self.language
                },
                qs: params
            }, function (err, res, data) {
                if (err) return reject(err);

                resolve(data.data);
            });
        });
    }

    // https://api-dev.thetvdb.com/swagger#!/Series/get_series_id_images_query_params

    getSeriesImagesParams(id) {
        let self = this;

        return new Promise(function (resolve, reject) {
            self.request.get({
                uri: `series/${id}/images/query/params`,
                headers: {
                    "Authorization": `Bearer ${self.token}`,
                    "Accept-Language": self.language
                }
            }, function (err, res, data) {
                if (err) return reject(err);

                resolve(data.data);
            });
        });
    }

    //Updates
    // https://api-dev.thetvdb.com/swagger#!/Updates/get_updated_query

    getUpdates(fromTime, toTime) {
        let self = this;

        return new Promise(function (resolve, reject) {
            self.request.get({
                uri: `updated/query`,
                headers: {
                    "Authorization": `Bearer ${self.token}`,
                    "Accept-Language": self.language
                },
                qs: {
                    fromTime: fromTime,
                    toTime: toTime
                }
            }, function (err, res, data) {
                if (err) return reject(err);

                resolve(data.data);
            });
        });
    }


    // https://api-dev.thetvdb.com/swagger#!/Updates/get_updated_query_params

    getUpdatesParams() {
        let self = this;

        return new Promise(function (resolve, reject) {
            self.request.get({
                uri: `updated/query/params`,
                headers: {
                    "Authorization": `Bearer ${self.token}`,
                    "Accept-Language": self.language
                }
            }, function (err, res, data) {
                if (err) return reject(err);

                resolve(data.data);
            });
        });
    }


}

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
