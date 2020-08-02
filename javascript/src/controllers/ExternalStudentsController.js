import Express from 'express';
import validation from 'express-joi-validation';
import Joi from 'joi';
import { OK } from 'http-status-codes';

import Logger from '../config/logger';
import APIConnecterRepository from '../repository/APIConnecterRepository';
const LOG = new Logger('ExternalStudentsController.js');


const ExternalStudentController = Express.Router();
const validator = validation.createValidator({ passError: true });

const FETCH_EXTERNAL_DATA_SCHEMA = Joi.object().keys({
  limit: Joi.number().required(),
  offset: Joi.number().required(),
});

const fetchExternalStudentInfo = async (req, res, next) => {
  const { classCode } = req.params;
  const { limit, offset } = req.query;
  LOG.info('[ROUTER][EXTERNAL]: request recieved for retrieve external student details', classCode, limit, offset)
  return APIConnecterRepository.fetchExternalStudentDetails(classCode, offset, limit)
    .then(result => res.status(OK).send({ offset, limit, ...result }))
    .catch(error => next(error))
}

ExternalStudentController.get('/class/:classCode/students', validator.query(FETCH_EXTERNAL_DATA_SCHEMA), fetchExternalStudentInfo);

export default ExternalStudentController;