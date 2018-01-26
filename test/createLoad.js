const assert = require('assert');

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
            loadCreator: 'jcereceres',
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

const { HOST:host, PASS:pass, USER:user } = process.env;

const sem = new Semarchy(host, user, pass);

describe('test to Semarchy-api', () => {
    it('should call and create the load', async() => {
        const data = await sem.createLoad({
            programName: 'curl',
            loadDescription: 'Load testing',
            dataLocation:'DemoEdenred'
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
