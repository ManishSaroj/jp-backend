const { generateResponse } = require('../../utils/responseUtils');
const { formatDate } = require('../../utils/dateUtils');
const CandidateNotification = require('../../models/Employer/jobUpdateNotification');
const JobApplication = require('../../models/Employer/JobApplication');
const EmployerJobPost = require('../../models/Employer/EmployerJobPost');
const EmployerProfile = require('../../models/Employer/EmployerProfile');

// const getNotificationsForCandidate = async (req, res) => {
//     const { profileId } = req.params;

//     try {
//         // Fetch notifications for the candidate
//         const notifications = await CandidateNotification.findAll({
//             where: { 
//                 profileId: profileId,
//                 notificationType: 'Applied'  // You can expand this to include other types if needed
//             },
//             order: [['createdAt', 'DESC']]
//         });

//         if (notifications.length === 0) {
//             return generateResponse(res, 404, 'No notifications found for this candidate');
//         }

//         // Fetch additional details for each notification
//         const formattedNotifications = await Promise.all(notifications.map(async (notification) => {
//             // Get JobApplication
//             const jobApplication = await JobApplication.findByPk(notification.applicationId);
            
//             if (!jobApplication) {
//                 console.log(`JobApplication not found for applicationId: ${notification.applicationId}`);
//                 return null;
//             }

//             // Get EmployerJobPost
//             const employerJobPost = await EmployerJobPost.findByPk(jobApplication.jobpostId);
            
//             if (!employerJobPost) {
//                 console.log(`EmployerJobPost not found for jobpostId: ${jobApplication.jobpostId}`);
//                 return null;
//             }

//             // Get EmployerProfile
//             const employerProfile = await EmployerProfile.findOne({ where: { eid: employerJobPost.eid } });
            
//             if (!employerProfile) {
//                 console.log(`EmployerProfile not found for eid: ${employerJobPost.eid}`);
//                 return null;
//             }

//             // Get message2 from message template
//             const messageTemplate = require(`../../messageTemplates/${notification.messageKey}`);
//             const message2 = messageTemplate.message2; // Assuming message2 is the key in your message template

//             return {
//                 notificationId: notification.notificationId,
//                 applicationId: notification.applicationId,
//                 notificationType: notification.notificationType,
//                 isRead: notification.isRead,
//                 createdAt: formatDate(notification.createdAt),
//                 message: message2,
//                 jobDetails: {
//                     jobpostId: employerJobPost.jobpostId,
//                     jobTitle: employerJobPost.jobTitle,
//                     company_name: employerProfile.company_name,
//                     company_website: employerProfile.company_website,
//                     company_logo: employerProfile.company_logo
//                         ? Buffer.from(employerProfile.company_logo).toString('base64')
//                         : null
//                 }
//             };
//         }));

//         // Remove any null entries (where data couldn't be found)
//         const validNotifications = formattedNotifications.filter(notification => notification !== null);

//         return generateResponse(res, 200, 'Notifications retrieved successfully', { notifications: validNotifications });
//     } catch (error) {
//         console.error('Error retrieving notifications:', error);
//         return generateResponse(res, 500, 'Server error', null, error.message);
//     }
// };

// const getShortNotificationsForCandidate = async (req, res) => {
//     const { profileId } = req.params;
   
//     try {
//         const totalCount = await CandidateNotification.count({
//             where: {
//                 profileId: profileId,
//                 notificationType: 'Applied'
//             }
//         });
       
//         const notifications = await CandidateNotification.findAll({
//             where: {
//                 profileId: profileId,
//                 notificationType: 'Applied'
//             },
//             order: [['createdAt', 'DESC']],
//             limit: 2
//         });
        
//         if (notifications.length === 0) {
//             console.log('No notifications found for this candidate');
//             return generateResponse(res, 404, 'No notifications found for this candidate');
//         }

//         const formattedNotifications = await Promise.all(notifications.map(async (notification) => {
            
//             const jobApplication = await JobApplication.findByPk(notification.applicationId);
//             if (!jobApplication) {
//                 console.log(`JobApplication not found for applicationId: ${notification.applicationId}`);
//                 return null;
//             }

//             const employerJobPost = await EmployerJobPost.findByPk(jobApplication.jobpostId);
//             if (!employerJobPost) {
//                 console.log(`EmployerJobPost not found for jobpostId: ${jobApplication.jobpostId}`);
//                 return null;
//             }

//             let message1;
//             try {
//                 const messageTemplate = require(`../../messageTemplates/${notification.messageKey}`);
//                 message1 = messageTemplate.message1;
//             } catch (error) {
//                 console.error(`Error loading message template for key: ${notification.messageKey}`, error);
//                 message1 = 'Message template not found';
//             }

//             return {
//                 notificationId: notification.notificationId,
//                 applicationId: notification.applicationId,
//                 notificationType: notification.notificationType,
//                 isRead: notification.isRead,
//                 createdAt: formatDate(notification.createdAt),
//                 message: message1,
//                 jobTitle: employerJobPost.jobTitle
//             };
//         }));

//         const validNotifications = formattedNotifications.filter(notification => notification !== null);
//         // console.log('Valid notifications:', validNotifications.length);

//         return generateResponse(res, 200, 'Short notifications retrieved successfully', { totalCount: totalCount, notifications: validNotifications });
//     } catch (error) {
//         console.error('Error retrieving short notifications:', error);
//         return generateResponse(res, 500, 'Server error', null, error.message);
//     }
// };

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
            const jobApplication = await JobApplication.findByPk(notification.applicationId);
            if (!jobApplication) {
                console.log(`JobApplication not found for applicationId: ${notification.applicationId}`);
                return null;
            }

            const employerJobPost = await EmployerJobPost.findByPk(jobApplication.jobpostId);
            if (!employerJobPost) {
                console.log(`EmployerJobPost not found for jobpostId: ${jobApplication.jobpostId}`);
                return null;
            }

            const employerProfile = await EmployerProfile.findOne({ where: { eid: employerJobPost.eid } });
            if (!employerProfile) {
                console.log(`EmployerProfile not found for eid: ${employerJobPost.eid}`);
                return null;
            }

            // Get message2 from message template
            let message2;
            try {
                const messageTemplate = require(`../../messageTemplates/${notification.messageKey}`);
                message2 = messageTemplate.message2;
            } catch (error) {
                console.error(`Error loading message template for key: ${notification.messageKey}`, error);
                message2 = 'Detailed message not found';
            }

            return {
                notificationId: notification.notificationId,
                applicationId: notification.applicationId,
                notificationType: notification.notificationType,
                isRead: notification.isRead,
                createdAt: formatDate(notification.createdAt),
                message: message2,
                jobDetails: {
                    jobpostId: employerJobPost.jobpostId,
                    jobTitle: employerJobPost.jobTitle,
                    company_name: employerProfile.company_name,
                    company_website: employerProfile.company_website,
                    company_logo: employerProfile.company_logo
                        ? Buffer.from(employerProfile.company_logo).toString('base64')
                        : null
                }
            };
        }));

        const validNotifications = formattedNotifications.filter(notification => notification !== null);

        return generateResponse(res, 200, 'Notifications retrieved successfully', { notifications: validNotifications });
    } catch (error) {
        console.error('Error retrieving notifications:', error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};

const getShortNotificationsForCandidate = async (req, res) => {
    const { profileId } = req.params;
   
    try {
        const totalCount = await CandidateNotification.count({
            where: { profileId: profileId }
        });
       
        const notifications = await CandidateNotification.findAll({
            where: { profileId: profileId },
            order: [['createdAt', 'DESC']],
            limit: 2
        });
        
        if (notifications.length === 0) {
            console.log('No notifications found for this candidate');
            return generateResponse(res, 404, 'No notifications found for this candidate');
        }

        const formattedNotifications = await Promise.all(notifications.map(async (notification) => {
            const jobApplication = await JobApplication.findByPk(notification.applicationId);
            if (!jobApplication) {
                console.log(`JobApplication not found for applicationId: ${notification.applicationId}`);
                return null;
            }

            const employerJobPost = await EmployerJobPost.findByPk(jobApplication.jobpostId);
            if (!employerJobPost) {
                console.log(`EmployerJobPost not found for jobpostId: ${jobApplication.jobpostId}`);
                return null;
            }

            let message1;
            try {
                const messageTemplate = require(`../../messageTemplates/${notification.messageKey}`);
                message1 = messageTemplate.message1;
            } catch (error) {
                console.error(`Error loading message template for key: ${notification.messageKey}`, error);
                message1 = 'Short message not found';
            }

            return {
                notificationId: notification.notificationId,
                applicationId: notification.applicationId,
                notificationType: notification.notificationType,
                isRead: notification.isRead,
                createdAt: formatDate(notification.createdAt),
                message: message1,
                jobTitle: employerJobPost.jobTitle
            };
        }));

        const validNotifications = formattedNotifications.filter(notification => notification !== null);

        return generateResponse(res, 200, 'Short notifications retrieved successfully', { totalCount: totalCount, notifications: validNotifications });
    } catch (error) {
        console.error('Error retrieving short notifications:', error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};

module.exports = {
    getNotificationsForCandidate,
    getShortNotificationsForCandidate,
};