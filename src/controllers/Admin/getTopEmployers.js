const { Op, Sequelize } = require('sequelize');
const Employer = require('../../models/Employer/EmployerModel');
const EmployerProfile = require('../../models/Employer/EmployerProfile');
const EmployerJobPost = require('../../models/Employer/EmployerJobPost');

const getTopEmployers = async (req, res) => {
  try {
    const { pincode } = req.query;

    const findEmployers = async (where, limit) => {
      return EmployerProfile.findAll({
        attributes: [
          'eid',
          'profileId',
          'company_logo',
          'company_name',
          'city',
          'state',
          'pincode',
          [Sequelize.fn('COUNT', Sequelize.col('Employer.EmployerJobPosts.jobpostId')), 'totalJobs'],
          [Sequelize.fn('SUM',
            Sequelize.literal('CASE WHEN `Employer->EmployerJobPosts`.`isActive` = 1 THEN 1 ELSE 0 END')
          ), 'activeJobsCount']
        ],
        include: [{
          model: Employer,
          attributes: [],
          include: [{
            model: EmployerJobPost,
            attributes: [],
          }]
        }],
        where: {
          ...where,
          pincode: {
            [Op.and]: [
              { [Op.ne]: null },
              { [Op.ne]: '' }
            ]
          }
        },
        group: [
          'EmployerProfile.eid',
          'EmployerProfile.profileId',
          'EmployerProfile.company_logo',
          'EmployerProfile.company_name',
          'EmployerProfile.city',
          'EmployerProfile.state',
          'EmployerProfile.pincode'
        ],
        order: [[Sequelize.literal('totalJobs'), 'DESC']],
        limit,
        subQuery: false,
      });
    };

    let pincodeEmployers = [];
    let otherEmployers = [];

    if (pincode) {
      pincodeEmployers = await findEmployers({ pincode }, 15);
      if (pincodeEmployers.length < 15) {
        const remainingLimit = 15 - pincodeEmployers.length;
        otherEmployers = await findEmployers({
          pincode: { [Op.ne]: pincode }
        }, remainingLimit);
      }
    } else {
      otherEmployers = await findEmployers({}, 15);
    }

    const topEmployers = [...pincodeEmployers, ...otherEmployers];

    // Format the result and convert company_logo to base64
    const formattedResult = topEmployers.map(employer => {
      const employerData = employer.toJSON();
      return {
        eid: employerData.eid,
        profileId: employerData.profileId,
        company_logo: employerData.company_logo ? employerData.company_logo.toString('base64') : null,
        company_name: employerData.company_name,
        city: employerData.city,
        state: employerData.state,
        pincode: employerData.pincode,
        activeJobsCount: parseInt(employerData.activeJobsCount, 10),
        totalJobs: parseInt(employerData.totalJobs, 10)
      };
    });

    res.status(200).json(formattedResult);
  } catch (error) {
    console.error('Error fetching top employers:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = {
  getTopEmployers,
};