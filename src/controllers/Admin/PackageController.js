const PackageModel = require('../../models/Admin/PackageModel');

const PackageController = {
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
            const [updatedCount] = await PackageModel.update(
                updates,
                { where: { name: packageName } }
            );
            if (updatedCount === 0) {
                return res.status(404).json({ error: 'Package not found' });
            }
            res.status(200).json({ message: 'Package details updated successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to update package details' });
        }
    },
};

module.exports = PackageController;