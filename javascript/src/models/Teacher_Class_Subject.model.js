import { DataTypes } from 'Sequelize';
import { CLASS_NAMES } from '../const/globalConstant';

module.exports = (sequelize) => {
  sequelize.define(CLASS_NAMES.TEACHER_CLASS_SUBJECT, {
    teacherEmail: {
      type: DataTypes.STRING,
      references: {
        model: CLASS_NAMES.TEACHER,
        key: 'teacherEmail'
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
        fields: ['teacherEmail', 'mappingId']
      }
    ],
    timestamps: false,
    tableName: CLASS_NAMES.TEACHER_CLASS_SUBJECT
  });
};

