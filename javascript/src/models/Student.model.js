import { DataTypes } from 'Sequelize';
import { CLASS_NAMES, EMAIL_VALIDATION_REGEX } from '../const/globalConstant';

// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
  sequelize.define(CLASS_NAMES.STUDENT, {
    studentEmail: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.STRING,
      validate: {
        is: EMAIL_VALIDATION_REGEX

      }
    },
    studentName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  }, {
    timestamps: false,
    tableName: CLASS_NAMES.STUDENT
  });
};
