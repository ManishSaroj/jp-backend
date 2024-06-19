const Employer = require('../../models/EmployerModel');
const EmployerProfile = require('../../models/EmployerProfile');
const { generateResponse } = require('../../utils/responseUtils');
const multer = require('multer');

// Multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
        linkedin,
        github,
    } = req.body;

    const { id: eid } = req.user;

    try {
        const employer = await Employer.findByPk(eid);
        if (!employer) {
            return generateResponse(res, 404, 'Employer not found');
        }

        let employerProfile = await EmployerProfile.findOne({ where: { eid } });

        const updatedFields = {
            email,
            company_name,
            phone_number,
            company_website,
            country,
            city,
            pincode,
            full_address,
            description,
            linkedin,
            github,
        };

        if (req.files && req.files['company_logo']) {
            updatedFields.company_logo = req.files['company_logo'][0].buffer;
        }

        if (req.files && req.files['company_banner']) {
            updatedFields.company_banner = req.files['company_banner'][0].buffer;
        }

        if (employerProfile) {
            await employerProfile.update(updatedFields);
            await employer.update({ company_name, phone_number });
        } else {
            updatedFields.eid = eid;
            employerProfile = await EmployerProfile.create(updatedFields);
        }

        const profileData = {
            ...employerProfile.toJSON(),
            company_logo: employerProfile.company_logo ? employerProfile.company_logo.toString('base64') : null,
            company_banner: employerProfile.company_banner ? employerProfile.company_banner.toString('base64') : null,
        };

        const status = employerProfile.isNewRecord ? 201 : 200;
        const message = employerProfile.isNewRecord ? 'Employer profile created successfully' : 'Employer profile updated successfully';
        return generateResponse(res, status, message, { profile: profileData });

    } catch (error) {
        console.error('Error creating/updating employer profile:', error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};

const getEmployerProfile = async (req, res) => {
    try {
        const { id: eid } = req.user;

        const employerProfile = await EmployerProfile.findOne({ where: { eid } });

        if (!employerProfile) {
            return generateResponse(res, 404, 'Employer profile not found');
        }

        const profileData = {
            ...employerProfile.toJSON(),
            company_logo: employerProfile.company_logo ? employerProfile.company_logo.toString('base64') : null,
            company_banner: employerProfile.company_banner ? employerProfile.company_banner.toString('base64') : null,
        };

        return generateResponse(res, 200, 'Employer profile fetched successfully', { profile: profileData });
    } catch (error) {
        console.error('Error fetching employer profile:', error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};

// Middleware to handle file uploads for company_logo and company_banner
const uploadImages = upload.fields([{ name: 'company_logo', maxCount: 1 }, { name: 'company_banner', maxCount: 1 }]);

module.exports = {
    createOrUpdateEmployerProfile,
    getEmployerProfile,
    uploadImages,
};
