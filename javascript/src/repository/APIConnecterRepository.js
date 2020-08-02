
import axios from 'axios';
import Logger from '../config/logger';
import ErrorBase from '../errors/ErrorBase';
import ErrorCodes from '../const/ErrorCodes';
import ErrorMessages from '../const/ErrorMessages';

const LOG = new Logger('DataImportController.js');

const { EXTERNAL_API } = process.env

const fetchExternalStudentDetails = async (classCode, offset, limit) => {
  LOG.info('[REPOSITORY][EXTERNAL] Fetch external student info using external api');
  const REQ_OBJ = {
    method: 'GET',
    url: `${EXTERNAL_API}students`,
    params: { class: classCode, offset, limit }
  };
  LOG.info('[REPOSITORY][EXTERNAL] Fetch external student info req: ', JSON.stringify(REQ_OBJ));
  const result = await axios(REQ_OBJ).then(resp => resp.data).catch(error => {
    LOG.error('[REPOSITORY][EXTERNAL] Error occurred when fetching extrenal student info ', error);
    throw new ErrorBase(ErrorMessages.ERROR_OCCURRED_WHEN_FETCHING_DATA_FROM_EXTERNAL, ErrorCodes.ERROR_OCCURRED_WHEN_FETCHING_DATA_FROM_EXTERNAL);
  });
  return result;
}


export default {
  fetchExternalStudentDetails,
};