import { COL, STATUS_MSG } from '../../constants/const';
import { NextFunction, Response } from 'express';
import { fetchCampusService, fetchAllCampusService, updateCampusService, createCampusService, removeRep } from './service'


export const updateCampus = async (
    req: any,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { arangodb } = req.app.locals;
        const userId = req.user.id;
        const body = req.body;
        body["updatedBy"]= userId
        const campusCreated = await updateCampusService(arangodb,body);
        if (!campusCreated) throw new Error('Something Went Wrong!');
        res.send({
            status: 200,
            message: STATUS_MSG.CREATE
        });
    } catch (e) {
        next(e);
    }
};

export const fetchCampus = async (
    req: any,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { arangodb } = req.app.locals;
        const { campusId} = req.query;

        const campusData = await fetchCampusService(arangodb, campusId);

        res.send({
            status: 200,
            data: campusData,
            message: STATUS_MSG.FIND_ONE
        });
    } catch (e) {
        next(e);
    }
};

export const createCampus = async (
    req: any,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { arangodb } = req.app.locals;
        const userId = req.user.id;
        const body = req.body;
        body["createdBy"]= userId
        const campusCreated = await createCampusService(arangodb,body);
        if (!campusCreated) throw new Error('Something Went Wrong!');
        res.send({
            status: 200,
            message: STATUS_MSG.CREATE
        });
    } catch (e) {
        next(e);
    }
};

export const fetchAllCampus = async (
    req: any,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { arangodb } = req.app.locals;
        const prevPage = req.query.prevPage !== undefined ? req.query.prevPage : 0;
        const limit = Number(req.query.limit) || 10;

        const campusData = await fetchAllCampusService(arangodb, prevPage,limit);

        res.send({
            status: 200,
            data: campusData,
            message: STATUS_MSG.FIND_ONE
        });
    } catch (e) {
        next(e);
    }
};

export const unlinkRep = async (
    req: any,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { arangodb } = req.app.locals;
        const { repId } = req.body;
        await removeRep(arangodb, repId);

        res.send({
            status: 200,
            message: STATUS_MSG.DELETE
        });
    } catch (e) {
        next(e);
    }
};