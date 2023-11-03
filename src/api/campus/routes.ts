import express, { Response } from 'express';
import {
    fetchAllCampus,
    updateCampus,
    fetchCampus,
    createCampus
} from './controllers';
import staticSchemaValidation from '../../middlewares/staticSchemaValidation';
import {
    phoneOtpSchema,
    phoneOtpVerificationSchema,
    grantAccessVerificationSchema
} from './validations';
import { auth } from '../../middlewares/auth';

const router = express.Router();

router.get(
    '/fetch-all',
    fetchAllCampus
);

router.put(
    '/update',
    updateCampus
);

router.get(
    '/fetch',
    fetchCampus
);

router.post(
    '/create',
    createCampus
);
export default router;
