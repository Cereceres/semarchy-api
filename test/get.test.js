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

const { HOST:host, PASS:pass, USER:user } = process.env;

const sem = new Semarchy(host, user, pass);

describe('test to get Method', () => {
    it('should call and get the data', async() => {
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
