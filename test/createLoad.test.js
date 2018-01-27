const assert = require('assert');
const url = require('url');


const proxyquire = require('proxyquire');

const stub = {
    './lib/get':() => {

    },
    './lib/post':({
        auth: {
            user,
            pass,
            sendImmediately
        },
        uri,
        json:{
            action,
            programName,
            loadDescription
        }
    }) => {
        const [ , semarchy, api, rest, loads, dataLocation ] = url
            .parse(uri).path.split('/');
        assert(semarchy === 'semarchy');
        assert(api === 'api');
        assert(rest === 'rest');
        assert(loads === 'loads');
        assert(dataLocation === 'test');
        assert(user);
        assert(uri);
        assert(pass);
        assert(sendImmediately);
        assert(programName);
        assert(loadDescription);
        assert(action === 'CREATE_LOAD');
        return Promise.resolve({
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
    }
};
const Semarchy = proxyquire('../index', stub);


describe('test to createLoad', () => {
    before(() => {
        Object.assign(process.env, {
            SEMARCHY_HOST:'test',
            SEMARCHY_USER:'test',
            SEMARCHY_PASS: 'test'
        });
    });
    it('should call and create the load', async() => {
        const sem = new Semarchy();

        const data = await sem.createLoad({
            programName: 'curl',
            loadDescription: 'Load testing',
            dataLocation:'test'
        });
        const {
            loadId,
            loadStatus,
            loadCreator,
            loadCreationDate,
            programName,
            loadDescription,
            numberOfJobExecutions,
            submitInterval,
            submittable
        } = data;
        assert(sem.load.loadId === loadId);
        assert(loadId === 227);
        assert(loadStatus === 'RUNNING');
        assert(loadCreator);
        assert(loadCreationDate);
        assert(programName);
        assert(loadDescription);
        assert(typeof numberOfJobExecutions === 'number');
        assert(submitInterval);
        assert(submittable);
    });
});
