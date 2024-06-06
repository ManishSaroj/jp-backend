const Candidate = require('../../models/CandidateModel');
const CandidateProfile = require('../../models/CandidateProfile');
const { generateResponse } = require('../../utils/responseUtils')

const createCandidateProfile = async (req, res) => {
    const {
        email,
        name,
        phone,
        website,
        qualification,
        language,
        jobCategory,
        experience,
        currentSalary,
        expectedSalary,
        age,
        country,
        city,
        postcode,
        fullAddress,
        facebook,
        twitter,
        linkedIn,
        whatsapp,
        instagram,
        pinterest,
        tumblr,
        youtube,
    } = req.body;

    try {
        const candidate = await Candidate.findOne({ where: { email } });
        if (!candidate) {
            return generateResponse(res, 404, 'Candidate not found');
        }

        const existingProfile = await CandidateProfile.findOne({ where: { email } });
        if (existingProfile) {
            return generateResponse(res, 400, 'Profile already exists for this candidate');
        }

        const newProfile = await CandidateProfile.create({
            email,
            name,
            phone,
            website,
            qualification,
            language,
            jobCategory,
            experience,
            currentSalary,
            expectedSalary,
            age,
            country,
            city,
            postcode,
            fullAddress,
            facebook,
            twitter,
            linkedIn,
            whatsapp,
            instagram,
            pinterest,
            tumblr,
            youtube,
        });

        generateResponse(res, 201, 'Candidate profile created successfully', { profile: newProfile });
    } catch (error) {
        console.error('Error creating candidate profile:', error);
        generateResponse(res, 500, 'Server error', null, error.message);
    }
};

module.exports = {
    createCandidateProfile,
};