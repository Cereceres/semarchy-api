const assert = require('assert');


const proxyquire = require('proxyquire');
const data = {};
const stub = {
    request:{
        post:(_data, cb) => {
            assert.deepStrictEqual(_data, data);
            cb(null, { body:JSON.stringify({ test:'test' }) });
        }
    }
};
const post = proxyquire('../../lib/post.js', stub);


describe('test to post', () => {
    it('should the parse the body', async() => {
        const res = await post(data);
        assert.deepEqual(res, { test:'test' });
    });
});
