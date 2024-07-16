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
        facebook,
        twitter,
        instagram,
        behance,
        dribbble,
    } = req.body;

    const { id: cid } = req.user;

    try {
        const candidate = await Candidate.findByPk(cid);
        if (!candidate) {
            return generateResponse(res, 404, 'Candidate not found');
        }

        let candidateProfile = await CandidateProfile.findOne({ where: { cid } });

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
            facebook,
            twitter,
            instagram,
            behance,
            dribbble,
        };

        if (candidateProfile) {
            await candidateProfile.update(updatedFields);
            await candidate.update({ candidate_name, phone_number });
        } else {
            updatedFields.cid = cid;
            candidateProfile = await CandidateProfile.create(updatedFields);
        }

        const profileData = {
            ...candidateProfile.toJSON(),
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

        // const profileData = {
        //     ...candidateProfile.toJSON(),
        // };

         // Exclude candidate_image and candidate_resume from profileData
         const { candidate_image, candidate_resume, resumeFileName, ...profileData } = candidateProfile.toJSON();

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
            candidate_resume: profile.candidate_resume ? profile.candidate_resume.toString('base64') : null,
        }));

        return generateResponse(res, 200, 'All candidate profiles fetched successfully', { profiles: profilesData });
    } catch (error) {
        console.error('Error fetching all candidate profiles:', error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};

const getCandidateImage = async (req, res) => {
    try {
        const { id: cid } = req.user;

        const candidateProfile = await CandidateProfile.findOne({ where: { cid } });

        if (!candidateProfile || !candidateProfile.candidate_image) {
            return generateResponse(res, 404, 'Candidate image not found');
        }

        const imageBase64 = candidateProfile.candidate_image.toString('base64');

        return generateResponse(res, 200, 'Candidate image fetched successfully', { candidate_image: imageBase64 });
    } catch (error) {
        console.error('Error fetching candidate image:', error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};

const uploadCandidateImage = async (req, res) => {
    try {
        const { id: cid } = req.user;

        // Check if image file was uploaded
        if (!req.files || !req.files['candidate_image']) {
            return generateResponse(res, 400, 'No image file uploaded');
        }

        // Get candidate profile by cid
        const candidateProfile = await CandidateProfile.findOne({ where: { cid } });

        if (!candidateProfile) {
            return generateResponse(res, 404, 'Candidate profile not found');
        }

        // Limit image size check (1MB limit)
        const maxFileSize = 1 * 1024 * 1024; // 1MB in bytes
        const imageFile = req.files['candidate_image'][0];

        if (imageFile.size > maxFileSize) {
            return generateResponse(res, 400, 'Image size exceeds the maximum allowed size (1MB)');
        }

        // Update candidate profile with image buffer
        await candidateProfile.update({ candidate_image: imageFile.buffer });

        return generateResponse(res, 200, 'Candidate image uploaded successfully');
    } catch (error) {
        console.error('Error uploading candidate image:', error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};


const getCandidateResume = async (req, res) => {
    try {
        const { id: cid } = req.user;

        const candidateProfile = await CandidateProfile.findOne({ where: { cid } });

        if (!candidateProfile || !candidateProfile.candidate_resume) {
            return generateResponse(res, 404, 'Candidate resume not found');
        }

        const resumeBase64 = candidateProfile.candidate_resume.toString('base64');

        return generateResponse(res, 200, 'Candidate resume fetched successfully', { 
            candidate_resume: resumeBase64,
            resumeFileName: candidateProfile.resumeFileName
        });
    } catch (error) {
        console.error('Error fetching candidate resume:', error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};

const uploadCandidateResume = async (req, res) => {
    try {
        const { id: cid } = req.user;

        if (!req.files || !req.files['candidate_resume']) {
            return generateResponse(res, 400, 'No resume file uploaded');
        }

        const candidateProfile = await CandidateProfile.findOne({ where: { cid } });

        if (!candidateProfile) {
            return generateResponse(res, 404, 'Candidate profile not found');
        }

        // Add file size limit check (3MB limit)
        const maxFileSize = 3 * 1024 * 1024; // 3MB in bytes
        const resumeFile = req.files['candidate_resume'][0];

        if (resumeFile.size > maxFileSize) {
            return generateResponse(res, 400, 'Resume file size exceeds the maximum allowed size (3MB)');
        }

        await candidateProfile.update({ 
            candidate_resume: resumeFile.buffer,
            resumeFileName: resumeFile.originalname
        });

        return generateResponse(res, 200, 'Candidate resume uploaded successfully');
    } catch (error) {
        console.error('Error uploading candidate resume:', error);
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
    getCandidateImage,
    uploadCandidateImage,
    getCandidateResume,
    uploadCandidateResume,
    uploadFiles,
};
