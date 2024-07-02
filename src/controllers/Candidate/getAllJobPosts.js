const EmployerJobPost = require('../../models/EmployerJobPost');
const EmployerProfile = require('../../models/EmployerProfile');
const Employer = require('../../models/EmployerModel');
const JobApplication = require('../../models/JobApplication');
const CandidateProfile = require('../../models/CandidateProfile');
const { generateResponse } = require('../../utils/responseUtils');
const { calculatePostedDateTimeline, formatDate, convertToFormattedDate } = require('../../utils/dateUtils');
const { employerSequelize } = require('../../config/db.config')

const getAllJobPosts = async (req, res) => {
    try {
        const jobPosts = await EmployerJobPost.findAll({
            include: [{
                model: Employer,
                include: [EmployerProfile]
            }]
        });

        if (jobPosts.length === 0) {
            return generateResponse(res, 404, 'No job posts found');
        }

        const formattedJobPosts = jobPosts.map(job => ({
            ...formatJobPostResponse(job),
            EmployerProfile: formatEmployerProfile(job.Employer.EmployerProfile)
        }));

        return generateResponse(res, 200, 'Job posts retrieved successfully', { jobPosts: formattedJobPosts });
    } catch (error) {
        console.error('Error retrieving job posts:', error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};

const getJobPostById = async (req, res) => {
    const { jobpostId } = req.params;
    const { profileId } = req.query;

    try {
        const jobPost = await findJobPostById(jobpostId);

        if (!jobPost) {
            return generateResponse(res, 404, 'Job post not found');
        }

        const hasApplied = profileId ? await hasCandidateApplied(profileId, jobpostId) : false;

        const formattedJobPost = {
            ...formatJobPostResponse(jobPost),
            EmployerProfile: formatEmployerProfile(jobPost.Employer.EmployerProfile),
            hasApplied,
            isActive: jobPost.isActive 
        };

        return generateResponse(res, 200, 'Job post retrieved successfully', { jobPost: formattedJobPost });
    } catch (error) {
        console.error(`Error retrieving job post with id ${jobpostId}:`, error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};

const applyForJob = async (req, res) => {
    const { candidateProfileId, jobpostId, employerProfileId } = req.body;

    try {
        const jobPost = await EmployerJobPost.findByPk(jobpostId);

        if (!jobPost) {
            return generateResponse(res, 404, 'Job post not found');
        }

        if (!jobPost.isActive) {
            return generateResponse(res, 400, 'This job post is no longer accepting applications');
        }
        const existingApplication = await JobApplication.findOne({
            where: { candidateProfileId, jobpostId }
        });

        if (existingApplication) {
            return generateResponse(res, 400, 'You have already applied for this job');
        }

        await validateEntitiesExist(jobpostId, employerProfileId, candidateProfileId);

        // Start a transaction
        const result = await employerSequelize.transaction(async (t) => {
            // Create the job application
            const jobApplication = await JobApplication.create({
                candidateProfileId,
                jobpostId,
                employerProfileId,
                isApplied: true,
                isUnderReview: false,
                isShortlisted: false,
                isRejected: false,
                isHired: false,
                appliedDate: new Date()
            }, { transaction: t });

            // Increment the appliedCandidatesCount
            await EmployerJobPost.increment('appliedCandidatesCount', {
                by: 1,
                where: { jobpostId },
                transaction: t
            });

            return jobApplication;
        });

        return generateResponse(res, 201, 'Job application submitted successfully', { jobApplication: result });
    } catch (error) {
        console.error('Error applying for job:', error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};

const getAppliedJobsForCandidate = async (req, res) => {
    const { profileId } = req.query;

    try {
        const appliedJobs = await JobApplication.findAll({
            where: { candidateProfileId: profileId },
            include: [{
                model: EmployerJobPost,
                include: [{
                    model: Employer,
                    include: [EmployerProfile] // Include employer profile here
                }]
            }]
        });

        if (appliedJobs.length === 0) {
            return generateResponse(res, 404, 'No applied jobs found');
        }

        const formattedAppliedJobs = [];
        for (const jobApplication of appliedJobs) {
            try {
                const jobPost = await findJobPostById(jobApplication.jobpostId);
                if (!jobPost) {
                    throw new Error(`Job post with id ${jobApplication.jobpostId} not found`);
                }

                const employerProfile = jobApplication.EmployerJobPost.Employer.EmployerProfile;
                const formattedJobApplication = {
                    jobApplicationId: jobApplication.applicationId,
                    jobpostId: jobApplication.jobpostId,
                    jobTitle: jobApplication.EmployerJobPost.jobTitle,
                    employerName: jobApplication.EmployerJobPost.Employer.companyName,
                    appliedDate: formatDate(jobApplication.appliedDate),
                    status: jobApplication.status,
                    jobPost: {
                        ...formatJobPostResponse(jobPost),
                        EmployerProfile: formatEmployerProfile(employerProfile)
                    }
                };

                formattedAppliedJobs.push(formattedJobApplication);
            } catch (error) {
                console.error('Error formatting applied job:', error);
            }
        }

        return generateResponse(res, 200, 'Applied jobs retrieved successfully', { appliedJobs: formattedAppliedJobs });
    } catch (error) {
        console.error('Error retrieving applied jobs:', error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};






// Helper functions

async function findJobPostById(jobpostId) {
    return await EmployerJobPost.findByPk(jobpostId, {
        include: [{
            model: Employer,
            include: [EmployerProfile]
        }]
    });
}

async function hasCandidateApplied(profileId, jobpostId) {
    const existingApplication = await JobApplication.findOne({
        where: { candidateProfileId: profileId, jobpostId }
    });
    return !!existingApplication;
}

function formatJobPostResponse(jobPost) {
    return {
        jobpostId: jobPost.jobpostId,
        eid: jobPost.eid,
        jobTitle: jobPost.jobTitle,
        jobCategory: jobPost.jobCategory,
        jobType: jobPost.jobType,
        minSalary: jobPost.minSalary,
        maxSalary: jobPost.maxSalary,
        salaryFrequency: jobPost.salaryFrequency,
        totalOpenings: jobPost.totalOpenings,
        duration: jobPost.duration,
        experience: jobPost.experience,
        qualification: jobPost.qualification,
        gender: jobPost.gender,
        country: jobPost.country,
        state: jobPost.state,
        city: jobPost.city,
        email: jobPost.email,
        jobAddress: jobPost.jobAddress,
        skills: jobPost.skills,
        description: jobPost.description,
        jobReq: jobPost.jobReq,
        jobRes: jobPost.jobRes,
        startDate: jobPost.startDate,
        endDate: jobPost.endDate,
        createdAt: jobPost.createdAt,
        updatedAt: jobPost.updatedAt,
        endDateTimeline: formatDate(jobPost.endDate),
        datePosted: convertToFormattedDate(jobPost.createdAt),
        postedTimeline: calculatePostedDateTimeline(jobPost.createdAt),
         appliedCandidatesCount: jobPost.appliedCandidatesCount 
    };
}

function formatEmployerProfile(employerProfile) {
    return employerProfile ? {
        ...employerProfile.toJSON(),
        company_logo: employerProfile.company_logo ? employerProfile.company_logo.toString('base64') : null,
        company_banner: employerProfile.company_banner ? employerProfile.company_banner.toString('base64') : null
    } : null;
}

async function validateEntitiesExist(jobpostId, employerProfileId, candidateProfileId) {
    const jobPost = await EmployerJobPost.findByPk(jobpostId);
    if (!jobPost) {
        throw new Error('Job post not found');
    }

    const employerProfile = await EmployerProfile.findByPk(employerProfileId);
    if (!employerProfile) {
        throw new Error('Employer profile not found');
    }

    const candidateProfile = await CandidateProfile.findByPk(candidateProfileId);
    if (!candidateProfile) {
        throw new Error('Candidate profile not found');
    }
}

module.exports = {
    getAllJobPosts,
    getJobPostById,
    applyForJob,
    getAppliedJobsForCandidate,
};
