import express from 'express';
import { auth } from '../../middlewares/auth';
import {
    allTemplates,
    createTemplate,
    updateTemplate,
} from './controllers';
import staticSchemaValidation from '../../middlewares/staticSchemaValidation';
import { createTemplateSchema, } from './validations';

const router = express.Router();

router.post('/', staticSchemaValidation(createTemplateSchema), createTemplate);

router.put('/:templateId', staticSchemaValidation(createTemplateSchema), updateTemplate);

router.get('/all', allTemplates);



export default router;
