// CandidateProfileController.js

const Candidate = require('../../models/Candidate/CandidateModel');
const CandidateProfile = require('../../models/Candidate/CandidateProfile');
const { generateResponse } = require('../../utils/responseUtils');
const multer = require('multer');

// Multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const createOrUpdateCandidateProfile = async (req, res) => {
    const {
        email,
        candidate_name,
        phone_number,
        website,
        qualification,
        languages,
        jobrole,
        jobCategory,
        experience,
        dob,
        age,
        gender,
        country,
        city,
        pincode,
        fullAddress,
        skills,
        aboutme,
        linkedIn,
        github,
    } = req.body;

    const { id: cid } = req.user;

    try {
        const candidate = await Candidate.findByPk(cid);
        if (!candidate) {
            return generateResponse(res, 404, 'Candidate not found');
        }
        
        let candidateProfile = await CandidateProfile.findOne({ where: { cid }});

        const updatedFields = {
            email,
            candidate_name,
            phone_number,
            website,
            qualification,
            languages,
            jobrole,
            jobCategory,
            experience,
            dob,
            age,
            gender,
            country,
            city,
            pincode,
            fullAddress,
            skills,
            aboutme,
            linkedIn,
            github,
        };

        if (req.files && req.files['candidate_image']) {
            updatedFields.candidate_image = req.files['candidate_image'][0].buffer;
        }

        if (req.files && req.files['candidate_banner']) {
            updatedFields.candidate_banner = req.files['candidate_banner'][0].buffer;
        }

        if (req.files && req.files['candidate_resume']) {
            updatedFields.candidate_resume = req.files['candidate_resume'][0].buffer;
            updatedFields.resumeFileName = req.files['candidate_resume'][0].originalname; // Set resumeFileName from the uploaded file's original name
        }

        if (candidateProfile) {
            await candidateProfile.update(updatedFields);
            await candidate.update({ candidate_name, phone_number });
        } else {
            updatedFields.cid = cid;
            candidateProfile = await CandidateProfile.create(updatedFields);
        }

        const profileData = {
            ...candidateProfile.toJSON(),
            candidate_image: candidateProfile.candidate_image ? candidateProfile.candidate_image.toString('base64') : null,
            candidate_banner: candidateProfile.candidate_banner ? candidateProfile.candidate_banner.toString('base64') : null,
            candidate_resume: candidateProfile.candidate_resume ? candidateProfile.candidate_resume.toString('base64') : null,
            resumeFileName: candidateProfile.resumeFileName,
        };

        const status = candidateProfile.isNewRecord ? 201 : 200;
        const message = candidateProfile.isNewRecord ? 'Candidate profile created successfully' : 'Candidate profile updated successfully';
        return generateResponse(res, status, message, { profile: profileData });

    } catch (error) {
        console.log('Error creating/updating candidate profile:', error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};

const updateLookingForJobStatus = async (req, res) => {
    const { lookingForJobs } = req.body;
    const { id: cid } = req.user;

    try {
        const candidateProfile = await CandidateProfile.findOne({ where: { cid } });

        if (!candidateProfile) {
            return generateResponse(res, 404, 'Candidate profile not found');
        }

        await candidateProfile.update({ lookingForJobs });

        return generateResponse(res, 200, 'Looking for job status updated successfully', { lookingForJobs });
    } catch (error) {
        console.error('Error updating looking for job status:', error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};

const getCandidateProfile = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return generateResponse(res, 401, 'Unauthorized: User not authenticated');
        }

        const cid = req.user.id;

        const candidateProfile = await CandidateProfile.findOne({ where: { cid } });

        if (!candidateProfile) {
            return generateResponse(res, 404, 'Candidate profile not found');
        }

        const profileData = {
            ...candidateProfile.toJSON(),
            candidate_image: candidateProfile.candidate_image ? candidateProfile.candidate_image.toString('base64') : null,
            candidate_banner: candidateProfile.candidate_banner ? candidateProfile.candidate_banner.toString('base64') : null,
            candidate_resume: candidateProfile.candidate_resume ? candidateProfile.candidate_resume.toString('base64') : null,
        };

        return generateResponse(res, 200, 'Candidate profile fetched successfully', { profile: profileData });
    } catch (error) {
        console.error('Error fetching candidate profile:', error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};

const getAllCandidateProfiles = async (req, res) => {
    try {
        // Fetch all candidate profiles
        const candidateProfiles = await CandidateProfile.findAll();

        // Prepare profiles data to include base64 encoded images if available
        const profilesData = candidateProfiles.map(profile => ({
            ...profile.toJSON(),
            candidate_image: profile.candidate_image ? profile.candidate_image.toString('base64') : null,
            candidate_banner: profile.candidate_banner ? profile.candidate_banner.toString('base64') : null,
            candidate_resume: profile.candidate_resume ? profile.candidate_resume.toString('base64') : null,
        }));

        return generateResponse(res, 200, 'All candidate profiles fetched successfully', { profiles: profilesData });
    } catch (error) {
        console.error('Error fetching all candidate profiles:', error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};

// Middleware to handle file uploads for candidate_image and candidate_banner
const uploadFiles = upload.fields([{ name: 'candidate_image', maxCount: 1 }, { name: 'candidate_banner', maxCount: 1 }, { name: 'candidate_resume', maxCount: 1 }]);

module.exports = {
    createOrUpdateCandidateProfile,
    updateLookingForJobStatus,
    getCandidateProfile,
    getAllCandidateProfiles,
    uploadFiles,
};
