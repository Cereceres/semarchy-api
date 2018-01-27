const assert = require('assert');

const getEnv = require('../../lib/get-env');


describe('test to get env', () => {
    it('should return the var from env', () => {
        const env = getEnv();
        assert(env.semHost === process.env.SEMARCHY_HOST);
        assert(env.semUser === process.env.SEMARCHY_USER);
        assert(env.semPass === process.env.SEMARCHY_PASS);
    });
});
