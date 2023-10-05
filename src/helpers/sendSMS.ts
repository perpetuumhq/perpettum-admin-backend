import twilio from 'twilio';
import { TWILIO_CONFIG } from '../config/config';

const client = twilio(TWILIO_CONFIG.accountSid, TWILIO_CONFIG.authToken);

const sendSMSforOTP = async (to: string, otp: any) => {
    try {
        await client.messages.create({
            to,
            from: TWILIO_CONFIG.twilioNumber,
            body: `Your CAHO verification OTP is ${otp}. Don't share this code with anyone.`
        });
    } catch (e) {
        console.log(e);
    }
};

export default sendSMSforOTP;
