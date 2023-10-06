import express from 'express';
import { auth } from '../../middlewares/auth';
import {
    allTopics,
    createTopic,
    deleteTopic,
    topicPublish,
    updateTopic
} from './controllers';
import staticSchemaValidation from '../../middlewares/staticSchemaValidation';
import { createTopicSchema, updateTopicOrderSchema } from './validations';

const router = express.Router();

router.post('/', staticSchemaValidation(createTopicSchema), createTopic);

router.put('/:topicId', staticSchemaValidation(createTopicSchema), updateTopic);

router.delete('/:topicId', deleteTopic);

router.get('/all', allTopics);

router.get('/publish/:topicId', topicPublish);

export default router;
