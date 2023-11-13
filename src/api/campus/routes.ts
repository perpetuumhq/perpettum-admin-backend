import express, { Response } from 'express';
import {
    fetchAllCampus,
    updateCampus,
    fetchCampus,
    createCampus,
    unlinkRep,
} from './controllers';

import { adminAuth } from '../../middlewares/auth';

const router = express.Router();

router.get(
    '/fetch-all',
    adminAuth,
    fetchAllCampus
);

router.put(
    '/update',
    adminAuth,
    updateCampus
);

router.get(
    '/fetch',
    adminAuth,
    fetchCampus
);

router.post(
    '/create',
    adminAuth,
    createCampus
);

router.post(
    '/unlink',
    adminAuth,
    unlinkRep,
);

export default router;
