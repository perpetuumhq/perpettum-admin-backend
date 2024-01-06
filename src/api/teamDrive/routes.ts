import express from 'express';
import { auth } from '../../middlewares/auth';
import {
    allFileAndFolder,
    create,
    deleteData,
    topicPublish,
    updateTopic,
    uploadTopicImage
} from './controllers';
import staticSchemaValidation from '../../middlewares/staticSchemaValidation';
import { createTopicSchema, updateTopicOrderSchema } from './validations';
import { upload } from '../../middlewares/uploadRoomFile';

const router = express.Router();

router.post('/folder', create);

router.post("/file", upload.single('file'), create);

// router.put('/:topicId', staticSchemaValidation(createTopicSchema), updateTopic);

router.delete('/:id', deleteData);

router.get('/all', allFileAndFolder);

// router.get('/publish/:topicId', topicPublish);


export default router;
