import { COL, INFO_META, STATUS_MSG } from '../../constants/const';
import { NextFunction, Response } from 'express';
import autoId from '../../helpers/generateAutoid';
import { STORAGE_FOLDER, STORAGE_URL } from '../../config/config';


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
        const { db, admin } = req.app.locals;
        const promptUid = autoId();
        const promptData = {
            id: promptUid,
            ...req.body
        };
        await db.collection(COL.bumps).doc(promptUid).set(promptData);
        res.send({
            status: 200,
            data: 'New Prompt Created!',
            message: STATUS_MSG.CREATE
        });
    } catch (e) {
        next(e);
    }
};