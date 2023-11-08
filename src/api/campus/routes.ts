import express, { Response } from 'express';
import {
    fetchAllCampus,
    updateCampus,
    fetchCampus,
    createCampus,
    unlinkRep,
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
    auth,
    fetchAllCampus
);

router.put(
    '/update',
    auth,
    updateCampus
);

router.get(
    '/fetch',
    auth,
    fetchCampus
);

router.post(
    '/create',
    auth,
    createCampus
);

router.post(
    '/unlink',
    auth,
    unlinkRep,
);

export default router;
