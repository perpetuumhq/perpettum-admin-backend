import express from 'express';
import { auth } from '../../middlewares/auth';
import {
    createBump,
    uploadBumpImage
} from './controllers';
import { upload } from '../../middlewares/uploadRoomFile';

const router = express.Router();

router.post('/', createBump);

router.put("/file", upload.single('file'), uploadBumpImage);


export default router;
