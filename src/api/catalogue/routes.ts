import express from 'express';
import { auth } from '../../middlewares/auth';
import {
    createCatalogues,
    fetchCatalogues,
    updateCatalogues
} from './controllers';

const router = express.Router();

router.get("/fetch-catalogue", fetchCatalogues);

router.post("create-catalogue", createCatalogues)

router.put("update-catalogue", updateCatalogues)
export default router;
