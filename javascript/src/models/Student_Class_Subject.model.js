import { DataTypes } from 'Sequelize';
import { CLASS_NAMES } from '../const/globalConstant';

module.exports = (sequelize) => {
  sequelize.define(CLASS_NAMES.STUDENT_CLASS_SUBJECT, {
    studentEmail: {
      type: DataTypes.STRING,
      references: {
        model: CLASS_NAMES.STUDENT,
        key: 'studentEmail'
      }
    },
    mappingId: {
      type: DataTypes.INTEGER,
      references: {
        model: CLASS_NAMES.CLASS_SUBJECT,
        key: 'id'
      }
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['studentEmail', 'mappingId']
      }
    ],
    timestamps: false,
    tableName: CLASS_NAMES.STUDENT_CLASS_SUBJECT
  });
};

