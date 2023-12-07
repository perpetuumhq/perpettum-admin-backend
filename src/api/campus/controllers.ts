import { COL, STATUS_MSG } from '../../constants/const';
import { NextFunction, Response } from 'express';
import * as service from './service';
import manageOutput from '../../helpers/data_helpers/manageOutputData';
import localToUTC from '../../helpers/timeZone_helper/localToUTC';


export const allCampus = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { arangodb } = req.app.locals;
        const { data, count } = await service.allCampuses(arangodb);
        res.send({
            status: 200,
            data: manageOutput(data || []),
            count: count,
            message: STATUS_MSG.FIND
        });
    } catch (e) {
        next(e);
    }
};

export const createCampus = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { arangodb } = req.app.locals;

        const topicBody = {
            ...req.body,
            goLiveDate: localToUTC(req.body.goLiveDate)
        };
        await service.createCampus(arangodb, topicBody);
        res.send({
            status: 200,
            data: 'New Topic Section Created!',
            message: STATUS_MSG.CREATE
        });
    } catch (e) {
        next(e);
    }
};

export const updateCampus = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { arangodb } = req.app.locals;
        const { campusId } = req.params;
        const body = {
            ...req.body,
            goLiveDate: localToUTC(req.body.goLiveDate)
        };

        await service.updateCampus(arangodb, campusId, body);
        res.send({
            status: 200,
            data: 'Topic Updated!',
            message: STATUS_MSG.UPDATE
        });
    } catch (e) {
        next(e);
    }
};