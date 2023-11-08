import express from 'express';
import { auth } from '../../middlewares/auth';
import {
    createBump,
    deleteBumps,
    getAllBumps,
    getMyBumps,
    updateBump,
    uploadBumpImage,
    fetchCampus,
    bumpStatus,
    repCreatedBumps
} from './controllers';
import { upload } from '../../middlewares/uploadRoomFile';

const router = express.Router();

router.get("/all", getAllBumps);

router.post('/', createBump);

router.put("/", updateBump);

router.put("/file", upload.single('file'), uploadBumpImage);

router.put("/delete", deleteBumps);

router.get("/fetch-campus", auth, fetchCampus);

router.get("/my-bumps",  auth,getMyBumps);

router.get("/rep-bumps", repCreatedBumps);

router.put("/bump-status", bumpStatus);

export default router;
