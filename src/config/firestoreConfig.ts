import * as admin from 'firebase-admin';
import { DATABASE_URL, SERVICE_ACCOUNT, STORAGE_BUCKET } from './config';

export default async (): Promise<any> => {
    try {
        await admin.initializeApp({
            credential: admin.credential.cert(SERVICE_ACCOUNT),
            databaseURL: DATABASE_URL,
            storageBucket: STORAGE_BUCKET
        });

        const db = await admin.firestore();
        const storage = await admin.storage();
        const realtimeDb = await admin.database();
        const remoteConfig = admin.remoteConfig();

        db.settings({ ignoreUndefinedProperties: true });
        return { db, realtimeDb, storage, admin, remoteConfig };
    } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
    }
};
