
import { BAD_REQUEST } from 'http-status-codes';
import sequelize from '../config/database';
import { FETCH_ALL_TEACHER_DATA } from './Query';
import Logger from '../config/logger';
import ErrorBase from '../errors/ErrorBase';
import ErrorCodes from '../const/ErrorCodes';
import ErrorMessages from '../const/ErrorMessages';

const LOG = new Logger('DBConnecterRepository.js');

const bulkInsertData = async (model, insertData, updateOnDuplicate = false) => {
  LOG.info('[REPOSITORY] Going to insert bulk data to ', model);
  const modelToConnect = sequelize.models[model];
  try {
    updateOnDuplicate ? await modelToConnect.bulkCreate(insertData, { updateOnDuplicate: updateOnDuplicate }) 
      :
      await modelToConnect.bulkCreate(insertData);
  }
  catch (error) {
    LOG.error(`[REPOSITORY] Error occurred in inserting details for ${model}`, error);
    throw new ErrorBase(ErrorMessages.BULK_INSERT_ERROR, ErrorCodes.DB_ERROR, BAD_REQUEST);
  }
 
}

const findByCondition = async (model,  condition) => {
  LOG.info(`[REPOSITORY] Going to search data from ${model} on ${condition}`);
  const modelToConnect = sequelize.models[model];
  try {
    const record = await modelToConnect.findOne({ where: condition });
    return record;
  } catch(error) {
    LOG.error(`[REPOSITORY] Error occurred in fetch details from ${model}`, error);
    throw new ErrorBase(ErrorCodes.DB_ERROR, ErrorMessages.DB_ERROR, BAD_REQUEST);
  }
}

const updateByCondition = async (model, column, condition) => {
  LOG.info(`[REPOSITORY] Going to update data in ${model} on ${JSON.stringify(column)}`);
  const modelToConnect = sequelize.models[model];
  const record = await modelToConnect.update(column, { where: condition });
  return record;
}

const findAll = async (model) => {
  LOG.info(`[REPOSITORY] Going to fetch all data from ${model}`);
  const modelToConnect = sequelize.models[model];
  try {
    const data = await modelToConnect.findAll();
    return data;
  } catch (error) {
    LOG.error(`[REPOSITORY] Error occurred in fetch all details from ${model}`, error);
    throw new ErrorBase(ErrorCodes.DB_ERROR, ErrorMessages.DB_ERROR, BAD_REQUEST);
  }

}

const bulkDeleteData = async (model, deleteData) => {
  LOG.info(`[REPOSITORY] Going to bulk delete data from ${model}`);
  await deleteData.forEach(async (row) => {
    const rowToDelete = await findByCondition(model, row);
    if(rowToDelete) {
      rowToDelete.destroy();
    } else {
      LOG.info(`[REPOSITORY] Record Not found for deletion: ${row}`);
    }
  })
}
  
const fetchTeacherDetails = async () => {
  LOG.info('[REPOSITORY] Going to fetch all teacher details');
  try { 
    const teacherDetails = await sequelize.query(FETCH_ALL_TEACHER_DATA,
      { replacements: {}, type: sequelize.QueryTypes.SELECT });
    return teacherDetails;
  } catch (error) {
    LOG.error('[REPOSITORY] Error occurred in fetch all teacher details', error);
    throw new ErrorBase(ErrorCodes.DB_ERROR, ErrorMessages.DB_ERROR, BAD_REQUEST);
  }
}

export default {
  bulkInsertData,
  findByCondition,
  bulkDeleteData,
  findAll,
  updateByCondition,
  fetchTeacherDetails,
};