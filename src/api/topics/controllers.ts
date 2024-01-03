import { COL, STATUS_MSG } from '../../constants/const';
import { NextFunction, Response } from 'express';
import * as service from './service';
import manageOutput from '../../helpers/data_helpers/manageOutputData';
import { STORAGE_FOLDER, STORAGE_URL } from '../../config/config';
import queryArangoKVStore from '../../helpers/arango_helpers/queryArangoKVStore';


export const allTopics = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { arangodb } = req.app.locals;
        const { active, isParent } = req.query;
        const { data, count } = await service.allTopics(arangodb, active, isParent);

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

export const createTopic = async (req: any, res: Response, next: NextFunction): Promise<void> => {
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

export const updateTopic = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { arangodb } = req.app.locals;
        const { topicId } = req.params;
        const body = req.body;
        await service.updateTopic(arangodb, topicId, body);
        res.send({
            status: 200,
            data: 'Topic Updated!',
            message: STATUS_MSG.UPDATE
        });
    } catch (e) {
        next(e);
    }
};

export const deleteTopic = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { arangodb } = req.app.locals;
        const { topicId } = req.params;
        // await service.existsConnectionWithOthers(arangodb, topicId); // need to check, will do later
        await service.deleteTopic(arangodb, topicId);
        res.send({
            status: 200,
            data: 'Topic Deleted!',
            message: STATUS_MSG.DELETE
        });
    } catch (e) {
        next(e);
    }
};

export const topicPublish = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { arangodb } = req.app.locals;
        const { topicId } = req.params;
        const topic = await queryArangoKVStore.get(arangodb, COL.topics, topicId);
        if (!topic) {
            throw new Error('Topic not found!');
        }
        if (topic.isActive) {
            await service.updateTopic(arangodb, topicId, { isActive: false });
        } else {
            await service.updateTopic(arangodb, topicId, { isActive: true });
        }
        res.send({
            status: 200,
            data: 'Topic Published!',
            message: STATUS_MSG.UPDATE
        });
    } catch (e) {
        next(e);
    }
};

export const uploadTopicImage = async (
    req: any,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { db, admin } = req.app.locals;
        const { bumpId } = req.params;
        const imageUrl = `${STORAGE_URL}${STORAGE_FOLDER.room}/${req.file.filename}`;

        res.send({
            status: 200,
            data: imageUrl,
            message: STATUS_MSG.CREATE
        });
    } catch (e) {
        next(e);
    }
}