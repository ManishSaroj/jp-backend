const { Resume, Education, Experience } = require('../../models/ResumeModal');
const Candidate = require('../../models/CandidateModel')
// const { getCandidate } = require('./getCandidate');

const storeResume = async (req, res) => {
  try {
    const candidateId = req.user.id; // Extract user ID from the token
    const candidate = await Candidate.findByPk(candidateId);

    if (!candidate) {
        return res.status(404).json({ success: false, message: 'Candidate not found' });
    }
    
    const { name, workingAs, email, phone, linkedIn, gitHub, address, skills, education, experience } = req.body;

    const resume = await Resume.create({
      cid: candidateId,
      name,
      workingAs,
      email,
      phone,
      linkedIn,
      gitHub,
      address,
      skills,
    });

    await Education.bulkCreate(education.map(edu => ({ ...edu, resumeId: resume.resumeId })));
    await Experience.bulkCreate(experience.map(exp => ({ ...exp, resumeId: resume.resumeId })));

    res.status(201).json({ success: true, message: 'Resume stored successfully' });
  } catch (error) {
    console.error('Error storing resume:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const updateResume = async (req, res) => {
  try {
    const candidateId = req.user.id; // Extract user ID from the token
    const candidate = await Candidate.findByPk(candidateId);

    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    const resumeId = req.params.resumeId;
    const { name, workingAs, email, phone, linkedIn, gitHub, address, skills, education, experience } = req.body;

    await Resume.update(
      {
        name,
        workingAs,
        email,
        phone,
        linkedIn,
        gitHub,
        address,
        skills,
      },
      { where: { resumeId } }
    );

    await Education.destroy({ where: { resumeId } });
    await Experience.destroy({ where: { resumeId } });

    await Education.bulkCreate(education.map(edu => ({ ...edu, resumeId })));
    await Experience.bulkCreate(experience.map(exp => ({ ...exp, resumeId })));

    res.status(200).json({ success: true, message: 'Resume updated successfully' });
  } catch (error) {
    console.error('Error updating resume:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  storeResume,
  updateResume,
};
