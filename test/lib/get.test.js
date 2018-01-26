const assert = require('assert');


const proxyquire = require('proxyquire');
const data = {};
const stub = {
    request:{
        get:(_data, cb) => {
            assert.deepStrictEqual(_data, data);
            cb(null, { body:JSON.stringify({ test:'test' }) });
        }
    }
};
const get = proxyquire('../../lib/get.js', stub);


describe('test to get', () => {
    it('should return the body parsed', async() => {
        const res = await get(data);
        assert.deepEqual(res, { test:'test' });
    });
});
