import { COL, STATUS_MSG } from '../../constants/const';
import { NextFunction, Response } from 'express';
import { createUser, doesUserAlreadyExistService, updateUser } from './service'
import sendOTPbySMS from '../../helpers/otp_helpers/sendOTPbySMS';
import queryArangoKVStore from '../../helpers/arango_helpers/queryArangoKVStore';
import generateJWTToken from '../../helpers/JWT/generateJWTToken';
import manageOutput from '../../helpers/data_helpers/manageOutputData';

export const generatePhoneOtp = async (
    req: any,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { arangodb } = req.app.locals;
        const { phone } = req.body;

        let user: any = await doesUserAlreadyExistService(arangodb, phone);

        if (!user) {
            throw new Error("User doesn't exist")
        }

        await sendOTPbySMS(arangodb, user);

        res.status(200).send({
            status: 200,
            data: 'Otp sent successfully',
            message: STATUS_MSG.FIND
        });
    } catch (e) {
        next(e);
    }
};

export const verifyPhoneOtp = async (
    req: any,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { arangodb } = req.app.locals;
        const { phone, otp } = req.body;
        const key = `${phone}_${otp}`
        const getLatestPhoneOTP = await queryArangoKVStore.get(arangodb, COL.otps, key);

        if (!getLatestPhoneOTP) throw new Error('Invalid OTP');

        const validTillDate = new Date(getLatestPhoneOTP?.valid_till);
        const currentDate = new Date();

        if (currentDate > validTillDate) throw new Error('OTP expired');

        const updatedUser = await updateUser(arangodb, getLatestPhoneOTP.user.toString(), {
            isPhoneVerified: true,
            isOnInvite: false
        });

        if (!updatedUser) throw new Error('Something Went Wrong!');

        const userOutputData = manageOutput(req, updatedUser);

        const jwtToken = generateJWTToken(userOutputData);

        res.send({
            status: 200,
            data: {
                user: userOutputData,
                token: jwtToken
            },
            message: STATUS_MSG.FIND
        });
    } catch (e) {
        next(e);
    }
};

export const grantAccess = async (
    req: any,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { arangodb } = req.app.locals;
        const { phone, name } = req.body;

        const grantedAccess = await createUser(arangodb,{phone,name});

        if (!grantedAccess) throw new Error('Something Went Wrong!');
        res.send({
            status: 200,
            data: "Successfully granted access",
            message: STATUS_MSG.FIND
        });
    } catch (e) {
        next(e);
    }
};