const Employer = require('../../models/EmployerModel');
const EmployerJobPost = require('../../models/EmployerJobPost');
const { generateResponse } = require('../../utils/responseUtils');

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

module.exports = {
    createJobPost,
    getEmployerJobPosts,
    getAllJobPosts,
    getJobPostById
};
