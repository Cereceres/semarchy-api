const assert = require('assert');


const proxyquire = require('proxyquire');


describe('test to get-config', () => {
    it('should return the config from file', async() => {
        const stub = {
            'rc':(name) => {
                assert(name === 'semarchy');
                return {
                    host:'host',
                    pass:'pass',
                    user:'user'
                };
            },
            './get-env':() => ({})
        };
        const configLocal = proxyquire('../../lib/get-config.js', stub)();
        assert(configLocal.semHost === 'host');
        assert(configLocal.semUser === 'user');
        assert(configLocal.semPass === 'pass');
    });
    it('should return the config file', async() => {
        Object.assign(process.env, {
            SEMARCHY_HOST:'test',
            SEMARCHY_USER:'test',
            SEMARCHY_PASS: 'test'
        });
        const stub = {
            rc:(name) => {
                assert(name === 'semarchy');
                return {
                    host:'host',
                    pass:'pass',
                    user:'user'
                };
            }
        };
        const config = proxyquire('../../lib/get-config.js', stub)();
        assert(config.semHost === process.env.SEMARCHY_HOST);
        assert(config.semUser === process.env.SEMARCHY_USER);
        assert(config.semPass === process.env.SEMARCHY_PASS);
    });
});
