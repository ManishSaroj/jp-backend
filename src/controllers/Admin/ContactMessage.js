const ContactMessage = require('../../models/Admin/ContactMessage');
const { generateResponse } = require('../../utils/responseUtils');
const { Op } = require('sequelize');

// Create a new contact message
const createMessage = async (req, res) => {
  try {
    const { name, email, subject, phoneNumber, message, termsAgreed } = req.body;
    
    const newMessage = await ContactMessage.create({
      name,
      email,
      subject,
      phoneNumber,
      message,
      termsAgreed
    });

    generateResponse(res, 201, 'Contact message sent successfully', newMessage);
  } catch (error) {
    generateResponse(res, 500, 'Error sending contact message', null, error.message);
  }
};

// Get all contact messages with sorting, pagination, and search
const getAllMessages = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', search = '' } = req.query;

    // Validate sortOrder
    if (sortOrder !== 'ASC' && sortOrder !== 'DESC') {
      return generateResponse(res, 400, 'Invalid sort order');
    }

    // Convert page and limit to integers
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);

    // Calculate offset
    const offset = (pageInt - 1) * limitInt;

    // Build where clause for search
    const whereClause = search
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { subject: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    // Find and count all messages
    const { count, rows: messages } = await ContactMessage.findAndCountAll({
      where: whereClause,
      order: [[sortBy, sortOrder]],
      limit: limitInt,
      offset: offset,
    });

    if (!messages || messages.length === 0) {
      return generateResponse(res, 404, 'No contact messages found');
    }

    // Calculate total pages
    const totalPages = Math.ceil(count / limitInt);

    // Generate response
    generateResponse(res, 200, 'Contact messages retrieved successfully', {
      messages,
      currentPage: pageInt,
      totalPages,
      totalMessages: count,
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};

// Delete a single contact message by ID
const deleteMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await ContactMessage.findByPk(id);

    if (!message) {
      return generateResponse(res, 404, 'Contact message not found');
    }

    await message.destroy();

    generateResponse(res, 200, 'Contact message deleted successfully');
  } catch (error) {
    generateResponse(res, 500, 'Error deleting contact message', null, error.message);
  }
};

// Delete all contact messages
const deleteAllMessages = async (req, res) => {
  try {
    const deletedCount = await ContactMessage.destroy({ where: {} });

    generateResponse(res, 200, 'All contact messages deleted successfully', { deletedCount });
  } catch (error) {
    generateResponse(res, 500, 'Error deleting all contact messages', null, error.message);
  }
};

const updateMessageReadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isRead } = req.body;
    
    const message = await ContactMessage.findByPk(id);
    
    if (!message) {
      return generateResponse(res, 404, 'Contact message not found');
    }
    
    await message.update({ isRead });
    
    generateResponse(res, 200, 'Message read status updated successfully', message);
  } catch (error) {
    generateResponse(res, 500, 'Error updating message read status', null, error.message);
  }
};

module.exports = {
  createMessage,
  getAllMessages,
  deleteMessageById,
  deleteAllMessages,
  updateMessageReadStatus,
};
