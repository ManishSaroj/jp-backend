// controllers/Admin/FAQController.js
const FAQ = require('../../models/Admin/FAQ');
const { generateResponse } = require('../../utils/responseUtils');

const createFAQ = async (req, res) => {
  const { question, answer } = req.body;
  try {
    const faq = await FAQ.create({ question, answer });
    return generateResponse(res, 201, 'FAQ created successfully', faq);
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return generateResponse(res, 500, 'Server error', null, error.message);
  }
};

const updateFAQ = async (req, res) => {
  const { id } = req.params;
  const { question, answer } = req.body;
  try {
    const faq = await FAQ.findByPk(id);
    if (!faq) {
      return generateResponse(res, 404, 'FAQ not found');
    }
    await faq.update({ question, answer });
    return generateResponse(res, 200, 'FAQ updated successfully', faq);
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return generateResponse(res, 500, 'Server error', null, error.message);
  }
};

const getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.findAll();
    return generateResponse(res, 200, 'FAQs retrieved successfully', faqs);
  } catch (error) {
    console.error('Error retrieving FAQs:', error);
    return generateResponse(res, 500, 'Server error', null, error.message);
  }
};

const deleteFAQ = async (req, res) => {
  const { id } = req.params;
  try {
    const faq = await FAQ.findByPk(id);
    if (!faq) {
      return generateResponse(res, 404, 'FAQ not found');
    }
    await faq.destroy();
    return generateResponse(res, 200, 'FAQ deleted successfully');
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return generateResponse(res, 500, 'Server error', null, error.message);
  }
};

module.exports = {
  createFAQ,
  updateFAQ,
  getFAQs,
  deleteFAQ,
};