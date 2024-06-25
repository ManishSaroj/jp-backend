const { formatDistanceToNow, format } = require('date-fns');

/**
 * Function to calculate the posted date timeline
 * @param {Date} date - The date to calculate the timeline for
 * @returns {string} - The human-readable timeline (e.g., '1 day ago', '2 weeks ago')
 */
const calculatePostedDateTimeline = (date) => {
    if (!date) {
        throw new Error('Date is required');
    }

    return formatDistanceToNow(new Date(date), { addSuffix: true });
};

/**
 * Function to format a date in the form "MMMM d, yyyy"
 * @param {Date} date - The date to format
 * @returns {string} - The formatted date (e.g., 'October 1, 2025')
 */
const formatDate = (date) => {
    if (!date) {
        throw new Error('Date is required');
    }

    return format(new Date(date), 'MMMM d, yyyy');
};

module.exports = {
    calculatePostedDateTimeline,
    formatDate,
};
