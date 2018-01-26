const request = require('request');
const { promisify } = require('util');
const post = promisify(request.post.bind(request));
const parseBody = require('./parse-body');


module.exports = (data) => post(data).then((res) => parseBody(res.body))
    .then((res) => {
        console.log('res =  ', res);
        if (res.error) return Promise.reject(res.error);
        return res;
    });
