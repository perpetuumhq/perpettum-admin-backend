import express from 'express';
import { auth } from '../../middlewares/auth';
import {
    createBump,
    deleteBumps,
    getAllBumps,
    updateBump,
    uploadBumpImage,
    fetchCampus
} from './controllers';
import { upload } from '../../middlewares/uploadRoomFile';

const router = express.Router();

router.get("/all", getAllBumps);

router.post('/', createBump);

router.put("/", updateBump);

router.put("/file", upload.single('file'), uploadBumpImage);

router.put("/delete", deleteBumps);

router.get("/fetch-campus", fetchCampus);

export default router;
