var _ = require('lodash');
var Request = require('./request');

/**
 * Intermediate class to create HTTP requests
 *
 *
 * @param options       object{
 *                          host: '',
 *                          endpoint: '', // base url for .request
 *                          apiKey: 'API_KEY',
 *                          apiSecret: 'API_SECRET'
 *                      }
 * @constructor
 * @constructor
 */
var RestClient = function (options) {
    var self = this;

    self.apiKey = options.apiKey;
    self.apiSecret = options.apiSecret;
    self.https = options.https;
    self.host = options.host;
    self.endpoint = options.endpoint;

    self.defaultParams = {
        'api_key': self.apiKey
    };

    self.defaultHeaders = {
        'User-Agent' : 'blocktrail-sdk-nodejs/1.0.2'
    };
};

RestClient.prototype.create_request = function (options) {
    var self = this;

    options = _.defaults({}, options, {
        https: self.https,
        host: self.host,
        endpoint: self.endpoint,
        apiKey: self.apiKey,
        apiSecret: self.apiSecret,
        params: _.defaults({}, self.defaultParams),
        headers: _.defaults({}, self.defaultHeaders)
    });

    return new Request(options);
};

RestClient.prototype.post = function (path, params, data, fn) {
    return this.create_request({auth: 'http-signature'}).request('POST', path, params, data, fn);
};

RestClient.prototype.put = function (path, params, data, fn) {
    return this.create_request({auth: 'http-signature'}).request('PUT', path, params, data, fn);
};

RestClient.prototype.get = function (path, params, doHttpSignature, fn) {
    if (typeof doHttpSignature === "function") {
        fn = doHttpSignature;
        doHttpSignature = false;
    }

    var options = {};

    if (doHttpSignature) {
        options['auth'] = 'http-signature';
    }

    return this.create_request(options).request('GET', path, params, null, fn);
};

RestClient.prototype.delete = function (path, params, data, fn) {
    return this.create_request({auth: 'http-signature'}).request('DELETE', path, params, data, fn);
};

module.exports = function (options) {
    return new RestClient(options);
};
