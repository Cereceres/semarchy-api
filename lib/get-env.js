module.exports = () => {
    const {
        SEMARCHY_HOST: semHost,
        SEMARCHY_USER: semUser,
        SEMARCHY_PASS: semPass
    } = process.env;
    return { semHost, semUser, semPass };
};
