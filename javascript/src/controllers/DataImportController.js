import Express from 'express';
import { NO_CONTENT } from 'http-status-codes';
import Logger from '../config/logger';
import upload from '../config/multer';
import { convertCsvToJson } from '../utils';

const DataImportController = Express.Router();
const LOG = new Logger('DataImportController.js');

// TODO: Please implement Question 1 requirement here
const dataImportHandler = async (req, res, next) => {
  const { file } = req;

  try {
    const data = await convertCsvToJson(file.path);
    LOG.info(JSON.stringify(data, null, 2));

  } catch (err) {
    LOG.error(err)
    return next(err);
  }

  return res.sendStatus(NO_CONTENT);
}

DataImportController.post('/upload', upload.single('data'), dataImportHandler);

export default DataImportController;
