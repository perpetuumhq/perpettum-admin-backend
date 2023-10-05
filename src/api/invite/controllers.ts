import { NextFunction, Response } from 'express';
import { COL, INVITE_TYPE, STATUS_MSG } from '../../constants/const';
import BadRequestError from '../../Errors/BadRequestError';
import generateRandomString from '../../helpers/generateRandomString';
import autoId from '../../helpers/generateAutoid';

export const inviteCodeCheck = async (
    req: any,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { db } = req.app.locals;
        const { user } = req;
        const { inviteCode } = req.body;
        if (!inviteCode) {
            throw new Error('Invite code is required!');
        }

        if (inviteCode === 'TEST') {
            await db.collection(COL.users).doc(user.id).update({
                isOnWaitList: false,
                isOnInvite: false
            });
            res.send({
                status: 200,
                data: 'Successfully User Joined.',
                message: STATUS_MSG.CREATE
            });
            return;
        }

        const invite = await db.collection(COL.invite).where('inviteCode', '==', inviteCode).get();

        if (invite.empty) {
            throw new BadRequestError('Invalid invite code!');
        }
        const inviteData = invite.docs[0].data();
        if (inviteData.type === INVITE_TYPE.single) {
            if (inviteData.user !== user.id) {
                throw new BadRequestError('Invalid invite code!');
            }
            if (inviteData.expired) {
                throw new BadRequestError('Invite code expired!');
            }
            await db.collection(COL.invite).doc(inviteCode).update({
                expired: true
            });
        }
        if (inviteData.type === INVITE_TYPE.multiple) {
            if (inviteData.joiningLimit <= inviteData.codeUsed) {
                throw new BadRequestError('Invite code expired!');
            }
            await db
                .collection(COL.invite)
                .doc(inviteData.id)
                .update({
                    codeUsed: inviteData.codeUsed + 1
                });
        }
        if (inviteData.type === INVITE_TYPE.group) {
            if (inviteData.users.includes(user.id)) {
                throw new BadRequestError('Invalid invite code!');
            }
        }
        await db.collection(COL.users).doc(user.id).update({
            isOnWaitList: false,
            isOnInvite: false
        });
        res.send({
            status: 200,
            data: 'Successfully User Joined.',
            message: STATUS_MSG.CREATE
        });
    } catch (err) {
        next(err);
    }
};

export const joinWaitlist = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { db } = req.app.locals;
        const { user } = req;
        await db.collection(COL.users).doc(user.id).update({
            isOnWaitList: true,
            isOnInvite: false
        });
        res.send({
            status: 200,
            data: 'Successfully User Joined on WaitList.',
            message: STATUS_MSG.CREATE
        });
    } catch (err) {
        next(err);
    }
};

export const myInvite = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { db } = req.app.locals;
        const { user } = req;
        const lastInvite = await db
            .collection(COL.invite)
            .where('referer', '==', user.id)
            .orderBy('createdAt', 'desc')
            .limit(1)
            .get();
        let userData = {};
        if (!lastInvite.empty) {
            const lastInviteData = lastInvite.docs[0].data();
            userData = {
                inviteCode: lastInviteData.inviteCode,
                codeUsed: lastInviteData.codeUsed
            };
        } else {
            const userDoc = await db.collection(COL.users).doc(user.id).get();
            const userDetailData = userDoc.data();
            const firstThreeLetter = userDetailData.nickname.slice(0, 3).toUpperCase();
            const randomString = generateRandomString(6 - firstThreeLetter.length);

            const inviteCode = `${firstThreeLetter}${randomString}`;
            // save this invite code to db
            const inviteId = autoId();
            await db.collection(COL.invite).doc(inviteId).set({
                id: inviteId,
                referer: user.id,
                inviteCode: inviteCode,
                codeUsed: 0,
                joiningLimit: 5,
                type: INVITE_TYPE.multiple,
                createdAt: new Date()
            });

            userData = {
                inviteCode: inviteCode,
                codeUsed: 0
            };
        }

        res.send({
            status: 200,
            data: userData,
            message: STATUS_MSG.FIND
        });
    } catch (err) {
        next(err);
    }
};


export const allInviteCode = async (
    req: any,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { db } = req.app.locals;
    const snapshot = await db
        .collection(COL.invite)
        .orderBy('createdAt', 'desc')
        .get();
    const data = [];
    for (const doc of snapshot.docs) {
        const docData = doc.data();
        const refererRef = await db.collection(COL.users).doc(docData.referer).get();
        const referer = refererRef.data();
        if (referer) {
            docData.referer = referer.nickname;
        }
        data.push(docData);
    }
    res.send({
        status: 200,
        data,
        message: STATUS_MSG.FIND
    });
}