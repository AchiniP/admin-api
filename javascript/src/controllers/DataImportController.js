import Express from 'express';
import _ from 'lodash';
import { NO_CONTENT, BAD_REQUEST } from 'http-status-codes';
import Logger from '../config/logger';
import upload from '../config/multer';
import { convertCsvToJson } from '../utils';
import DBConnecterRepository from '../repository/DBConnecterRepository';
import  { CLASS_NAMES } from '../const/globalConstant'
import ErrorBase from '../errors/ErrorBase';
import ErrorCodes from '../const/ErrorCodes';
import ErrorMessages from '../const/ErrorMessages';

const DataImportController = Express.Router();
const LOG = new Logger('DataImportController.js');


export const generateReferenceData = async (records, classSubjectDataMap) => {
  const classSubjectData = _.uniqWith(classSubjectDataMap, 
    (x, y) => x.classCode === y.classCode && x.subjectCode === y.subjectCode);
  await DBConnecterRepository.bulkInsertData(CLASS_NAMES.CLASS_SUBJECT, classSubjectData, ['classCode', 'subjectCode']);

  const teacherClassSubjectMap = [];
  const studentClassSubjectMap = [];
  const deleteTeacherClassSubjectMap = [];
  const clsData = await DBConnecterRepository.findAll(CLASS_NAMES.CLASS_SUBJECT);

  records.map((data) => {
    const { classCode, subjectCode, teacherEmail, studentEmail, toDelete } = data;
    const classSubjectRecord = clsData.find(data => data.classCode === classCode && data.subjectCode === subjectCode);
    const mappingId = classSubjectRecord.id;
    // await DBConnecterRepository.findByCondition(CLASS_NAMES.CLASS_SUBJECT, { classCode, subjectCode});
    (toDelete == 1) ? deleteTeacherClassSubjectMap.push({ teacherEmail, mappingId}) : teacherClassSubjectMap.push( { teacherEmail, mappingId})
    studentClassSubjectMap.push( { studentEmail, mappingId })
  });

  await DBConnecterRepository.bulkInsertData(CLASS_NAMES.TEACHER_CLASS_SUBJECT, teacherClassSubjectMap, ['teacherEmail', 'mappingId']);
  await DBConnecterRepository.bulkDeleteData(CLASS_NAMES.TEACHER_CLASS_SUBJECT, deleteTeacherClassSubjectMap);
  await DBConnecterRepository.bulkInsertData(CLASS_NAMES.STUDENT_CLASS_SUBJECT, studentClassSubjectMap, ['studentEmail', 'mappingId']);
  return  { teacherClassSubjectMap, deleteTeacherClassSubjectMap, studentClassSubjectMap }
};


export const parseData =  (records) => {
  const teacherDataMap = [];
  const studentDataMap = [];
  const subjectDataMap = [];
  const classDataMap = [];
  const classSubjectDataMap = [];
  
  records.map((data) => {
    const { teacherEmail, teacherName, studentName, studentEmail, subjectCode, subjectName, classCode, classname } = data;
    teacherDataMap.push({ teacherEmail, teacherName });
    studentDataMap.push({ studentEmail, studentName });
    subjectDataMap.push({ subjectCode, subjectName });
    classDataMap.push({ classCode, className: classname });
    classSubjectDataMap.push({classCode, subjectCode});
  });

  return { teacherDataMap, studentDataMap, subjectDataMap, classDataMap, classSubjectDataMap };
}

// TODO: Please implement Question 1 requirement here
export const dataImportHandler = async (req, res, next) => {
  const { file } = req;

  try {
    const data = await convertCsvToJson(file.path);
    LOG.debug(JSON.stringify(data), null, 2);

    if(_.isEmpty(data)) {
      throw new ErrorBase(ErrorMessages.INVALID_EXEL, ErrorCodes.MALFORMED_JSON_ERROR_CODE, BAD_REQUEST);
    }
    const { teacherDataMap, studentDataMap, subjectDataMap, classDataMap, classSubjectDataMap } =  parseData(data);
    await DBConnecterRepository.bulkInsertData(CLASS_NAMES.TEACHER, teacherDataMap, ['teacherEmail', 'teacherName']);
    await DBConnecterRepository.bulkInsertData(CLASS_NAMES.STUDENT, studentDataMap, ['studentEmail', 'studentName']);
    await DBConnecterRepository.bulkInsertData(CLASS_NAMES.CLASS_DATA, classDataMap, ['className']);
    await DBConnecterRepository.bulkInsertData(CLASS_NAMES.SUBJECT, subjectDataMap, ['subjectName']);
    await generateReferenceData(data, classSubjectDataMap);
  } catch (err) {
    LOG.error(err)
    return next(err);
  }
  return res.sendStatus(NO_CONTENT);
}

DataImportController.post('/upload', upload.single('data'), dataImportHandler);

export default DataImportController;
