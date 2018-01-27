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
        uri
    }) => {
        const [ , semarchy, api, rest, query, dataLocation, entity, typeView, id ] = url
            .parse(uri).path.split('/');
        assert(semarchy === 'semarchy');
        assert(api === 'api');
        assert(rest === 'rest');
        assert(query === 'query');
        assert(dataLocation === 'test');
        assert(entity === 'test');
        assert(typeView === 'test');
        assert(id === '1');
        assert(uri);
        assert(user);
        assert(pass);
        assert(sendImmediately);
        return Promise.resolve({
            testId: id,
            Nombre: 'test',
            Datos: {},
            FID_test: 1000036
        });
    }
};
const Semarchy = proxyquire('../index', stub);


describe('test to get Method', () => {
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
        const {
            testId,
            Nombre,
            Datos,
            FID_test
        } = await sem.get({
            id:1, dataLocation:'test', entity:'test', typeView:'test'
        });
        assert(testId === '1');
        assert(Nombre);
        assert(Datos);
        assert(FID_test);
    });
});
