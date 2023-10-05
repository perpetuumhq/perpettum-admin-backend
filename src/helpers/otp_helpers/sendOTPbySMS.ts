import twilio from 'twilio';
import { TWILIO_CONFIG } from '../../config/config';
import generateOTP from './generateOTP';
import { build, create, initialBuilderState } from '../arango_helpers/dymamicArangoQuery';
import { COL, EXPIRE_TIME_RANGE_IN_SEC } from '../../constants/const';
import queryArangoDB from '../arango_helpers/queryArangoDB';
import { Database } from 'arangojs';
import queryArangoKVStore from '../arango_helpers/queryArangoKVStore';

const client = twilio(TWILIO_CONFIG.accountSid, TWILIO_CONFIG.authToken);

const sendSMSforOTP = async (arangodb: Database, user: any) => {
    try {
        const otp = generateOTP(6);

        await client.messages.create({
            to: user.phone,
            from: TWILIO_CONFIG.twilioNumber,
            body: `Your CAHO verification OTP is ${otp}. Don't share this code with anyone.`
        });

        const body = {
            otp: otp,
            user: user._key,
            phone: user.phone,
            valid_till: new Date(Date.now() + EXPIRE_TIME_RANGE_IN_SEC.OTP).toISOString(),
        }
        const key = `${user.phone}_${otp}`;
        await queryArangoKVStore.set(arangodb, COL.otps, key, body);
    } catch (e) {
        console.log(e);
    }
};

export default sendSMSforOTP;
