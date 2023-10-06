import { COL, INFO_META, STATUS_MSG } from '../../constants/const';
import { NextFunction, Response } from 'express';
import autoId from '../../helpers/generateAutoid';
import { STORAGE_FOLDER, STORAGE_URL } from '../../config/config';
import * as service from './service';
import manageOutput from '../../helpers/data_helpers/manageOutputData';

export const getAllBumps = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    const { arangodb } = req.app.locals;
    const { data } = await service.allBumps(arangodb);
    res.send({
        status: 200,
        data: manageOutput(data),
        message: STATUS_MSG.FIND
    });
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
        const { arangodb } = req.app.locals;
        await service.createBump(arangodb, req.body);
        res.send({
            status: 200,
            data: 'New Prompt Created!',
            message: STATUS_MSG.CREATE
        });
    } catch (e) {
        next(e);
    }
};
