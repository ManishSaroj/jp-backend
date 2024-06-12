const { Resume, Education, Experience, Project, Certification } = require('../../models/ResumeModal');
const Candidate = require('../../models/CandidateModel');
const { generateResponse } = require('../../utils/responseUtils');

// Create a new resume
async function createResume(req, res) {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return generateResponse(res, 401, 'Unauthorized: User not authenticated');
    }

    const cid = req.user.id; // Get the cid from the decoded JWT payload

    // Check if the candidate exists
    const candidate = await Candidate.findOne({ where: { cid } });
    if (!candidate) {
      return generateResponse(res, 404, 'Candidate not found');
    }

    // Add CID to the request body before creating the resume
    req.body.cid = cid;
    const resume = await Resume.create(req.body, {
      include: [Education, Experience, Project, Certification]
    });
    res.status(201).json(resume);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Update an existing resume
async function updateResume(req, res) {
  const { id } = req.params;
  try {
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return generateResponse(res, 401, 'Unauthorized: User not authenticated');
    }

    const cid = req.user.id; // Get the cid from the decoded JWT payload

    // Check if the candidate exists
    const candidate = await Candidate.findOne({ where: { cid } });
    if (!candidate) {
      return generateResponse(res, 404, 'Candidate not found');
    }

    // Find the resume by ID and CID
    const resume = await Resume.findOne({ where: { resumeId: id, cid } });
    if (!resume) {
      return generateResponse(res, 404, 'Resume not found');
    }

    // Update the resume
    const [updated] = await Resume.update(req.body, {
      where: { resumeId: id, cid }
    });
    if (updated) {
      const updatedResume = await Resume.findOne({ where: { resumeId: id, cid } });
      return res.status(200).json({ resume: updatedResume });
    }
    throw new Error('Resume not found');
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

// Delete a resume
async function deleteResume(req, res) {
  const { id } = req.params;
  try {
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return generateResponse(res, 401, 'Unauthorized: User not authenticated');
    }

    const cid = req.user.id; // Get the cid from the decoded JWT payload

    // Check if the candidate exists
    const candidate = await Candidate.findOne({ where: { cid } });
    if (!candidate) {
      return generateResponse(res, 404, 'Candidate not found');
    }

    // Delete the resume by ID and CID
    const deleted = await Resume.destroy({
      where: { resumeId: id, cid }
    });
    if (deleted) {
      return res.status(204).send("Resume deleted successfully");
    }
    throw new Error("Resume not found");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

// Get all resumes
async function getAllResumes(req, res) {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return generateResponse(res, 401, 'Unauthorized: User not authenticated');
    }

    const cid = req.user.id; // Get the cid from the decoded JWT payload

    // Check if the candidate exists
    const candidate = await Candidate.findOne({ where: { cid } });
    if (!candidate) {
      return generateResponse(res, 404, 'Candidate not found');
    }

    // Find all resumes by CID
    const resumes = await Resume.findAll({
      where: { cid },
      include: [Education, Experience, Project, Certification]
    });
    res.status(200).json(resumes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get a single resume by ID
async function getResumeById(req, res) {
  const { id } = req.params;
  try {
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return generateResponse(res, 401, 'Unauthorized: User not authenticated');
    }

    const cid = req.user.id; // Get the cid from the decoded JWT payload

    // Check if the candidate exists
    const candidate = await Candidate.findOne({ where: { cid } });
    if (!candidate) {
      return generateResponse(res, 404, 'Candidate not found');
    }

    // Find the resume by ID and CID
    const resume = await Resume.findOne({
      where: { resumeId: id, cid },
      include: [Education, Experience, Project, Certification]
    });
    if (resume) {
      res.status(200).json(resume);
    } else {
      res.status(404).json({ message: 'Resume not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createResume,
  updateResume,
  deleteResume,
  getAllResumes,
  getResumeById
};