const ManageAds = require('../../models/Admin/ManageAds');
const { generateResponse } = require('../../utils/responseUtils');

const createOrUpdateAd = async (req, res) => {
  let { id, placementName, price, durationType } = req.body;

  placementName = placementName || '';
  price = price || 0;
  durationType = durationType || '';

  try {
    let ad;
    if (id) {
      // Update existing ad
      ad = await ManageAds.findByPk(id);
      if (!ad) {
        return generateResponse(res, 404, 'Ad not found');
      }
      await ad.update({ placementName, price, durationType });
    } else {
      // Create new ad
      ad = await ManageAds.create({ placementName, price, durationType });
    }
    return generateResponse(res, 200, `Ad ${id ? 'updated' : 'created'} successfully`, ad);
  } catch (error) {
    console.error(`Error ${id ? 'updating' : 'creating'} ad:`, error);
    return generateResponse(res, 500, 'Server error', null, error.message);
  }
};

const getAds = async (req, res) => {
  try {
    const ads = await ManageAds.findAll();
    return generateResponse(res, 200, 'Ads retrieved successfully', ads);
  } catch (error) {
    console.error('Error retrieving ads:', error);
    return generateResponse(res, 500, 'Server error', null, error.message);
  }
};

const deleteAd = async (req, res) => {
  const { id } = req.params;
  try {
    const ad = await ManageAds.findByPk(id);
    if (!ad) {
      return generateResponse(res, 404, 'Ad not found');
    }
    await ad.destroy();
    return generateResponse(res, 200, 'Ad deleted successfully');
  } catch (error) {
    console.error('Error deleting ad:', error);
    return generateResponse(res, 500, 'Server error', null, error.message);
  }
};

module.exports = {
  createOrUpdateAd,
  getAds,
  deleteAd,
};