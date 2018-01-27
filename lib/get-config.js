const NAME_API = 'semarchy';
const conf = require('rc')(NAME_API);
const getEnv = require('./get-env');

module.exports = () => {
    const {
        semHost = conf.host,
        semUser = conf.user,
        semPass = conf.pass
    } = getEnv();
    return {
        semHost,
        semPass,
        semUser
    };
};
