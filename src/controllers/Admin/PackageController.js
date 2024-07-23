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
      const updateResults = [];
  
      for (const [packageId, updates] of Object.entries(req.body)) {
        console.log(`Updating package with ID: ${packageId}`);
        console.log('With updates:', updates);
  
        // Handle discount percentage
        if (updates.discountPercentage === null || updates.discountPercentage === '') {
          updates.discountPercentage = 0;
        } else {
          updates.discountPercentage = Number(updates.discountPercentage);
        }
  
        // Ensure all numeric fields are converted to numbers and not empty strings
        const numericFields = ['originalPrice', 'discountedPrice', 'duration'];
        numericFields.forEach(field => {
          if (field in updates) {
            updates[field] = updates[field] === '' ? 0 : Number(updates[field]);
          }
        });
  
        // Calculate discountedPrice if originalPrice is present
        if ('originalPrice' in updates) {
          const discountMultiplier = 1 - (updates.discountPercentage / 100);
          updates.discountedPrice = Number((updates.originalPrice * discountMultiplier).toFixed(2));
        }
  
        // Convert boolean fields to actual boolean values
        const booleanFields = ['companyProfiles', 'candidateProfileUnlocks', 'resumeDatabaseAccess',
                                'integrationWithOtherPlatforms', 'jobPosting', 'searchAndFilters',
                                'analyticsAndReporting'];
        booleanFields.forEach(field => {
          if (field in updates) {
            updates[field] = Boolean(updates[field]);
          }
        });
  
        // Remove undefined or null values
        Object.keys(updates).forEach(key => {
          if (updates[key] === undefined || updates[key] === null) {
            delete updates[key];
          }
        });
  
        try {
          const [updatedCount] = await PackageModel.update(updates, { 
            where: { packageId: Number(packageId) }
          });
          
          if (updatedCount === 0) {
            updateResults.push({ packageId, status: 'not found' });
          } else {
            updateResults.push({ packageId, status: 'updated' });
          }
        } catch (updateError) {
          console.error(`Error updating package ${packageId}:`, updateError);
          updateResults.push({ packageId, status: 'error', message: updateError.message });
        }
      }
  
      res.status(200).json({ message: 'Package update process completed', results: updateResults });
    } catch (error) {
      console.error('Error in update process:', error);
      res.status(500).json({ error: 'Failed to complete package update process', details: error.message });
    }
  },
};

module.exports = PackageController;
