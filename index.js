const get = require('./lib/get');
const post = require('./lib/post');

module.exports = class {
    constructor(host, user, pass) {
        if (!host || !user || !pass) throw new Error('Config is wrong');
        this.host = host;
        this.user = user;
        this.pass = pass;
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

                this.loadId = loadId;
                return res;
            });
    }

    getLoad({ dataLocation, _loadId = this.loadId }) {
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

                this.loadId = loadId;
            });
    }
    uploadData({ persistOptions, persistRecords, dataLocation }) {
        if (!this.loadId) return Promise.reject(new Error('Call createLoad first'));
        return post({
            auth: {
                user: this.user,
                pass: this.pass,
                sendImmediately: true
            },
            uri:`${this.host}/semarchy/api/rest/loads/${dataLocation}/${this.loadId}`,
            json:{
                action:'PERSIST_DATA',
                persistOptions,
                persistRecords
            }
        });
    }

    cancelLoad(dataLocation) {
        if (!this.loadId) return Promise.reject(new Error('Call createLoad first'));
        return post({
            auth: {
                user: this.user,
                pass: this.pass,
                sendImmediately: true
            },
            uri:`${this.host}/semarchy/api/rest/loads/${dataLocation}/${this.loadId}`,
            json:{
                action:'CANCEL'
            }
        });
    }

    submitData({ jobName, dataLocation }) {
        if (!this.loadId) return Promise.reject(new Error('Call createLoad first'));
        return post({
            auth: {
                user: this.user,
                pass: this.pass,
                sendImmediately: true
            },
            uri:`${this.host}/semarchy/api/rest/loads/${dataLocation}/${this.loadId}`,
            json:{
                action:'SUBMIT',
                jobName
            }
        });
    }

    get({ id, dataLocation, entity, typeView = 'GD' }) {
        let uri = `${this.host}/semarchy/api/rest/query/${dataLocation}/${entity}/${typeView}`;
        if (id) uri = `${uri}/id`;
        return get({
            uri,
            auth: {
                user: this.user,
                pass: this.pass,
                sendImmediately: true
            }, });
    }

    query({ nameQuery, dataLocation, typeView, query :qs }) {
        const uri = `${this.host}/semarchy/api/rest/named-query/${dataLocation}/${nameQuery}/${typeView}`;
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
