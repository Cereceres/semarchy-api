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


describe('test to query', () => {
    before(() => {
        Object.assign(process.env, {
            SEMARCHY_HOST:'test',
            SEMARCHY_USER:'test',
            SEMARCHY_PASS: 'test'
        });
    });
    it('should call and get the data', async() => {
        const sem = new Semarchy();

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
