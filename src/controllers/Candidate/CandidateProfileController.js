// CandidateProfileController.js

const Candidate = require('../../models/CandidateModel');
const CandidateProfile = require('../../models/CandidateProfile');
const { generateResponse } = require('../../utils/responseUtils');

const createOrUpdateCandidateProfile = async (req, res) => {
    const {
        email,
        candidate_name,
        phone_number,
        website,
        qualification,
        languages,
        jobCategory,
        experience,
        currentSalary,
        expectedSalary,
        age,
        country,
        city,
        postcode,
        fullAddress,
        description,
        linkedIn,
        github
    } = req.body;

    try {
        if (!req.user || !req.user.id) {
            return generateResponse(res, 401, 'Unauthorized: User not authenticated');
        }

        const cid = req.user.id;

        // Check if the candidate exists
        const candidate = await Candidate.findOne({ where: { cid } });
        if (!candidate) {
            return generateResponse(res, 404, 'Candidate not found');
        }

        // Check if a profile already exists for this candidate
        let candidateProfile = await CandidateProfile.findOne({ where: { cid } });

        if (candidateProfile) {
            // Update the existing profile
            await candidateProfile.update({
                email,
                candidate_name,
                phone_number,
                website,
                qualification,
                languages,
                jobCategory,
                experience,
                currentSalary,
                expectedSalary,
                age,
                country,
                city,
                postcode,
                fullAddress,
                description,
                linkedIn,
                github
            });
            return generateResponse(res, 200, 'Candidate profile updated successfully', { profile: candidateProfile });
        } else {
            // Create a new profile
            candidateProfile = await CandidateProfile.create({
                cid,
                email,
                candidate_name,
                phone_number,
                website,
                qualification,
                languages,
                jobCategory,
                experience,
                currentSalary,
                expectedSalary,
                age,
                country,
                city,
                postcode,
                fullAddress,
                description,
                linkedIn,
                github
            });
            return generateResponse(res, 201, 'Candidate profile created successfully', { profile: candidateProfile });
        }
    } catch (error) {
        console.error('Error creating/updating candidate profile:', error);
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

        return generateResponse(res, 200, 'Candidate profile fetched successfully', { profile: candidateProfile });
    } catch (error) {
        console.error('Error fetching candidate profile:', error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};

module.exports = {
    createOrUpdateCandidateProfile,
    getCandidateProfile,
};