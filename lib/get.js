const request = require('request');
const { promisify } = require('util');
const get = promisify(request.get.bind(request));
const parseBody = require('./parse-body');


module.exports = (data) => get(data).then((res) => parseBody(res.body))
    .then((res) => {
        if (res && res.error) return Promise.reject(res.error);
        return res;
    });
