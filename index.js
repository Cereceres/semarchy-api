const get = require('./lib/get');
const post = require('./lib/post');
const getConfig = require('./lib/get-config');

const errorMessage = 'Config is wrong';
const errorWrongConfig = new Error(errorMessage);
module.exports = class {
    constructor(host, user, pass) {
        const { semHost, semPass, semUser } = getConfig();
        this.host = host || semHost;
        this.user = user || semUser;
        this.pass = pass || semPass;

        if (!this.host || !this.user || !this.pass) throw errorWrongConfig;
        this.load = {};
    }
    createLoad({ programName, loadDescription = '', dataLocation }) {
        return post({
            auth: {
                user: this.user,
                pass: this.pass,
                sendImmediately: true
            },
            uri:`${this.host}/semarchy/api/rest/loads/${dataLocation}`,
            json:{
                action:'CREATE_LOAD',
                programName,
                loadDescription
            }
        })
            .then((res) => {
                const { loadId, loadStatus, submittable } = res;
                if (!loadId || loadStatus !== 'RUNNING' || !submittable) return res;

                this.load = res;
                return res;
            });
    }

    getLoad({ dataLocation, loadId:_loadId = this.load.loadId }) {
        if (!_loadId) return Promise.reject(new Error('LoadId is required'));
        return get({
            auth: {
                user: this.user,
                pass: this.pass,
                sendImmediately: true
            },
            uri:`${this.host}/semarchy/api/rest/loads/${dataLocation}/${_loadId}`
        })
            .then((res) => {
                const { loadId, loadStatus, submittable } = res;
                if (!loadId || loadStatus !== 'RUNNING' || !submittable) return res;

                this.load = res;
                return res;
            });
    }
    uploadData({ persistOptions, persistRecords, dataLocation, loadId:_loadId = this.load.loadId }) {
        if (!_loadId) return Promise.reject(new Error('LoadId is required'));
        return post({
            auth: {
                user: this.user,
                pass: this.pass,
                sendImmediately: true
            },
            uri:`${this.host}/semarchy/api/rest/loads/${dataLocation}/${_loadId}`,
            json:{
                action:'PERSIST_DATA',
                persistOptions,
                persistRecords
            }
        });
    }

    cancelLoad({ dataLocation, loadId:_loadId = this.load.loadId }) {
        if (!_loadId) return Promise.reject(new Error('LoadId is required'));
        return post({
            auth: {
                user: this.user,
                pass: this.pass,
                sendImmediately: true
            },
            uri:`${this.host}/semarchy/api/rest/loads/${dataLocation}/${_loadId}`,
            json:{
                action:'CANCEL'
            }
        })
            .then((res) => {
                this.load = res;
                return res;
            });
    }

    submitData({ jobName, dataLocation, loadId:_loadId = this.load.loadId }) {
        if (!_loadId) return Promise.reject(new Error('LoadId is required'));
        return post({
            auth: {
                user: this.user,
                pass: this.pass,
                sendImmediately: true
            },
            uri:`${this.host}/semarchy/api/rest/loads/${dataLocation}/${_loadId}`,
            json:{
                action:'SUBMIT',
                jobName
            }
        });
    }

    get({ id, dataLocation, entity, typeView = 'GD' }) {
        let uri = `${
            this.host
        }/semarchy/api/rest/query/${
            dataLocation
        }/${
            entity
        }/${
            typeView
        }`;
        if (id) uri = `${uri}/${id}`;
        return get({
            uri,
            auth: {
                user: this.user,
                pass: this.pass,
                sendImmediately: true
            }, });
    }

    query({ nameQuery, dataLocation, typeView, query :qs }) {
        const uri = `${
            this.host
        }/semarchy/api/rest/named-query/${
            dataLocation
        }/${
            nameQuery
        }/${
            typeView
        }`;
        return get({
            uri,
            qs,
            auth: {
                user: this.user,
                pass: this.pass,
                sendImmediately: true
            }, });
    }
};
