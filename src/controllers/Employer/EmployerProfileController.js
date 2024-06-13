// EmployerProfileController.js

const Employer = require('../../models/EmployerModel');
const EmployerProfile = require('../../models/EmployerProfile');
const { generateResponse } = require('../../utils/responseUtils');

const createOrUpdateEmployerProfile = async (req, res) => {
    const {
        email,
        company_name,
        phone_number,
        company_website,
        country,
        city,
        pincode,
        full_address,
        description,
        linkedIn,
        github
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

        // Check if a profile already exists for this employer
        let employerProfile = await EmployerProfile.findOne({ where: { eid } });

        if (employerProfile) {
            // Update the existing profile
            await employerProfile.update({
                email,
                company_name,
                phone_number,
                company_website,
                country,
                city,
                pincode,
                full_address,
                description,
                linkedIn,
                github
            });

            // Update the company_name in the Employer model
            await employer.update({ company_name });

            return generateResponse(res, 200, 'Employer profile updated successfully', { profile: employerProfile });
        } else {
            // Create a new profile
            employerProfile = await EmployerProfile.create({
                eid,
                email,
                company_name,
                phone_number,
                company_website,
                country,
                city,
                pincode,
                full_address,
                description,
                linkedIn,
                github
            });
            return generateResponse(res, 201, 'Employer profile created successfully', { profile: employerProfile });
        }
    } catch (error) {
        console.error('Error creating/updating employer profile:', error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};

const getEmployerProfile = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return generateResponse(res, 401, 'Unauthorized: User not authenticated');
        }

        const eid = req.user.id;

        const employerProfile = await EmployerProfile.findOne({ where: { eid } });

        if (!employerProfile) {
            return generateResponse(res, 404, 'Employer profile not found');
        }

        return generateResponse(res, 200, 'Employer profile fetched successfully', { profile: employerProfile });
    } catch (error) {
        console.error('Error fetching employer profile:', error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};

module.exports = {
    createOrUpdateEmployerProfile,
    getEmployerProfile,
};