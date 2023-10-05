import path from 'path';
import * as dotenv from 'dotenv';
// import serviceAccount from '../../serviceAccountKey.json';

dotenv.config({ path: path.join(__dirname, '../../.env') });

export const environment = process.env.NODE_ENV || 'local';

export const PORT = process.env.PORT || 4000;

export const DATABASE_URL = process.env.DATABASE_URL || '';

export const ARANGO_DB_URL = process.env.ARANGO_DB_URL || '';

export const ARANGO_DB_NAME = process.env.ARANGO_DB_NAME || '_system';

export const ARANGO_DB_USERNAME = process.env.ARANGO_DB_USERNAME || '';

export const ARANGO_DB_PASSWORD = process.env.ARANGO_DB_PASSWORD || '';

export const STORAGE_BUCKET = process.env.STORAGE_BUCKET || '';

let ServiceAccount;
if (process.env.NODE_ENV === 'production') {
    ServiceAccount = {
        projectId: process.env.PROJECT_ID,
        clientEmail: process.env.CLIENT_EMAIL,
        privateKey: Buffer.from(process.env.PRIVATE_KEY || '', 'base64')
            .toString('utf-8')
            .replace(/\\n/g, '\n')
    };
    console.log(ServiceAccount);
} else {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const serviceAccount = require('../../serviceAccountKey.json');
    ServiceAccount = {
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key
    };
}

export const SERVICE_ACCOUNT = ServiceAccount;

// export const SERVICE_ACCOUNT = {
//     projectId: process.env.PROJECT_ID || serviceAccount.project_id,
//     clientEmail: process.env.CLIENT_EMAIL || serviceAccount.client_email,
//     privateKey: process.env.PRIVATE_KEY || serviceAccount.private_key
// };

export const JWT_CONFIG = {
    secretKey: process.env.JWT_SECRET || 'secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
};

export const TWILIO_CONFIG = {
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    twilioNumber: process.env.TWILIO_NUMBER || ''
};

export const STORAGE_FOLDER = {
    audio: 'audio',
    room: 'room'
};

export const STORAGE_URL =
    process.env.STORAGE_URL || 'https://storage.googleapis.com/perpetuum-d997d.appspot.com/';

export const AGORA_CONFIG = {
    APP_ID: process.env.AGORA_APP_ID || '',
    APP_CERTIFICATE: process.env.AGORA_APP_CERTIFICATE || ''
};
