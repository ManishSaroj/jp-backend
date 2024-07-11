const PackageModel = require('../../models/Admin/PackageModel');

const PackageController = {
    createOrUpdatePackage: async (req, res) => {
        try {
            const { name, originalPrice, discountedPrice, duration, ...features } = req.body;
            const [package, created] = await PackageModel.upsert({
                name,
                originalPrice,
                discountedPrice,
                duration,
                ...features
            }, { returning: true });
            
            const status = created ? 201 : 200;
            res.status(status).json(package);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create or update package' });
        }
    },

    getAllPackages: async (req, res) => {
        try {
            const packages = await PackageModel.findAll();
            res.status(200).json(packages);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch packages' });
        }
    },

    updatePackageDetails: async (req, res) => {
        try {
            const { packageName, updates } = req.body;
            const updatedPackage = await PackageModel.update(
                updates,
                { where: { name: packageName } }
            );
            if (updatedPackage[0] === 0) {
                return res.status(404).json({ error: 'Package not found' });
            }
            res.status(200).json({ message: 'Package details updated successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to update package details' });
        }
    },
};

module.exports = PackageController;