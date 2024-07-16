/**
 * Sends a JSON response to the client with the provided status, message, data, and optional error.
 * Sets the HTTP status code and constructs the response JSON accordingly.
 */
const generateResponse = (res, status, message, data = null, error = null) => {
    res.status(status).json({ message, data, error, success: status >= 200 && status < 300 });
};

module.exports = {
    generateResponse,
};