const { generateResponse } = require('../../utils/responseUtils');
const { formatDate } = require('../../utils/dateUtils');
const EmployerNotification = require('../../models/Employer/EmployerNotification');
const CandidateProfile = require('../../models/Candidate/CandidateProfile');

const getNotificationsForEmployer = async (req, res) => {
    const { profileId } = req.params;
    
    try {
        // Fetch notifications for the employer (all types)
        const notifications = await EmployerNotification.findAll({
            where: { profileId: profileId },
            order: [['createdAt', 'DESC']]
        });
        
        if (notifications.length === 0) {
            return generateResponse(res, 404, 'No notifications found for this employer');
        }
        
        // Fetch additional details for each notification
        const formattedNotifications = await Promise.all(notifications.map(async (notification) => {
            
            const candidateProfile = await CandidateProfile.findOne({
                where: { profileId: notification.candidateId },
                attributes: ['candidate_name', 'email', 'jobrole', 'experience', 'candidate_image']
            });

            if (!candidateProfile) {
                console.log(`CandidateProfile not found for profileId: ${notification.candidateId}`);
                return null;
            }
            
            // Get message2 from message template
            let message1, message2;
            try {
                const messageTemplate = require(`../../Templates/Employer/messageTemplates/${notification.messageKey}`);
                message1 = messageTemplate.message1(candidateProfile.candidate_name, notification.jobTitle);
                message2 = messageTemplate.message2;
            } catch (error) {
                console.error(`Error loading message template for key: ${notification.messageKey}`, error);
                message2 = 'Detailed message not found';
            }
            
            return {
                notificationId: notification.notificationId,
                applicationId: notification.applicationId,
                profileId: notification.candidateId,
                jobpostId: notification.jobpostId,
                jobTitle: notification.jobTitle,
                notificationType: notification.notificationType,
                isRead: notification.isRead,
                createdAt: formatDate(notification.createdAt),
                message1: message1,
                message2: message2,
                candidateDetails: {
                    profileId: candidateProfile.profileId,
                    name: candidateProfile.candidate_name,
                    email: candidateProfile.email,
                    jobrole: candidateProfile.jobrole,
                    experience: candidateProfile.experience,
                    profilePicture: candidateProfile.candidate_image
                        ? Buffer.from(candidateProfile.candidate_image).toString('base64')
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
        const result = await EmployerNotification.destroy({
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
        const result = await EmployerNotification.destroy({
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

const markNotificationAsRead = async (req, res) => {
    const { notificationId } = req.params;

    try {
        const notification = await EmployerNotification.findByPk(notificationId);

        if (!notification) {
            return generateResponse(res, 404, 'Notification not found');
        }

        notification.isRead = true;
        await notification.save();

        return generateResponse(res, 200, 'Notification marked as read successfully');
    } catch (error) {
        console.error('Error marking notification as read:', error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};

module.exports = {
    getNotificationsForEmployer,
    deleteNotification,
    deleteAllNotifications,
    markNotificationAsRead,
};