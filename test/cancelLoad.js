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
        json:{ action }
    }) => {
        const [ , semarchy, api, rest, loads, dataLocation, loadId ] = url
            .parse(uri).path.split('/');
        assert(semarchy === 'semarchy');
        assert(api === 'api');
        assert(rest === 'rest');
        assert(loads === 'loads');
        assert(action === 'CANCEL');
        assert(dataLocation === 'test');
        assert(loadId === '1');
        assert(user);
        assert(uri);
        assert(pass);
        assert(sendImmediately);
        return Promise.resolve({
            loadId: 223,
            loadStatus: 'CANCELED',
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
            submittable: false
        });
    }
};
const Semarchy = proxyquire('../index', stub);

const { HOST:host, PASS:pass, USER:user } = process.env;

const sem = new Semarchy(host, user, pass);

describe('test to cancelledLoad', () => {
    it('should call and cancel the load', async() => {
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
        } = await sem.cancelLoad({
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
        assert(loadStatus === 'CANCELED');
        assert(loadCreator);
        assert(loadCreationDate);
        assert(programName);
        assert(loadDescription);
        assert(typeof numberOfJobExecutions === 'number');
        assert(submitInterval);
        assert(!submittable);
    });
});
