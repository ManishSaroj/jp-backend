const SavedCandidate = require('../../models/Employer/savedCandidate');
const CandidateProfile = require('../../models/Candidate/CandidateProfile');
const EmployerProfile = require('../../models/Employer/EmployerProfile');
const { generateResponse } = require('../../utils/responseUtils');
const { employerSequelize, candidateSequelize } = require('../../config/db.config');

const saveCandidate = async (req, res) => {
    try {
        const { employerProfileId, candidateProfileId } = req.body;

        const existingSavedCandidate = await SavedCandidate.findOne({
            where: { employerProfileId, candidateProfileId },
        });

        if (existingSavedCandidate) {
            return generateResponse(res, 409, 'Candidate is already saved.');
        }

        const newSavedCandidate = await SavedCandidate.create({
            employerProfileId,
            candidateProfileId,
        });

        generateResponse(res, 201, 'Candidate saved successfully', newSavedCandidate);
    } catch (error) {
        console.error('Error saving candidate:', error.message);
        generateResponse(res, 500, 'Internal server error', null, error.message);
    }
};

const getSavedCandidates = async (req, res) => {
    try {
        const { employerProfileId } = req.query;

        // Fetch all saved candidates for the given employer from the employer database
        const savedCandidates = await SavedCandidate.findAll({
            where: { employerProfileId },
        });

        // Extract candidateProfileIds
        const candidateProfileIds = savedCandidates.map(sc => sc.candidateProfileId);

        // Fetch corresponding candidate profiles from the candidate database
        const candidateProfiles = await CandidateProfile.findAll({
            where: {
                profileId: candidateProfileIds
            },
            attributes: ['profileId', 'candidate_name', 'email', 'phone_number', 'qualification', 'languages', 'jobrole', 'experience', 'dob', 'age', 'gender', 'country', 'city', 'pincode', 'fullAddress', 'skills', 'aboutme', 'linkedIn', 'github' , 'facebook', 'twitter', 'instagram', 'behance', 'dribbble', 'candidate_image', 'resumeFileName', 'lookingForJobs'], // Add all fields you want to fetch
        });

        // Combine the data
        const combinedData = savedCandidates.map(sc => {
            const candidateProfile = candidateProfiles.find(cp => cp.profileId === sc.candidateProfileId);
            if (candidateProfile) {
                // Convert BLOB fields to base64 strings if they exist
                candidateProfile.candidate_image = candidateProfile.candidate_image ? candidateProfile.candidate_image.toString('base64') : null;
                candidateProfile.candidate_resume = candidateProfile.candidate_resume ? candidateProfile.candidate_resume.toString('base64') : null;
            }
            return {
                savedId: sc.savedId,
                employerProfileId: sc.employerProfileId,
                candidateProfileId: sc.candidateProfileId,
                savedAt: sc.savedAt,
                candidateProfile: candidateProfile || null
            };
        });

        generateResponse(res, 200, 'Fetched saved candidates successfully', combinedData);
    } catch (error) {
        console.error('Error fetching saved candidates:', error.message);
        generateResponse(res, 500, 'Internal server error', null, error.message);
    }
};



module.exports = {
    saveCandidate,
    getSavedCandidates,
};