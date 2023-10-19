import express from 'express';
import { auth } from '../../middlewares/auth';
import {
    allTopics,
    createTopic,
    deleteTopic,
    topicPublish,
    updateTopic,
    uploadTopicImage
} from './controllers';
import staticSchemaValidation from '../../middlewares/staticSchemaValidation';
import { createTopicSchema, updateTopicOrderSchema } from './validations';
import { upload } from '../../middlewares/uploadRoomFile';

const router = express.Router();

router.post('/', staticSchemaValidation(createTopicSchema), createTopic);

router.put("/file", upload.single('file'), uploadTopicImage);

router.put('/:topicId', staticSchemaValidation(createTopicSchema), updateTopic);

router.delete('/:topicId', deleteTopic);

router.get('/all', allTopics);

router.get('/publish/:topicId', topicPublish);


export default router;
