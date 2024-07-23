const { DataTypes } = require('sequelize');
const { adminSequelize } = require('../../config/db.config');

// Define the State model
const State = adminSequelize.define('State', {
  StateId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  StateName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  StateCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  Capital: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: false,
});

// Define the City model without CityCode
const City = adminSequelize.define('City', {
  CityId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  CityName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  StateId: {
    type: DataTypes.INTEGER,
    references: {
      model: State,
      key: 'StateId',
    },
    allowNull: false,
  },
}, {
  timestamps: false,
});

// Define relationships with cascading delete
State.hasMany(City, { 
  foreignKey: 'StateId',
  onDelete: 'CASCADE', // This will delete related cities when a state is deleted
});
City.belongsTo(State, { foreignKey: 'StateId' });

// Export the models
module.exports = { State, City };