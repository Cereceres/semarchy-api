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
            jobName
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
        assert(action === 'SUBMIT');
        assert(jobName === 'test');
        return Promise.resolve({
            loadId: 227,
            loadStatus: 'PENDING',
            loadCreator: 'test',
            loadCreationDate: '2018-01-24T03:32:05.610Z',
            programName: 'curl',
            loadDescription: 'Load testing',
            loadSubmitDate: '2018-01-24T03:33:40.382Z',
            batchId: 130,
            numberOfJobExecutions: 0,
            batchSubmitter: 'test',
            submitInterval: -1,
            submittable: true
        });
    }
};
const Semarchy = proxyquire('../index', stub);

describe('test to submitData', () => {
    before(() => {
        Object.assign(process.env, {
            SEMARCHY_HOST:'test',
            SEMARCHY_USER:'test',
            SEMARCHY_PASS: 'test'
        });
    });
    it('should call and post the data', async() => {
        const sem = new Semarchy();

        sem.load.loadId = 1;
        const {
            loadId,
            loadStatus,
            loadCreator,
            loadCreationDate,
            programName,
            loadDescription,
            loadSubmitDate,
            batchId,
            numberOfJobExecutions,
            batchSubmitter,
            submitInterval,
            submittable
        } = await sem.submitData({
            jobName:'test',
            dataLocation: 'test'
        });
        assert(loadId === 227);
        assert(loadSubmitDate);
        assert(batchId);
        assert(batchSubmitter);
        assert(loadStatus === 'PENDING');
        assert(loadCreator);
        assert(loadCreationDate);
        assert(programName);
        assert(loadDescription);
        assert(typeof numberOfJobExecutions === 'number');
        assert(submitInterval);
        assert(submittable);
    });
});
