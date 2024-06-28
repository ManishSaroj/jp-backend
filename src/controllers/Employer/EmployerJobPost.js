const Employer = require('../../models/EmployerModel');
const EmployerJobPost = require('../../models/EmployerJobPost');
const JobApplication = require('../../models/JobApplication');
const CandidateProfile = require('../../models/CandidateProfile');
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



module.exports = {
    createJobPost,
    getEmployerJobPosts,
    getAllJobPosts,
    getJobPostById,
    updateJobPost,
    getAppliedCandidates,
};
