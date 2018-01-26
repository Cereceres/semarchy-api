const assert = require('assert');
const url = require('url');


const proxyquire = require('proxyquire');

const stub = {
    './lib/get':({
        auth: {
            user,
            pass,
            sendImmediately
        },
        uri,
        qs
    }) => {
        const [ , semarchy, api, rest, query, dataLocation, nameQuery, typeView ] = url
            .parse(uri).path.split('/');
        assert(semarchy === 'semarchy');
        assert(api === 'api');
        assert(rest === 'rest');
        assert(query === 'named-query');
        assert(dataLocation === 'dataLocation');
        assert(nameQuery === 'nameQuery');
        assert(typeView === 'typeView');
        assert(uri);
        assert(user);
        assert(pass);
        assert(sendImmediately);
        assert.deepEqual(qs, { test:'test' });
        return Promise.resolve({
            records: [
                {
                    testID: 1000035,
                    test: {
                        test: {
                            test: [
                                {
                                    test:'test'
                                }
                            ]
                        },
                    },
                    tests: [
                        {
                            test:'test'
                        }
                    ]
                }
            ]
        });
    }
};
const Semarchy = proxyquire('../index', stub);

const { HOST:host, PASS:pass, USER:user } = process.env;

const sem = new Semarchy(host, user, pass);

describe('test to query', () => {
    it('should call and get the data', async() => {
        sem.loadId = 1;
        const { records } = await sem.query({
            nameQuery:'nameQuery',
            dataLocation:'dataLocation',
            typeView:'typeView',
            query:{
                test:'test'
            }
        });
        assert.deepEqual(records, [
            {
                testID: 1000035,
                test: {
                    test: {
                        test: [
                            {
                                test:'test'
                            }
                        ]
                    },
                },
                tests: [
                    {
                        test:'test'
                    }
                ]
            }
        ]);
    });
});
