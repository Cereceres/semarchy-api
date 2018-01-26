module.exports = (body) => {
    try {
        JSON.parse(body);
    } catch (error) {
        return body;
    }
};
