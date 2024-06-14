const Employer = require('../../models/EmployerModel');
const EmployerJobPost = require('../../models/EmployerJobPost');
const { generateResponse } = require('../../utils/responseUtils');

const createJobPost = async (req, res) => {
    const {
        jobTitle,
        jobCategory,
        jobType,
        offeredSalary,
        experience,
        qualification,
        gender,
        country,
        city,
        location,
        email,
        website,
        estSince,
        completeAddress,
        skills,
        description,
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
            offeredSalary,
            experience,
            qualification,
            gender,
            country,
            city,
            location,
            email,
            website,
            estSince,
            completeAddress,
            skills,
            description,
            startDate: new Date(startDate),
            endDate: new Date(endDate)
        });

        return generateResponse(res, 201, 'Job post created successfully', { jobPost });
    } catch (error) {
        console.error('Error creating job post:', error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};

module.exports = {
    createJobPost,
};
