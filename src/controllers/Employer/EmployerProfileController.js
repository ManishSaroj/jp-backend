const Employer = require('../../models/Employer/EmployerModel');
const EmployerProfile = require('../../models/Employer/EmployerProfile');
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
        staffSize,
        country,
        state,
        city,
        pincode,
        estSince,
        full_address,
        description,
        linkedIn,
        github,
        facebook,
        twitter,
        instagram,
        behance,
        dribbble,
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
            staffSize,
            country,
            state,
            city,
            pincode,
            estSince,
            full_address,
            description,
            linkedIn,
            github,
            facebook,
            twitter,
            instagram,
            behance,
            dribbble,
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

const getCompanyLogo = async (req, res) => {
    try {
        const { id: eid } = req.user;

        const employerProfile = await EmployerProfile.findOne({ where: { eid }});

        if (!employerProfile || !employerProfile.company_logo) {
            return generateResponse(res, 404, 'Company Logo not found');
        }

        const imageBase64 = employerProfile.company_logo.toString('base64');

        return generateResponse(res, 200, 'Company logo fetched successfully', { company_logo: imageBase64 });
    } catch (error) {
        console.error('Error fetching company logo:', error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};

const uploadEmployerLogo = async (req, res) => {
    try {
        const { id: eid } = req.user;

        // Check if image file was uploaded
        if (!req.files || !req.files['company_logo']) {
            return generateResponse(res, 400, 'No image file uploaded');
        }

        // Get employer profile by eid
        const employerProfile = await EmployerProfile.findOne({ where: { eid } });

        if (!employerProfile) {
            return generateResponse(res, 404, 'Employer profile not found');
        }

        // Limit image size check (1MB limit)
        const maxFileSize = 1 * 1024 * 1024; // 1MB in bytes
        const imageFile = req.files['company_logo'][0];

        if (imageFile.size > maxFileSize) {
            return generateResponse(res, 400, 'Image size exceeds the maximum allowed size (1MB)');
        }

        // Update employer profile with image buffer
        await employerProfile.update({ company_logo: imageFile.buffer });

        return generateResponse(res, 200, 'Logo uploaded successfully');
    } catch (error) {
        console.error('Error uploading logo:', error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};

const getCompanyBanner = async (req, res) => {
    try {
        const { id: eid } = req.user;

        const employerProfile = await EmployerProfile.findOne({ where: { eid }});

        if (!employerProfile || !employerProfile.company_banner) {
            return generateResponse(res, 404, 'Company Banner not found');
        }

        const imageBase64 = employerProfile.company_banner.toString('base64');

        return generateResponse(res, 200, 'Company banner fetched successfully', { company_banner: imageBase64 });
    } catch (error) {
        console.error('Error fetching company banner:', error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};

const uploadCompanyBanner = async (req, res) => {
    try {
        const { id: eid } = req.user;

        // Check if image file was uploaded
        if (!req.files || !req.files['company_banner']) {
            return generateResponse(res, 400, 'No image file uploaded');
        }

        // Get employer profile by eid
        const employerProfile = await EmployerProfile.findOne({ where: { eid } });

        if (!employerProfile) {
            return generateResponse(res, 404, 'Employer profile not found');
        }

        // Limit image size check (2MB limit for banner)
        const maxFileSize = 2 * 1024 * 1024; // 2MB in bytes
        const imageFile = req.files['company_banner'][0];

        if (imageFile.size > maxFileSize) {
            return generateResponse(res, 400, 'Image size exceeds the maximum allowed size (2MB)');
        }

        // Update employer profile with banner image buffer
        await employerProfile.update({ company_banner: imageFile.buffer });

        return generateResponse(res, 200, 'Banner uploaded successfully');
    } catch (error) {
        console.error('Error uploading banner:', error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};

const getEmployerProfileById = async (req, res) => {
    try {
        const { eid } = req.params; // Assuming the eid is passed as a route parameter

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
        console.error('Error fetching employer profile by ID:', error);
        return generateResponse(res, 500, 'Server error', null, error.message);
    }
};

// Middleware to handle file uploads for company_logo and company_banner
const uploadImages = upload.fields([{ name: 'company_logo', maxCount: 1 }, { name: 'company_banner', maxCount: 1 }]);

module.exports = {
    createOrUpdateEmployerProfile,
    getEmployerProfile,
    getCompanyLogo,
    uploadEmployerLogo,
    getCompanyBanner,
    uploadCompanyBanner,
    uploadImages,
    getEmployerProfileById,
};
