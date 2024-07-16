// Define EmployerPackage model
const EmployerPackage = adminSequelize.define('EmployerPackage', {
    employerPackageId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    eid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    packageId: {
      type: DataTypes.INTEGER,
      references: {
        model: PackageModel,
        key: 'packageId',
      },
    },
    packageName: {
      type: DataTypes.ENUM('Free', 'Bronze', 'Silver', 'Platinum', 'Gold'),
      allowNull: false,
    },
    purchaseDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    expirationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    timestamps: false,
  });
  
  // Establish associations
  PackageModel.hasMany(EmployerPackage, { foreignKey: 'packageId' });
  EmployerPackage.belongsTo(PackageModel, { foreignKey: 'packageId' });
  
  module.exports = { PackageModel, EmployerPackage };