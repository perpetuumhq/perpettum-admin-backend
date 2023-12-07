import express from 'express';
import { allCampus, createCampus, updateCampus } from './controllers';
import staticSchemaValidation from '../../middlewares/staticSchemaValidation';
import { createTopicSectionSchema } from './validations';

const router = express.Router();

router.post('/', staticSchemaValidation(createTopicSectionSchema), createCampus);

router.put('/:campusId', staticSchemaValidation(createTopicSectionSchema), updateCampus);

router.get('/all', allCampus);


export default router;
