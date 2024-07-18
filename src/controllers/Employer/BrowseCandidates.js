const { Op } = require('sequelize');
const CandidateProfile = require('../../models/Candidate/CandidateProfile');
const { generateResponse } = require('../../utils/responseUtils');

const browseCandidates = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
        } = req.query;

        const offset = (page - 1) * limit;

        let whereClause = {
            lookingForJobs: true
        };

        if (search) {
            whereClause[Op.or] = [
                { candidate_name: { [Op.like]: `%${search}%` } },
                { qualification: { [Op.like]: `%${search}%` } },
                { jobrole: { [Op.like]: `%${search}%` } },
                { jobCategory: { [Op.like]: `%${search}%` } },
                { pincode: { [Op.like]: `%${search}%` } },
                { gender: { [Op.like]: `%${search}%` } },
                { city: { [Op.like]: `%${search}%` } },
                { state: { [Op.like]: `%${search}%` } },
                { skills: { [Op.like]: `%${search}%` } }
            ];
        }

        // Fetch candidate profiles and count based on the search criteria
        const { count, rows: candidateProfiles } = await CandidateProfile.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: offset,
            order: [['createdAt', 'DESC']],
            attributes: { exclude: ['candidate_resume'] } // Exclude large binary data
        });

        // Prepare profiles data to include base64 encoded images if available
        const profilesData = candidateProfiles.map(profile => ({
            ...profile.toJSON(),
            candidate_image: profile.candidate_image ? profile.candidate_image.toString('base64') : null,
        }));

        const totalPages = Math.ceil(count / limit);

        return generateResponse(res, 200, 'Candidate profiles fetched successfully', {
            profiles: profilesData,
            currentPage: parseInt(page),
            totalPages: totalPages,
            totalCandidates: count
        });
    } catch (error) {
        console.error('Error fetching candidate profiles:', error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};

module.exports = {
    browseCandidates,
};