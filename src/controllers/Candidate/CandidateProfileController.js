// CandidateProfileController.js

const Candidate = require('../../models/CandidateModel');
const CandidateProfile = require('../../models/CandidateProfile');
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
        currentSalary,
        expectedSalary,
        age,
        country,
        city,
        pincode,
        fullAddress,
        description,
        linkedIn,
        github
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
            currentSalary,
            expectedSalary,
            age,
            country,
            city,
            pincode,
            fullAddress,
            description,
            linkedIn,
            github,
        };

        if (req.files && req.files['candidate_image']) {
            updatedFields.candidate_image = req.files['candidate_image'][0].buffer;
        }

        if (req.files && req.files['candidate_banner']) {
            updatedFields.candidate_banner = req.files['candidate_banner'][0].buffer;
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
        };

        const status = candidateProfile.isNewRecord ? 201 : 200;
        const message = candidateProfile.isNewRecord ? 'Candidate profile created successfully' : 'Candidate profile updated successfully';
        return generateResponse(res, status, message, { profile: profileData });

    } catch (error) {
        console.log('Error creating/updating candidate profile:', error);
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
        };

        return generateResponse(res, 200, 'Candidate profile fetched successfully', { profile: profileData });
    } catch (error) {
        console.error('Error fetching candidate profile:', error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};

// Middleware to handle file uploads for candidate_image and candidate_banner
const uploadImages = upload.fields([{ name: 'candidate_image', maxCount: 1 }, { name: 'candidate_banner', maxCount: 1 }]);

module.exports = {
    createOrUpdateCandidateProfile,
    getCandidateProfile,
    uploadImages,
};
