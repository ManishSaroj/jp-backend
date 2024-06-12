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

    // Check if the candidate already has a resume
    const existingResume = await Resume.findOne({ where: { cid } });
    if (existingResume) {
      // Update the existing resume instead of creating a new one
      await updateResume({ ...req, params: { id: existingResume.resumeId } }, res);
      return;
    }

    // Add CID and isSaved to the request body before creating the resume
    req.body.cid = cid;
    req.body.isSaved = req.body.isSaved || false; // Default to false if not provided

    // Create the resume
    const resume = await Resume.create(req.body);

    // Create associated models
    if (req.body.education) {
      await Promise.all(req.body.education.map(edu => Education.create({ ...edu, resumeId: resume.resumeId, cid })));
    }

    if (req.body.experience) {
      await Promise.all(req.body.experience.map(exp => Experience.create({ ...exp, resumeId: resume.resumeId, cid })));
    }

    if (req.body.projects) {
      await Promise.all(req.body.projects.map(proj => Project.create({ ...proj, resumeId: resume.resumeId, cid })));
    }

    if (req.body.certifications) {
      await Promise.all(req.body.certifications.map(cert => Certification.create({ ...cert, resumeId: resume.resumeId, cid })));
    }

    const createdResume = await Resume.findOne({
      where: { resumeId: resume.resumeId },
      include: [Education, Experience, Project, Certification]
    });

    res.status(201).json(createdResume);
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

    // Find the resume by ID
    const resume = await Resume.findOne({ where: { resumeId: id } });
    if (!resume) {
      return generateResponse(res, 404, 'Resume not found');
    }

    // Check if the resume belongs to the candidate
    if (resume.cid !== cid) {
      return generateResponse(res, 403, 'You are not authorized to update this resume');
    }

    // Update the resume
    await resume.update(req.body);

    // Update associated models
    if (req.body.education) {
      await Education.destroy({ where: { resumeId: resume.resumeId } }); // Remove existing education records
      await Promise.all(req.body.education.map(edu => Education.create({ ...edu, resumeId: resume.resumeId, cid })));
    }

    if (req.body.experience) {
      await Experience.destroy({ where: { resumeId: resume.resumeId } }); // Remove existing experience records
      await Promise.all(req.body.experience.map(exp => Experience.create({ ...exp, resumeId: resume.resumeId, cid })));
    }

    if (req.body.projects) {
      await Project.destroy({ where: { resumeId: resume.resumeId } }); // Remove existing project records
      await Promise.all(req.body.projects.map(proj => Project.create({ ...proj, resumeId: resume.resumeId, cid })));
    }

    if (req.body.certifications) {
      await Certification.destroy({ where: { resumeId: resume.resumeId } }); // Remove existing certification records
      await Promise.all(req.body.certifications.map(cert => Certification.create({ ...cert, resumeId: resume.resumeId, cid })));
    }

    const updatedResume = await Resume.findOne({
      where: { resumeId: resume.resumeId },
      include: [Education, Experience, Project, Certification]
    });
    return res.status(200).json({ resume: updatedResume });
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

async function getResumeByCandidateId(req, res) {
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

    // Find the resume by CID
    const resume = await Resume.findOne({
      where: { cid },
      include: [Education, Experience, Project, Certification]
    });
    if (resume) {
      res.status(200).json(resume);
    } else {
      res.status(404).json({ message: 'Resume not found for the candidate' });
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
  getResumeById,
  getResumeByCandidateId
};
