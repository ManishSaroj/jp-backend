const generateResponse = (res, status, message, data = null, error = null) => {
    res.status(status).json({ message, data, error, success: status >= 200 && status < 300 });
};

module.exports = {
    generateResponse,
};