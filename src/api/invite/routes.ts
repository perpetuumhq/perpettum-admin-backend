import express from 'express';
import { auth } from '../../middlewares/auth';
import staticSchemaValidation from '../../middlewares/staticSchemaValidation';
import { upload } from '../../middlewares/uploadAudioFile';
import { allInviteCode, inviteCodeCheck, joinWaitlist, myInvite } from './controllers';

const router = express.Router();

router.get('/all', allInviteCode)

router.get('/my-invite', auth, myInvite);

router.get('/join-waitlist', auth, joinWaitlist);

router.post('/', auth, inviteCodeCheck);

export default router;
