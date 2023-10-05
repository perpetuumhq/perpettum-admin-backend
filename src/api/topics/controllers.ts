import { COL, STATUS_MSG } from '../../constants/const';
import { NextFunction, Response } from 'express';
import autoId from '../../helpers/generateAutoid';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../../config/config';
import sendSMSforOTP from '../../helpers/sendSMS';

export const allActiveTopics = async (
    req: any,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { db } = req.app.locals;
        const topics = await db.collection(COL.topics).where('isActive', '==', true).get();
        const data: any = [];
        topics.forEach((topic: any) => {
            data.push(topic.data());
        });
        res.send({
            status: 200,
            data,
            message: STATUS_MSG.FIND
        });
    } catch (e) {
        next(e);
    }
};

export const updateTopicOrder = async (
    req: any,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { db } = req.app.locals;
        const { topics } = req.body;
        const { user } = req;
        const userData = {
            topics: topics
        };
        await db.collection(COL.userData).doc(user.id).set(userData);

        // update user data a key
        await db.collection(COL.users).doc(user.id).update({
            isTopicsOrdered: true
        });
        res.send({
            status: 200,
            message: STATUS_MSG.UPDATE
        });
    } catch (e) {
        next(e);
    }
};

export const allTopics = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { db } = req.app.locals;
        const { active } = req.query;
        // i want when active is true then only active topics will be shown
        // and when active is false then only inactive topics will be shown
        const topics = await db.collection(COL.topics).orderBy('isActive', 'desc').get();
        const data: any = [];
        const activeData: any = [];
        topics.forEach((topic: any) => {
            // check if active is true then only show active topics
            if (active === 'true' && topic.data().isActive) {
                activeData.push(topic.data());
            }
            data.push(topic.data());
        });
        // want to add pagination here

        res.send({
            status: 200,
            data: active === true ? activeData : data,
            message: STATUS_MSG.FIND
        });
    } catch (e) {
        next(e);
    }
};

export const createTopic = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { db } = req.app.locals;
        const { name, description, relatedTopics, subs } = req.body;
        const topicId = autoId();
        const topicData = {
            id: topicId,
            name,
            ...(description ? { description } : {}),
            isActive: false,
            relatedTopics: relatedTopics?.length ? relatedTopics : [],
            subs: subs?.length ? subs : []
        };
        await db.collection(COL.topics).doc(topicId).set(topicData);
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
        const { db } = req.app.locals;
        const { topicId } = req.params;
        const { name, description, relatedTopics, subs } = req.body;
        const topicRef = db.collection(COL.topics).doc(topicId);
        const topic = await topicRef.get();
        if (!topic.exists) {
            throw new Error('Topic not found!');
        }
        const topicData = {
            name,
            ...(description ? { description } : {}),
            relatedTopics: relatedTopics?.length ? relatedTopics : [],
            subs: subs?.length ? subs : []
        };
        await topicRef.update(topicData);
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
        const { db } = req.app.locals;
        const { topicId } = req.params;
        const topicRef = db.collection(COL.topics).doc(topicId);
        const topic = await topicRef.get();
        if (!topic.exists) {
            throw new Error('Topic not found!');
        }
        // check this topic already been used in any sub topics or relatedTopics
        const subTopics = await db
            .collection(COL.topics)
            .where('subs', 'array-contains', topicId)
            .get();
        if (!subTopics.empty) {
            throw new Error('This topic is already used in sub topics! Remove Them First.');
        }
        const relatedTopics = await db
            .collection(COL.topics)
            .where('relatedTopics', 'array-contains', topicId)
            .get();
        if (!relatedTopics.empty) {
            throw new Error('This topic is already used in related topics! Remove Them First.');
        }
        // this topic is used in prompts
        const prompts = await db.collection(COL.prompts).where('topic', '==', topicId).get();
        if (!prompts.empty) {
            throw new Error('This topic is already used in prompts! Delete Them First.');
        }
        await topicRef.delete();
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
        const { db } = req.app.locals;
        const { topicId } = req.params;
        const topicRef = db.collection(COL.topics).doc(topicId);
        const topic = await topicRef.get();
        if (!topic.exists) {
            throw new Error('Topic not found!');
        }
        await topicRef.update({ isActive: true });
        res.send({
            status: 200,
            data: 'Topic Published!',
            message: STATUS_MSG.UPDATE
        });
    } catch (e) {
        next(e);
    }
};
