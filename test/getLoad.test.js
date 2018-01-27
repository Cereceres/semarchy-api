const assert = require('assert');
const url = require('url');

const proxyquire = require('proxyquire');

const stub = {
    './lib/post':() => {

    },
    './lib/get':({
        auth: {
            user,
            pass,
            sendImmediately
        },
        uri
    }) => {
        const [ , semarchy, api, rest, loads, dataLocation, loadId ] = url
            .parse(uri).path.split('/');
        assert(semarchy === 'semarchy');
        assert(api === 'api');
        assert(rest === 'rest');
        assert(loads === 'loads');
        assert(dataLocation === 'test');
        assert(loadId === '1');
        assert(user);
        assert(uri);
        assert(pass);
        assert(sendImmediately);
        return Promise.resolve({
            loadId: 223,
            loadStatus: 'WARNING',
            loadCreator: 'test',
            loadCreationDate: '2018-01-24T03:15:43.771Z',
            programName: 'curl',
            loadDescription: 'Load testing',
            loadSubmitDate: '2018-01-24T03:17:49.314Z',
            batchId: 127,
            integrationJobName: 'test',
            integrationJobStartDate: '2018-01-24T03:17:56.554Z',
            integrationJobCompletionDate: '2018-01-24T03:18:00.849Z',
            numberOfJobExecutions: 1,
            batchSubmitter: 'test',
            submitInterval: -1,
            submittable: true
        });
    }
};
const Semarchy = proxyquire('../index', stub);

describe('test to getLoad', () => {
    beforeEach(() => {
        process.env = Object.assign(process.env, {
            SEMARCHY_HOST:'test',
            SEMARCHY_USER:'test',
            SEMARCHY_PASS: 'test'
        });
    });
    it('should call and get the load', async() => {
        const sem = new Semarchy();

        sem.loadId = 1;
        const {
            loadId,
            loadStatus,
            loadCreator,
            loadCreationDate,
            programName,
            loadDescription,
            loadSubmitDate,
            batchId,
            integrationJobName,
            integrationJobStartDate,
            integrationJobCompletionDate,
            numberOfJobExecutions,
            batchSubmitter,
            submitInterval,
            submittable
        } = await sem.getLoad({
            loadId: 1,
            dataLocation:'test'
        });
        assert(loadId === 223);
        assert(loadSubmitDate);
        assert(integrationJobName);
        assert(batchId);
        assert(integrationJobStartDate);
        assert(integrationJobCompletionDate);
        assert(batchSubmitter);
        assert(loadStatus === 'WARNING');
        assert(loadCreator);
        assert(loadCreationDate);
        assert(programName);
        assert(loadDescription);
        assert(typeof numberOfJobExecutions === 'number');
        assert(submitInterval);
        assert(submittable);
    });

    it('should catch credentials from enviroment vars', () => {
        const Sem = require('../index');
        const _sem = new Sem();

        assert(_sem.host === process.env.SEMARCHY_HOST);
        assert(_sem.user === process.env.SEMARCHY_USER);
        assert(_sem.pass === process.env.SEMARCHY_PASS);
    });
});
