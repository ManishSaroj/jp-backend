const Employer = require('../../models/Employer/EmployerModel');
const EmployerJobPost = require('../../models/Employer/EmployerJobPost');
const JobApplication = require('../../models/Employer/JobApplication');
const CandidateProfile = require('../../models/Candidate/CandidateProfile');
const { employerSequelize } = require('../../config/db.config')
const { generateResponse } = require('../../utils/responseUtils');
const { formatDate } = require('../../utils/dateUtils')
const CandidateNotification = require('../../models/Employer/jobUpdateNotification')

const createJobPost = async (req, res) => {
    const {
        jobTitle,
        jobCategory,
        jobType,
        minSalary,
        maxSalary,
        salaryFrequency,
        experience,
        qualification,
        totalOpenings,
        duration,
        gender,
        country,
        state,
        city,
        email,
        jobAddress,
        skills,
        description,
        jobReq,
        jobRes,
        startDate,
        endDate
    } = req.body;

    try {
        if (!req.user || !req.user.id) {
            return generateResponse(res, 401, 'Unauthorized: User not authenticated');
        }

        const eid = req.user.id;

        // Check if the employer exists
        const employer = await Employer.findOne({ where: { eid } });
        if (!employer) {
            return generateResponse(res, 404, 'Employer not found');
        }

        // Create a new job post
        const jobPost = await EmployerJobPost.create({
            eid,
            jobTitle,
            jobCategory,
            jobType,
            minSalary,
            maxSalary,
            salaryFrequency,
            totalOpenings,
            duration,
            experience,
            qualification,
            gender,
            country,
            state,
            city,
            email,
            jobAddress,
            skills,
            description,
            jobReq,
            jobRes,
            startDate: new Date(startDate),
            endDate: new Date(endDate)
        });

        return generateResponse(res, 201, 'Job post created successfully', { jobPost });
    } catch (error) {
        console.error('Error creating job post:', error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};

const getEmployerJobPosts = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return generateResponse(res, 401, 'Unauthorized: User not authenticated');
        }

        const eid = req.user.id;

        // Retrieve job posts for the employer
        const jobPosts = await EmployerJobPost.findAll({ where: { eid } });

        if (jobPosts.length === 0) {
            return generateResponse(res, 404, 'No Job Posts found for this employer');
        }

        return generateResponse(res, 200, 'Job posts retrieved successfully', { jobPosts });
    } catch (error) {
        console.error('Error retrieving job posts for employer:', error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};

const getAllJobPosts = async (req, res) => {
    try {
        // Retrieve all job posts
        const jobPosts = await EmployerJobPost.findAll();

        if (jobPosts.length === 0) {
            return generateResponse(res, 404, 'No job posts found');
        }

        return generateResponse(res, 200, 'Job posts retrieved successfully', { jobPosts });
    } catch (error) {
        console.error('Error retrieving job posts:', error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};

const getJobPostById = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return generateResponse(res, 401, 'Unauthorized: User not authenticated');
        }

        const { jobpostId } = req.params;
        const eid = req.user.id;

        // Retrieve job post by id and employer id
        const jobPost = await EmployerJobPost.findOne({
            where: { jobpostId, eid }
        });

        if (!jobPost) {
            return generateResponse(res, 404, 'Job post not found');
        }

        return generateResponse(res, 200, 'Job post retrieved successfully', { jobPost });
    } catch (error) {
        console.error('Error retrieving job post:', error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};

const updateJobPost = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return generateResponse(res, 401, 'Unauthorized: User not authenticated');
        }

        const { jobpostId } = req.params;
        const eid = req.user.id;
        const updatedData = req.body;

        // Find the job post
        const jobPost = await EmployerJobPost.findOne({
            where: { jobpostId, eid }
        });

        if (!jobPost) {
            return generateResponse(res, 404, 'Job post not found');
        }

        // Update the job post
        await jobPost.update(updatedData);

        return generateResponse(res, 200, 'Job post updated successfully', { jobPost });
    } catch (error) {
        console.error('Error updating job post:', error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};

// In your employerController.js or similar file
const getAppliedCandidates = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return generateResponse(res, 401, 'Unauthorized: User not authenticated');
        }

        const { jobpostId } = req.params;
        const eid = req.user.id;

        // Fetch the job post to ensure it belongs to the current employer
        const jobPost = await EmployerJobPost.findOne({
            where: { jobpostId, eid }
        });

        if (!jobPost) {
            return generateResponse(res, 404, 'Job post not found');
        }

        // Fetch applied candidates from JobApplication
        const jobApplications = await JobApplication.findAll({
            where: { jobpostId },
            attributes: ['applicationId', 'candidateProfileId', 'status', 'appliedDate']
        });

        // Get unique candidate profile IDs
        const candidateProfileIds = [...new Set(jobApplications.map(app => app.candidateProfileId))];

        // Fetch candidate profiles
        const candidateProfiles = await CandidateProfile.findAll({
            where: { profileId: candidateProfileIds },
            attributes: [
                'profileId',
                'candidate_name',
                'phone_number',
                'email',
                'qualification',
                'jobrole',
                'experience',
                'city',
                'country',
                'candidate_image'
            ]
        });

        // Create a map of candidate profiles for easy lookup
        const profileMap = new Map(candidateProfiles.map(profile => [profile.profileId, profile]));

        // Combine the data
        const formattedCandidates = jobApplications.map(application => {
            const profile = profileMap.get(application.candidateProfileId);
            return {
                applicationId: application.applicationId,
                status: application.status,
                appliedDate: application.appliedDate,
                candidate: profile ? {
                    profileId: profile.profileId,
                    candidate_name: profile.candidate_name,
                    email: profile.email,
                    qualification: profile.qualification,
                    jobrole: profile.jobrole,
                    experience: profile.experience,
                    city: profile.city,
                    country: profile.country,
                    candidate_image: profile.candidate_image ? profile.candidate_image.toString('base64') : null
                } : null
            };
        });

        return generateResponse(res, 200, 'Applied candidates retrieved successfully', { appliedCandidates: formattedCandidates });
    } catch (error) {
        console.error('Error retrieving applied candidates:', error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};

const getCandidateDetails = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return generateResponse(res, 401, 'Unauthorized: User not authenticated');
        }

        const { profileId } = req.params;

        // Retrieve candidate profile by profileId
        const candidateProfile = await CandidateProfile.findOne({
            where: { profileId },
            attributes: [
                'profileId',
                'candidate_name',
                'phone_number',
                'email',
                'website',
                'qualification',
                'languages',
                'jobrole',
                'jobCategory',
                'experience',
                'dob',
                'age',
                'gender',
                'country',
                'city',
                'pincode',
                'fullAddress',
                'skills',
                'aboutme',
                'linkedIn',
                'github',
                'candidate_image',
                'candidate_banner',
                'resumeFileName',
                'candidate_resume',
                'lookingForJobs'
            ]
        });

        if (!candidateProfile) {
            return generateResponse(res, 404, 'Candidate profile not found');
        }

        // Convert candidate image and resume to base64 if they exist
        if (candidateProfile.candidate_image) {
            candidateProfile.candidate_image = candidateProfile.candidate_image.toString('base64');
        }
        if (candidateProfile.candidate_banner) {
            candidateProfile.candidate_banner = candidateProfile.candidate_banner.toString('base64');
        }
        if (candidateProfile.candidate_resume) {
            candidateProfile.candidate_resume = candidateProfile.candidate_resume.toString('base64');
        }


        return generateResponse(res, 200, 'Candidate profile retrieved successfully', { candidateProfile });
    } catch (error) {
        console.error('Error retrieving candidate profile:', error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};

const JobPostStatus = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return generateResponse(res, 401, 'Unauthorized: User not authenticated');
        }

        const { jobpostId } = req.params;
        const eid = req.user.id;

        // Find the job post
        const jobPost = await EmployerJobPost.findOne({
            where: { jobpostId, eid }
        });

        if (!jobPost) {
            return generateResponse(res, 404, 'Job post not found');
        }

        // Toggle the isActive status
        jobPost.isActive = !jobPost.isActive;
        await jobPost.save();

        return generateResponse(res, 200, `Job post ${jobPost.isActive ? 'activated' : 'deactivated'} successfully`, { jobPost });
    } catch (error) {
        console.error('Error toggling job post status:', error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};

const deleteJobPost = async (req, res) => {
    const { jobpostId } = req.params;
    const eid = req.user.id; // Assuming you have user information in the request

    try {
        // Start a transaction
        const result = await employerSequelize.transaction(async (t) => {
            // Find the job post
            const jobPost = await EmployerJobPost.findOne({
                where: { jobpostId, eid },
                transaction: t,
            });

            if (!jobPost) {
                return res.status(404).json({ message: 'Job post not found' });
            }

            // Delete related job applications
            await JobApplication.destroy({
                where: { jobpostId },
                transaction: t,
            });

            // Delete the job post
            await jobPost.destroy({ transaction: t });

            return true;
        });

        if (result) {
            res.status(200).json({ message: 'Job post and related applications deleted successfully' });
        }
    } catch (error) {
        console.error('Error deleting job post:', error);
        res.status(500).json({ message: 'An error occurred while deleting the job post' });
    }
};

const getApplicationStatus = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return generateResponse(res, 401, 'Unauthorized: User not authenticated');
        }

        const { applicationId } = req.params;
        const eid = req.user.id;

        const jobApplication = await JobApplication.findOne({
            where: { applicationId },
            include: [{ model: EmployerJobPost, where: { eid } }]
        });

        if (!jobApplication) {
            return generateResponse(res, 404, 'Job application not found');
        }

        const { status, isHired, isShortlisted, isRejected, isUnderReview } = jobApplication;

        return generateResponse(res, 200, 'Application status retrieved successfully', {
            status,
            isHired,
            isShortlisted,
            isRejected,
            isUnderReview
        });
    } catch (error) {
        console.error('Error retrieving application status:', error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};

// const updateApplicationStatus = async (req, res) => {
//     try {
//         if (!req.user || !req.user.id) {
//             return generateResponse(res, 401, 'Unauthorized: User not authenticated');
//         }

//         const { applicationId } = req.params;
//         const { newStatus } = req.body;
//         const eid = req.user.id;

//         const validStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Rejected', 'Hired'];
//         if (!validStatuses.includes(newStatus)) {
//             return generateResponse(res, 400, 'Invalid status provided');
//         }

//         const jobApplication = await JobApplication.findOne({
//             where: { applicationId },
//             include: [{ model: EmployerJobPost, where: { eid } }]
//         });

//         if (!jobApplication) {
//             return generateResponse(res, 404, 'Job application not found');
//         }

//         const previousStatus = jobApplication.status;

//         if (previousStatus !== newStatus) {
//             if (newStatus === 'Hired') {
//                 jobApplication.isHired = true;
//                 jobApplication.isRejected = false;
//             } else if (newStatus === 'Rejected') {
//                 jobApplication.isRejected = true;
//                 jobApplication.isHired = false;
//             } else if (newStatus === 'Shortlisted') {
//                 jobApplication.isShortlisted = true;

//                 // Increase shortlistedCandidatesCount for the job post
//                 const jobPost = await EmployerJobPost.findByPk(jobApplication.jobpostId);
//                 if (jobPost) {
//                     jobPost.shortlistedCandidatesCount += 1;
//                     await jobPost.save();
//                 }
//             } else if (newStatus === 'Under Review') {
//                 jobApplication.isUnderReview = true;
//             } else if (newStatus === 'Applied') {
//                 jobApplication.isApplied = true;
//             }

//             await jobApplication.save();
//         }

//         const updatedApplication = await JobApplication.findByPk(applicationId);

//         return generateResponse(res, 200, 'Application status updated successfully', {
//           isHired: updatedApplication.isHired,
//           isShortlisted: updatedApplication.isShortlisted,
//           isRejected: updatedApplication.isRejected,
//           isUnderReview: updatedApplication.isUnderReview,
//           status: updatedApplication.status
//         });
//     } catch (error) {
//         console.error('Error updating application status:', error);
//         return generateResponse(res, 500, 'Server error', null, error.message);
//     }
// };

const updateApplicationStatus = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return generateResponse(res, 401, 'Unauthorized: User not authenticated');
        }

        const { applicationId } = req.params;
        const { newStatus } = req.body;
        const eid = req.user.id;

        const validStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Rejected', 'Hired'];
        if (!validStatuses.includes(newStatus)) {
            return generateResponse(res, 400, 'Invalid status provided');
        }

        const jobApplication = await JobApplication.findOne({
            where: { applicationId },
            include: [{ model: EmployerJobPost, where: { eid } }]
        });

        if (!jobApplication) {
            return generateResponse(res, 404, 'Job application not found');
        }

        const previousStatus = jobApplication.status;

        // Start a transaction
        const result = await employerSequelize.transaction(async (t) => {
            if (previousStatus !== newStatus) {
                jobApplication.status = newStatus;

                switch (newStatus) {
                    case 'Hired':
                        jobApplication.isHired = true;
                        jobApplication.isRejected = false;
                        break;
                    case 'Rejected':
                        jobApplication.isRejected = true;
                        jobApplication.isHired = false;
                        break;
                    case 'Shortlisted':
                        jobApplication.isShortlisted = true;
                        // Increase shortlistedCandidatesCount for the job post
                        const jobPost = await EmployerJobPost.findByPk(jobApplication.jobpostId, { transaction: t });
                        if (jobPost) {
                            jobPost.shortlistedCandidatesCount += 1;
                            await jobPost.save({ transaction: t });
                        }
                        break;
                    case 'Under Review':
                        jobApplication.isUnderReview = true;
                        break;
                }

                await jobApplication.save({ transaction: t });

                // Create a notification for all statuses except 'Under Review'
                if (newStatus !== 'Under Review') {
                    let messageKey = newStatus.replace(/\s+/g, '');
                    if (previousStatus === 'Hired' && newStatus === 'Rejected') {
                        messageKey = 'HiredThenRejected';
                    }

                    const jobPost = await EmployerJobPost.findByPk(jobApplication.jobpostId, { transaction: t });
                    const notification = await CandidateNotification.create({
                        profileId: jobApplication.candidateProfileId,
                        applicationId: jobApplication.applicationId,
                        eid: jobPost.eid,
                        jobpostId: jobApplication.jobpostId,
                        jobTitle: jobPost.jobTitle,
                        notificationType: newStatus,
                        messageKey: messageKey,
                        isRead: false,
                        createdAt: new Date()
                    }, { transaction: t });

                    // Fetch job details for the notification
                    // const jobPost = await EmployerJobPost.findByPk(jobApplication.jobpostId, { transaction: t });
                    const messageTemplate = require(`../../messageTemplates/${messageKey}`);
                    const message1 = messageTemplate.message1;
                    const message2 = messageTemplate.message2;

                    const formattedNotification = {
                        notificationId: notification.notificationId,
                        applicationId: notification.applicationId,
                        jobPostId: notification.jobpostId,
                        jobTitle: notification.jobTitle,
                        notificationType: notification.notificationType,
                        isRead: notification.isRead,
                        createdAt: formatDate(notification.createdAt),
                        message1: message1,
                        message2: message2,
                    };

                    // Send SSE event if there's an active connection
                    if (req.app.locals.sseConnections && req.app.locals.sseConnections[jobApplication.candidateProfileId]) {
                        req.app.locals.sseConnections[jobApplication.candidateProfileId].sseSend({
                            type: 'new_notification',
                            data: formattedNotification
                        });
                    }
                }
            }

            return jobApplication;
        });

        return generateResponse(res, 200, 'Application status updated successfully', {
            isHired: result.isHired,
            isShortlisted: result.isShortlisted,
            isRejected: result.isRejected,
            isUnderReview: result.isUnderReview,
            status: result.status
        });
    } catch (error) {
        console.error('Error updating application status:', error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};

const getShortlistedCandidates = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return generateResponse(res, 401, 'Unauthorized: User not authenticated');
        }

        const { jobpostId } = req.params;
        const eid = req.user.id;

        // Fetch the job post to ensure it belongs to the current employer
        const jobPost = await EmployerJobPost.findOne({
            where: { jobpostId, eid }
        });

        if (!jobPost) {
            return generateResponse(res, 404, 'Job post not found');
        }

        // Fetch shortlisted candidates from JobApplication
        const jobApplications = await JobApplication.findAll({
            where: {
                jobpostId,
                isShortlisted: true
            },
            attributes: ['applicationId', 'candidateProfileId', 'status', 'appliedDate']
        });

        // Get unique candidate profile IDs
        const candidateProfileIds = [...new Set(jobApplications.map(app => app.candidateProfileId))];

        // Fetch candidate profiles
        const candidateProfiles = await CandidateProfile.findAll({
            where: { profileId: candidateProfileIds },
            attributes: [
                'profileId',
                'candidate_name',
                'email',
                'qualification',
                'jobrole',
                'experience',
                'city',
                'country',
                'candidate_image'
            ]
        });

        // Create a map of candidate profiles for easy lookup
        const profileMap = new Map(candidateProfiles.map(profile => [profile.profileId, profile]));

        // Combine the data
        const formattedCandidates = jobApplications.map(application => {
            const profile = profileMap.get(application.candidateProfileId);
            return {
                applicationId: application.applicationId,
                status: application.status,
                appliedDate: application.appliedDate,
                candidate: profile ? {
                    profileId: profile.profileId,
                    candidate_name: profile.candidate_name,
                    email: profile.email,
                    qualification: profile.qualification,
                    jobrole: profile.jobrole,
                    experience: profile.experience,
                    city: profile.city,
                    country: profile.country,
                    candidate_image: profile.candidate_image ? profile.candidate_image.toString('base64') : null
                } : null
            };
        });

        return generateResponse(res, 200, 'Shortlisted candidates retrieved successfully', { shortlistedCandidates: formattedCandidates });
    } catch (error) {
        console.error('Error retrieving shortlisted candidates:', error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};

module.exports = {
    createJobPost,
    getEmployerJobPosts,
    getAllJobPosts,
    getJobPostById,
    updateJobPost,
    getAppliedCandidates,
    getCandidateDetails,
    JobPostStatus,
    deleteJobPost,
    getApplicationStatus,
    updateApplicationStatus,
    getShortlistedCandidates,
};
