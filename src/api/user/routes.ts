import express, { Response } from 'express';
import {
    generatePhoneOtp,
    verifyPhoneOtp,
    grantAccess
} from './controllers';
import staticSchemaValidation from '../../middlewares/staticSchemaValidation';
import {
    phoneOtpSchema,
    phoneOtpVerificationSchema,
    grantAccessVerificationSchema
} from './validations';
import { auth } from '../../middlewares/auth';

const router = express.Router();

router.post('/generate-phone-otp', staticSchemaValidation(phoneOtpSchema), generatePhoneOtp);

router.post(
    '/phone-otp-verification',
    staticSchemaValidation(phoneOtpVerificationSchema),
    verifyPhoneOtp
);

router.post(
    '/grant-access',
    staticSchemaValidation(grantAccessVerificationSchema),
    auth,
    grantAccess
);

export default router;
