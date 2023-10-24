import express from 'express';
import { auth } from '../../middlewares/auth';
import {
    createBump,
    deleteBumps,
    getAllBumps,
    updateBump,
    uploadBumpImage
} from './controllers';
import { upload } from '../../middlewares/uploadRoomFile';

const router = express.Router();

router.get("/all", getAllBumps);

router.post('/', createBump);

router.put("/", updateBump);

router.put("/file", upload.single('file'), uploadBumpImage);

router.put("/delete", deleteBumps);


export default router;
