import { COL, INFO_META, STATUS_MSG, BUMP_STATUS, BUMP_APPROVAL } from '../../constants/const';
import { NextFunction, Response } from 'express';
import autoId from '../../helpers/generateAutoid';
import { STORAGE_FOLDER, STORAGE_URL } from '../../config/config';
import * as service from './service';
import manageOutput from '../../helpers/data_helpers/manageOutputData';
import localToUTC from '../../helpers/timeZone_helper/localToUTC';

export const getAllBumps = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { arangodb } = req.app.locals;
        const prevPage = req.query.prevPage !== undefined ? req.query.prevPage : 0;
        const limit = Number(req.query.limit) || 10;
        const { data } = await service.allBumps(arangodb, prevPage, limit);

        res.send({
            status: 200,
            data: manageOutput(data),
            message: STATUS_MSG.FIND
        });
    } catch (e) {
        next(e);
    }
}

export const getMyBumps = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { arangodb } = req.app.locals;
        let bumpState: string | undefined = req.query.bumpState;
        const action = bumpState ? bumpState.toUpperCase() as BUMP_APPROVAL : "DRAFT" as BUMP_APPROVAL;
        bumpState = BUMP_APPROVAL[action];
        const userId = req.user.id;
        const prevPage = req.query.prevPage !== undefined ? req.query.prevPage : 0;
        const limit = Number(req.query.limit) || 10;
        const { data } = await service.allMyBumps(arangodb, userId, prevPage, limit, bumpState);

        res.send({
            status: 200,
            data: manageOutput(data),
            message: STATUS_MSG.FIND
        });
    } catch (e) {
        next(e);
    }
}

export const repCreatedBumps = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {

        const { arangodb } = req.app.locals;
        let bumpState: string | undefined = req.query.bumpState;
        const action = bumpState ? bumpState.toUpperCase() as BUMP_APPROVAL : "DRAFT" as BUMP_APPROVAL;
        bumpState = BUMP_APPROVAL[action];
        const userId = req.user.id;
        const prevPage = req.query.prevPage !== undefined ? req.query.prevPage : 0;
        const limit = Number(req.query.limit) || 10;
        const { data } = await service.repCreatedBumps(arangodb, userId, prevPage, limit, bumpState);
        res.send({
            status: 200,
            data: manageOutput(data),
            message: STATUS_MSG.FIND
        });
    } catch (e) {
        next(e);
    }
}

export const uploadBumpImage = async (
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

export const createBump = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { arangodb, timeZone } = req.app.locals;
        const modifiedBody = {
            ...req.body,
            goLiveDate: localToUTC(req.body.goLiveDate, timeZone),
        }
        let bumpState: string | undefined = modifiedBody["bumpState"];
        const action = bumpState ? bumpState.toUpperCase() as BUMP_APPROVAL : "DRAFT" as BUMP_APPROVAL;
        bumpState = BUMP_APPROVAL[action];

        modifiedBody["bumpState"] = bumpState;
        modifiedBody["createdBy"] =req.user.id;
        await service.createBump(arangodb, modifiedBody);
        res.send({
            status: 200,
            data: 'New Prompt Created!',
            message: STATUS_MSG.CREATE
        });
    } catch (e) {
        next(e);
    }
};

export const updateBump = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { arangodb, timeZone } = req.app.locals;
        const id = req.body.id;
        delete req.body.id;
        const userId = req.user.id;
        const modifiedBody = {
            ...req.body,
            goLiveDate: localToUTC(req.body.goLiveDate, timeZone),
        }
        let bumpState: string | undefined = modifiedBody["bumpState"];
        const action = bumpState ? bumpState.toUpperCase() as BUMP_APPROVAL : "DRAFT" as BUMP_APPROVAL;
        bumpState = BUMP_APPROVAL[action];
        modifiedBody["bumpState"] = bumpState;
        await service.updateBump(arangodb, id, userId, modifiedBody);
        res.send({
            status: 200,
            data: 'Bump Updated!',
            message: STATUS_MSG.CREATE
        });
    } catch (e) {
        next(e);
    }
}

export const bumpStatus = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { arangodb } = req.app.locals;
        const { id } = req.body;
        const userId = req.user.id;
        const action = req.body.action as BUMP_APPROVAL;
        const approval = BUMP_APPROVAL[action];

        await service.updateBump(arangodb, id, userId, { bumpApproval: approval });
        res.send({
            status: 200,
            data: 'Bump Updated!',
            message: STATUS_MSG.CREATE
        });
    } catch (e) {
        next(e);
    }
}

export const deleteBumps = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { arangodb } = req.app.locals;
        await service.deleteBumps(arangodb, req.body);
        res.send({
            status: 200,
            data: 'Bump Deleted!',
            message: STATUS_MSG.CREATE
        });
    } catch (e) {
        next(e);
    }
}

export const fetchCampus = async (
    req: any,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { arangodb } = req.app.locals;
        const userId = req.user.id;
        const prevPage = req.query.prevPage !== undefined ? req.query.prevPage : 0;
        const limit = Number(req.query.limit) || 10;
        const campusName = req.query.campusName !== undefined ? req.query.campusName : "";

        const campusData = await service.fetchCampusService(arangodb, userId, campusName, prevPage, limit);

        res.send({
            status: 200,
            data: campusData,
            message: STATUS_MSG.FIND_ONE
        });
    } catch (e) {
        next(e);
    }
};