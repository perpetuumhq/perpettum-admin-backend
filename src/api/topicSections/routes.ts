import express from 'express';
import { allTopicSections, createTopicSection, updateTopicSection } from './controllers';
import staticSchemaValidation from '../../middlewares/staticSchemaValidation';
import { createTopicSectionSchema } from './validations';

const router = express.Router();

router.post('/', staticSchemaValidation(createTopicSectionSchema), createTopicSection);

router.put('/:topicId', staticSchemaValidation(createTopicSectionSchema), updateTopicSection);

router.get('/all', allTopicSections);


export default router;
