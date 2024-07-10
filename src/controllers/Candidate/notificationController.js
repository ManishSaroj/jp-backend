const { generateResponse } = require('../../utils/responseUtils');
const { formatDate } = require('../../utils/dateUtils');
const CandidateNotification = require('../../models/Employer/CandidateNotification');
const JobApplication = require('../../models/Employer/JobApplication');
const EmployerJobPost = require('../../models/Employer/EmployerJobPost');
const EmployerProfile = require('../../models/Employer/EmployerProfile');

const getNotificationsForCandidate = async (req, res) => {
    const { profileId } = req.params;
    
    try {
        // Fetch notifications for the candidate (all types)
        const notifications = await CandidateNotification.findAll({
            where: { profileId: profileId },
            order: [['createdAt', 'DESC']]
        });
        
        if (notifications.length === 0) {
            return generateResponse(res, 404, 'No notifications found for this candidate');
        }
        
        // Fetch additional details for each notification
        const formattedNotifications = await Promise.all(notifications.map(async (notification) => {
            
            const employerProfile = await EmployerProfile.findOne({ where: { eid: notification.eid } });
            if (!employerProfile) {
                console.log(`EmployerProfile not found for eid: ${notification.eid}`);
                return null;
            }
            
            // Get message2 from message template
            let message1, message2;
            try {
                const messageTemplate = require(`../../Templates/Candidate/messageTemplates/${notification.messageKey}`);
                message1 = messageTemplate.message1;
                message2 = messageTemplate.message2;
            } catch (error) {
                console.error(`Error loading message template for key: ${notification.messageKey}`, error);
                message2 = 'Detailed message not found';
            }
            
            return {
                notificationId: notification.notificationId,
                applicationId: notification.applicationId,
                jobpostId: notification.jobpostId,
                jobTitle: notification.jobTitle,
                notificationType: notification.notificationType,
                isRead: notification.isRead,
                createdAt: formatDate(notification.createdAt),
                message1: message1,
                message2: message2,
                jobDetails: {
                    company_name: employerProfile.company_name,
                    company_website: employerProfile.company_website,
                    company_logo: employerProfile.company_logo
                        ? Buffer.from(employerProfile.company_logo).toString('base64')
                        : null
                }
            };
        }));
        
        const validNotifications = formattedNotifications.filter(notification => notification !== null);
        
        // Prepare the response
        const response = {
            message1: validNotifications.slice(0, 3).map(notification => ({
                notificationId: notification.notificationId,
                message1: notification.message1,
                jobTitle: notification.jobTitle,
                createdAt: notification.createdAt
            })),
            message2: validNotifications
        };
        
        return generateResponse(res, 200, 'Notifications retrieved successfully', response);
    } catch (error) {
        console.error('Error retrieving notifications:', error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};

const deleteNotification = async (req, res) => {
    const { notificationId } = req.params;

    try {
        const result = await CandidateNotification.destroy({
            where: { notificationId: notificationId }
        });

        if (result === 0) {
            return generateResponse(res, 404, 'Notification not found');
        }

        return generateResponse(res, 200, 'Notification deleted successfully');
    } catch (error) {
        console.error('Error deleting notification:', error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};

const deleteAllNotifications = async (req, res) => {
    const { profileId } = req.params;

    try {
        const result = await CandidateNotification.destroy({
            where: { profileId: profileId }
        });

        if (result === 0) {
            return generateResponse(res, 404, 'No notifications found for this profile');
        }

        return generateResponse(res, 200, 'All notifications deleted successfully');
    } catch (error) {
        console.error('Error deleting all notifications:', error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};

module.exports = {
    getNotificationsForCandidate,
    deleteNotification,
    deleteAllNotifications,
};