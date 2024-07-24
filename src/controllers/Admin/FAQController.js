// controllers/Admin/FAQController.js
const FAQ = require('../../models/Admin/FAQ');
const { generateResponse } = require('../../utils/responseUtils');

const createOrUpdateFAQ = async (req, res) => {
  const faqs = Array.isArray(req.body) ? req.body : [req.body];

  try {
    const results = await Promise.all(faqs.map(async (faq) => {
      const { id, question, answer } = faq;
      if (id) {
        const existingFaq = await FAQ.findByPk(id);
        if (!existingFaq) return { id, error: 'FAQ not found' };
        await existingFaq.update({ question, answer });
        return { ...existingFaq.toJSON(), status: 'updated' };
      } else {
        const newFaq = await FAQ.create({ question, answer });
        return { ...newFaq.toJSON(), status: 'created' };
      }
    }));

    const created = results.filter(faq => faq.status === 'created');
    const updated = results.filter(faq => faq.status === 'updated');
    const failed = results.filter(faq => faq.error);

    return generateResponse(res, 200, 'FAQs processed successfully', {
      created,
      updated,
      failed
    });
  } catch (error) {
    console.error('Error processing FAQs:', error);
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
  createOrUpdateFAQ,
  getFAQs,
  deleteFAQ,
};