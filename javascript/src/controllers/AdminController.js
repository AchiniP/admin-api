import Express from 'express';
import _ from 'lodash';
import validation from 'express-joi-validation';
import Joi from 'joi';
import { NO_CONTENT, OK } from 'http-status-codes';
import Logger from '../config/logger';
import DBConnecterRepository from '../repository/DBConnecterRepository';
import { CLASS_NAMES } from '../const/globalConstant';


const AdminController = Express.Router();
const LOG = new Logger('AdminController.js');
const validator = validation.createValidator({ passError: true });
const UPDATE_CLASS_SCHEMA = Joi.object().keys({
  className: Joi.string().required(),
});

export const getClassCount = (teacherArr, subjectcode) => _.chain(teacherArr)
  .filter(teacherObj => teacherObj.subjectcode === subjectcode)
  .map(filterdObj => filterdObj.classcode)
  .uniq().value();

export const processTeacherData = async () => {
  LOG.info('[SERVICE][ADMIN]: request recieved for retrieve teacher details'); 
  const teacherDetails = await DBConnecterRepository.fetchTeacherDetails();
  
  const teacherByName =  _.groupBy(teacherDetails, 'teacheremail');
  const teacherBySubject = Object.values(teacherByName).reduce((result , teacherArr) => {
    const teacherName = _.last(teacherArr).teachername;
    const subjects = _.chain(teacherArr)
      .map(data => (
        { 
          subjectCode: data.subjectcode, 
          subjectname: data.subjectname, 
          numberOfClasses:  (_.isNil(data.subjectcode)) ? 0:
            getClassCount(teacherArr, data.subjectcode).length
        }))
      .uniqWith(_.isEqual).value();
    result[teacherName] = subjects;
    return result;
  }, {});
  return teacherBySubject
}

const updateClass = async (req, res, next) => {
  const { classCode } = req.params;
  const { className } = req.body;
  LOG.info(`[ROUTER][ADMIN]: request recieved for update className as ${classCode} for ${className}`);
  return DBConnecterRepository.updateByCondition(CLASS_NAMES.CLASS_DATA, { className: className }, {classCode})
    .then(() => res.status(NO_CONTENT).send())
    .catch(error => next(error));
}

const fetchTeacherDetails = async (req, res, next) => {
  LOG.info('[ROUTER][ADMIN]: request recieved for retrieve teacher details');
  return processTeacherData()
    .then(result => res.status(OK).send(result))
    .catch(error => {
      LOG.error('[ROUTER][ADMIN]: error occurred while retrieving data', error);
      return next(error)
    })
}

AdminController.put('/class/:classCode', validator.body(UPDATE_CLASS_SCHEMA), updateClass);
AdminController.get('/reports/workload', fetchTeacherDetails);

export default AdminController;