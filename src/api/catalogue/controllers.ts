import { COL, INFO_META, STATUS_MSG } from '../../constants/const';
import { NextFunction, Response } from 'express';
import autoId from '../../helpers/generateAutoid';
import { STORAGE_FOLDER, STORAGE_URL } from '../../config/config';
import * as service from './service';
import manageOutput from '../../helpers/data_helpers/manageOutputData';
import localToUTC from '../../helpers/timeZone_helper/localToUTC';

export const fetchCatalogues = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    const { arangodb } = req.app.locals;
    const catalogueType = req.query.catalogueType;
    const prevPage = req.query.prevPage !== undefined ? req.query.prevPage : 0;
    const limit = Number(req.query.limit) || 10;

    const { data } = await service.fetchCatalogues(arangodb, catalogueType, prevPage, limit);

    res.send({
        status: 200,
        data: manageOutput(data),
        message: STATUS_MSG.FIND
    });
}


export const createCatalogues = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { arangodb } = req.app.locals;
        const id = req.user.id;
        const { catalogueType, header, headerType, supportiveText } = req.body;
        await service.createCatalogues(arangodb, { createdBy:id ,catalogueType, header, headerType, supportiveText });
        res.send({
            status: 200,
            data: 'New Prompt Created!',
            message: STATUS_MSG.CREATE
        });
    } catch (e) {
        next(e);
    }
};

export const updateCatalogues = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { arangodb } = req.app.locals;
        const id = req.body.id;
        delete req.body.id;
        const body = req.body;
        body["updatedBy"] = id;
        await service.updateCatalogue(arangodb, id, body);
        res.send({
            status: 200,
            data: 'Catalogue Updated!',
            message: STATUS_MSG.CREATE
        });
    } catch (e) {
        next(e);
    }
}