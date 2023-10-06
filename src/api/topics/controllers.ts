import { COL, STATUS_MSG } from '../../constants/const';
import { NextFunction, Response } from 'express';
import * as service from './service';
import manageOutput from '../../helpers/data_helpers/manageOutputData';


export const allTopics = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { arangodb } = req.app.locals;
        const { active } = req.query;
        const { data, count } = await service.allTopics(arangodb);

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
        // const topicRef = .collection(COL.topics).doc(topicId);
        // const topic = await topicRef.get();
        // if (!topic.exists) {
        //     throw new Error('Topic not found!');
        // }
        // // check this topic already been used in any sub topics or relatedTopics
        // const subTopics = await db
        //     .collection(COL.topics)
        //     .where('subs', 'array-contains', topicId)
        //     .get();
        // if (!subTopics.empty) {
        //     throw new Error('This topic is already used in sub topics! Remove Them First.');
        // }
        // const relatedTopics = await db
        //     .collection(COL.topics)
        //     .where('relatedTopics', 'array-contains', topicId)
        //     .get();
        // if (!relatedTopics.empty) {
        //     throw new Error('This topic is already used in related topics! Remove Them First.');
        // }
        // // this topic is used in prompts
        // const prompts = await db.collection(COL.prompts).where('topic', '==', topicId).get();
        // if (!prompts.empty) {
        //     throw new Error('This topic is already used in prompts! Delete Them First.');
        // }
        // await topicRef.delete();
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
        await service.updateTopic(arangodb, topicId, { isActive: true });
        res.send({
            status: 200,
            data: 'Topic Published!',
            message: STATUS_MSG.UPDATE
        });
    } catch (e) {
        next(e);
    }
};
