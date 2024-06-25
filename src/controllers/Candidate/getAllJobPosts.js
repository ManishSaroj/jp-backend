const EmployerJobPost = require('../../models/EmployerJobPost');
const EmployerProfile = require('../../models/EmployerProfile');
const Employer = require('../../models/EmployerModel');
const { generateResponse } = require('../../utils/responseUtils');
const { calculatePostedDateTimeline, formatDate } = require('../../utils/dateUtils');

const getAllJobPosts = async (req, res) => {
    try {
        const jobPosts = await EmployerJobPost.findAll({
            include: [{
                model: Employer,
                include: [{
                    model: EmployerProfile
                }]
            }]
        });

        if (jobPosts.length === 0) {
            return generateResponse(res, 404, 'No job posts found');
        }

        // Map job posts to format the response
        const formattedJobPosts = jobPosts.map(job => ({
            jobpostId: job.jobpostId,
            eid: job.eid,
            jobTitle: job.jobTitle,
            jobCategory: job.jobCategory,
            jobType: job.jobType,
            minSalary: job.minSalary,
            maxSalary: job.maxSalary,
            salaryFrequency: job.salaryFrequency,
            experience: job.experience,
            qualification: job.qualification,
            gender: job.gender,
            country: job.country,
            state: job.state,
            city: job.city,
            email: job.email,
            jobAddress: job.jobAddress,
            skills: job.skills,
            description: job.description,
            jobReq: job.jobReq,
            jobRes: job.jobRes,
            startDate: job.startDate,
            endDate: job.endDate,
            postedDate: job.postedDate,
            createdAt: job.createdAt,
            updatedAt: job.updatedAt,
            endDateTimeline: formatDate(job.endDate),
            datePosted: formatDate(job.postedDate),
            postedTimeline: calculatePostedDateTimeline(job.createdAt), // Add timeline
            // Include all EmployerProfile data
            EmployerProfile: job.Employer.EmployerProfile 
                ? {
                    ...job.Employer.EmployerProfile.toJSON(),
                    company_logo: job.Employer.EmployerProfile.company_logo 
                        ? job.Employer.EmployerProfile.company_logo.toString('base64') 
                        : null,
                    company_banner: job.Employer.EmployerProfile.company_banner 
                        ? job.Employer.EmployerProfile.company_banner.toString('base64') 
                        : null,
                  }
                : null,
        }));

        return generateResponse(res, 200, 'Job posts retrieved successfully', { jobPosts: formattedJobPosts });
    } catch (error) {
        console.error('Error retrieving job posts:', error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};

const getJobPostById = async (req, res) => {
    const { jobpostId } = req.params; // Assuming jobpostId is passed in the request params
    try {
        const jobPost = await EmployerJobPost.findByPk(jobpostId, {
            include: [{
                model: Employer,
                include: [{
                    model: EmployerProfile
                }]
            }]
        });

        if (!jobPost) {
            return generateResponse(res, 404, 'Job post not found');
        }

        // Format the response
        const formattedJobPost = {
            jobpostId: jobPost.jobpostId,
            eid: jobPost.eid,
            jobTitle: jobPost.jobTitle,
            jobCategory: jobPost.jobCategory,
            jobType: jobPost.jobType,
            minSalary: jobPost.minSalary,
            maxSalary: jobPost.maxSalary,
            salaryFrequency: jobPost.salaryFrequency,
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
            postedDate: jobPost.postedDate,
            createdAt: jobPost.createdAt,
            updatedAt: jobPost.updatedAt,
            endDateTimeline: formatDate(jobPost.endDate),
            datePosted: formatDate(jobPost.postedDate),
            postedTimeline: calculatePostedDateTimeline(jobPost.createdAt), // Add timeline
            // Include all fields from EmployerProfile
            EmployerProfile: jobPost.Employer.EmployerProfile 
                ? {
                    ...jobPost.Employer.EmployerProfile.toJSON(),
                    company_logo: jobPost.Employer.EmployerProfile.company_logo 
                        ? jobPost.Employer.EmployerProfile.company_logo.toString('base64') 
                        : null,
                    company_banner: jobPost.Employer.EmployerProfile.company_banner 
                        ? jobPost.Employer.EmployerProfile.company_banner.toString('base64') 
                        : null,
                  }
                : null,
        };

        return generateResponse(res, 200, 'Job post retrieved successfully', { jobPost: formattedJobPost });
    } catch (error) {
        console.error(`Error retrieving job post with id ${jobpostId}:`, error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};

module.exports = {
    getAllJobPosts,
    getJobPostById,
};
