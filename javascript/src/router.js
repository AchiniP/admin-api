import Express from 'express';
import DataImportController from './controllers/DataImportController';
import HealthcheckController from './controllers/HealthcheckController';
import ExternalStudentsController from './controllers/ExternalStudentsController';
import AdminController from './controllers/AdminController';

const router = Express.Router();

router.use('/', DataImportController);
router.use('/', HealthcheckController);
router.use('/', ExternalStudentsController);
router.use('/', AdminController);

export default router;
