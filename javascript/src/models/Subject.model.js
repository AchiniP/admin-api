import { DataTypes } from 'Sequelize';
import { CLASS_NAMES } from '../const/globalConstant';

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
  sequelize.define(CLASS_NAMES.SUBJECT, {
    subjectCode: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    subjectName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  }, {
    timestamps: false,
    tableName: CLASS_NAMES.SUBJECT
  });
};
