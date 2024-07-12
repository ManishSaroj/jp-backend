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
      console.log('Received request body:', req.body);
      const { packageId, updates } = req.body;

      if (!packageId) {
        return res.status(400).json({ error: 'Package ID is required' });
      }

      console.log('Updating package with ID:', packageId);
      console.log('With updates:', updates);

      // Ensure all numeric fields are converted to numbers
      if (updates.originalPrice) updates.originalPrice = Number(updates.originalPrice);
      if (updates.discountPercentage) updates.discountPercentage = Number(updates.discountPercentage);
      if (updates.discountedPrice) updates.discountedPrice = Number(updates.discountedPrice);
      if (updates.duration) updates.duration = Number(updates.duration);

      // Convert boolean fields to actual boolean values
      const booleanFields = ['companyProfiles', 'candidateProfileUnlocks', 'resumeDatabaseAccess',
                              'integrationWithOtherPlatforms', 'jobPosting', 'searchAndFilters',
                              'analyticsAndReporting'];
      booleanFields.forEach(field => {
        if (field in updates) {
          updates[field] = Boolean(updates[field]);
        }
      });

      const [updatedCount] = await PackageModel.update(
        updates,
        { where: { packageId: packageId } }
      );

      console.log('Updated count:', updatedCount);

      if (updatedCount === 0) {
        return res.status(404).json({ error: 'Package not found' });
      }
      res.status(200).json({ message: 'Package details updated successfully' });
    } catch (error) {
      console.error('Error updating package:', error);
      res.status(500).json({ error: 'Failed to update package details', details: error.message });
    }
  },
};

module.exports = PackageController;