const assert = require('assert');
const url = require('url');


const proxyquire = require('proxyquire');

const stub = {
    './lib/post':({
        auth: {
            user,
            pass,
            sendImmediately
        },
        uri,
        json:{
            action,
            persistOptions,
            persistRecords
        }
    }) => {
        const [ , semarchy, api, rest, loads, dataLocation ] = url.parse(uri).path.split('/');
        assert(semarchy === 'semarchy');
        assert(api === 'api');
        assert(rest === 'rest');
        assert(loads === 'loads');
        assert(dataLocation === 'test');
        assert(user);
        assert(uri);
        assert(pass);
        assert(sendImmediately);
        assert(action === 'PERSIST_DATA');
        assert(typeof persistOptions === 'object');
        assert(typeof persistRecords === 'object');
        return Promise.resolve({
            status: 'PERSISTED',
            load: {
                loadId: 227,
                loadStatus: 'RUNNING',
                loadCreator: 'test',
                loadCreationDate: '2018-01-24T03:32:05.610Z',
                programName: 'curl',
                loadDescription: 'Load testing',
                numberOfJobExecutions: 0,
                submitInterval: -1,
                submittable: true
            },
            records: {
                test: [
                    {
                        entityName: 'test',
                        recordValues: {
                            testID: 10023,
                            DeleteDate: null,
                            DeleteAuthor: null,
                            DeleteOperation: null,
                            DeletePath: null,
                            Nombre: 'test test hijo',
                            Datos: null,
                            CopiedFrom: null,
                            FID_test: 1000036
                        },
                        failedValidations: [],
                        potentialMatches: []
                    }
                ]
            }
        });
    }
};
const Semarchy = proxyquire('../index', stub);

const { HOST:host, PASS:pass, USER:user } = process.env;

const sem = new Semarchy(host, user, pass);

describe('test to uploadData', () => {
    it('should call and post the data', async() => {
        sem.load.loadId = 1;
        const {
            status,
            load,
            records
        } = await sem.uploadData({
            persistOptions:{},
            persistRecords:{},
            dataLocation:'test'
        });
        assert.deepEqual(records, {
            test: [
                {
                    entityName: 'test',
                    recordValues: {
                        testID: 10023,
                        DeleteDate: null,
                        DeleteAuthor: null,
                        DeleteOperation: null,
                        DeletePath: null,
                        Nombre: 'test test hijo',
                        Datos: null,
                        CopiedFrom: null,
                        FID_test: 1000036
                    },
                    failedValidations: [],
                    potentialMatches: []
                }
            ]
        });
        assert.deepEqual(load, {
            loadId: 227,
            loadStatus: 'RUNNING',
            loadCreator: 'test',
            loadCreationDate: '2018-01-24T03:32:05.610Z',
            programName: 'curl',
            loadDescription: 'Load testing',
            numberOfJobExecutions: 0,
            submitInterval: -1,
            submittable: true
        });
        assert(status === 'PERSISTED');
    });
});
