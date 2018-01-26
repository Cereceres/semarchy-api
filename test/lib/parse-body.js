const assert = require('assert');
const parse = require('../../lib/parse-body');


describe('test to parse-body', () => {
    it('should parse a stringify object', async() => {
        const res = await parse(JSON.stringify({ test:'test' }));
        assert.deepEqual(res, { test:'test' });
    });
    it('should return the string possible', async() => {
        const res = await parse(JSON.stringify('test'));
        assert.deepEqual(res, 'test');
    });
});
