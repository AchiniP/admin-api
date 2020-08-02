import { DataTypes } from 'Sequelize';
import { CLASS_NAMES, EMAIL_VALIDATION_REGEX } from '../const/globalConstant';

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
  sequelize.define(CLASS_NAMES.TEACHER, {
    teacherEmail: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.STRING,
      validate: {
        //email validation
        is: EMAIL_VALIDATION_REGEX
      }
    },
    teacherName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  }, {
    timestamps: false,
    tableName: CLASS_NAMES.TEACHER
  });
};
