import { STATUS_MSG } from '../../constants/const';
import { NextFunction, Response } from 'express';
import * as service from './service';
import manageOutput from '../../helpers/data_helpers/manageOutputData';


export const allTemplates = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { arangodb } = req.app.locals;
        const { data, count } = await service.allTemplates(arangodb);

        res.send({
            status: 200,
            data: manageOutput(data),
            count: count,
            message: STATUS_MSG.FIND
        });
    } catch (e) {
        next(e);
    }
};

export const createTemplate = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { arangodb } = req.app.locals;
        const { name, description, relatedTopics, subs } = req.body;

        const topicBody = {
            name,
            ...(description ? { description } : {}),
            isActive: false,
            relatedTopics: relatedTopics?.length ? relatedTopics : [],
            subs: subs?.length ? subs : []
        };
        await service.createTopic(arangodb, topicBody);
        res.send({
            status: 200,
            data: 'New Topic Created!',
            message: STATUS_MSG.CREATE
        });
    } catch (e) {
        next(e);
    }
};

export const updateTemplate = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { arangodb } = req.app.locals;
        const { templateId } = req.params;
        const body = req.body;
        await service.updateTopic(arangodb, templateId, body);
        res.send({
            status: 200,
            data: 'Topic Updated!',
            message: STATUS_MSG.UPDATE
        });
    } catch (e) {
        next(e);
    }
};