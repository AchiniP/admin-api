import { DataTypes } from 'Sequelize';
import { CLASS_NAMES } from '../const/globalConstant';

module.exports = (sequelize) => {
  sequelize.define(CLASS_NAMES.CLASS_SUBJECT, {
    id : {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    classCode: {
      type: DataTypes.STRING,
      references: {
        model: CLASS_NAMES.CLASS_DATA,
        key: 'classCode'
      }
    },
    subjectCode: {
      type: DataTypes.STRING,
      references: {
        model: CLASS_NAMES.SUBJECT,
        key: 'subjectCode'
      }
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['classCode', 'subjectCode']
      }
    ],
    timestamps: false,
    tableName: CLASS_NAMES.CLASS_SUBJECT
  });
};

