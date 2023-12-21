import { BUFFER_END_TASK_QUEUE, BUFFER_END_TASK_QUEUE_LOCATION, COL, INFO_META, STATUS_MSG } from '../../constants/const';
import { NextFunction, Response } from 'express';
import autoId from '../../helpers/generateAutoid';
import { MAIN_BACKEND_URL, PROJECT_ID, STORAGE_FOLDER, STORAGE_URL } from '../../config/config';
import * as service from './service';
import manageOutput from '../../helpers/data_helpers/manageOutputData';
import localToUTC from '../../helpers/timeZone_helper/localToUTC';
import { CloudTasksClient } from '@google-cloud/tasks';
import moment from 'moment-timezone';
import utcToLocal from '../../helpers/timeZone_helper/utcToLocal';
import { build, filter, forIn, initialBuilderState } from '../../helpers/arango_helpers/dymamicArangoQuery';

const client = new CloudTasksClient({
    projectId: PROJECT_ID,
    keyFilename: 'serviceAccountKey.json'
});

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
        const { arangodb, timeZone } = req.app.locals;
        const nowDate = new Date();
        if (moment(req.body.goLiveDate).isBefore(moment(nowDate))) {
            throw new Error('goLiveDate is in the past');
        }
        const modifiedBody = {
            ...req.body,
            goLiveDate: localToUTC(req.body.goLiveDate, timeZone),
        }
        const data = await service.createBump(arangodb, modifiedBody);
        bumpBufferCompleteTask(arangodb, data);
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
        const nowDate = new Date();
        if (moment(req.body.goLiveDate).isBefore(moment(nowDate))) {
            throw new Error('goLiveDate is in the past');
        }

        const id = req.body.id;
        delete req.body.id;
        const modifiedBody = {
            ...req.body,
            goLiveDate: localToUTC(req.body.goLiveDate, timeZone),
        }
        const data = await service.updateBump(arangodb, id, modifiedBody);
        bumpBufferCompleteTask(arangodb, data);
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
        const data = await service.deleteBumps(arangodb, req.body);
        deleteBufferCompleteTask(data)
        res.send({
            status: 200,
            data: 'Bump Deleted!',
            message: STATUS_MSG.CREATE
        });
    } catch (e) {
        next(e);
    }
}

const deleteBufferCompleteTask = async (bump: any): Promise<void> => {
    if (bump?.taskPath) {
        await client.deleteTask({ name: bump?.taskPath });
    }
}


const bumpBufferCompleteTask = async (arangodb: any, bump: any): Promise<void> => {
    try {
        deleteBufferCompleteTask(bump);
        const url = `${MAIN_BACKEND_URL}/${bump._key}/buffer-spotlight-selection`;
        const parent = client.queuePath(PROJECT_ID, BUFFER_END_TASK_QUEUE_LOCATION, BUFFER_END_TASK_QUEUE);

        const liveTime: any = utcToLocal(bump.goLiveDate);
        const nowDate = new Date();
        // check if goLiveDate is in the past
        if (moment(liveTime).isBefore(moment(nowDate))) {
            console.log('goLiveDate is in the past');
        }
        const timeDiffBetweenNowAndGoLiveDate = moment(liveTime).diff(moment(nowDate), 'seconds');
        const scheduleTime = timeDiffBetweenNowAndGoLiveDate + bump.bufferTime;
        const task: any = {
            httpRequest: {
                url,
                httpMethod: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
            },
            retryConfig: {
                maxAttempts: 3,
                minBackoff: {
                    seconds: 5,
                    nanos: 0,
                },
                maxBackoff: {
                    seconds: 15,
                    nanos: 0,
                },
                maxDoublings: 3,
                maxRetryDuration: {
                    seconds: 1800,  // 30 minutes
                    nanos: 0,
                }
            },
            scheduleTime: {
                seconds: scheduleTime + Date.now() / 1000,
            }
        };

        const [response] = await client.createTask({ parent, task });

        await service.updateBump(arangodb, bump._key, {
            taskPath: response.name,
        });
        console.log(`Task created at ${moment(nowDate).add(scheduleTime, 'seconds')}`);
    } catch (e) {
        console.log(`Error creating task: ${e}`);
    }
}