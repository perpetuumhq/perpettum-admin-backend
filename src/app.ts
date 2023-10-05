import express, { NextFunction } from 'express';
import * as Sentry from "@sentry/node";
import cors from 'cors';
import { PORT } from './config/config';
import routes from './routes/routes';
import firestoreConfig from './config/firestoreConfig';
import arangodbConnect from './config/connectArangoDb';

const app = express();

Sentry.init({
    dsn: "https://b356ec37b3424ea6946cc1bb90f3c88d@o4505600587923456.ingest.sentry.io/4505600589758464",
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({
            tracing: true
        }),
        // enable Express.js middleware tracing
        new Sentry.Integrations.Express({
            app
        }),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!,
});


const storage = async () => {
    const { db, realtimeDb, storage, admin, remoteConfig } = await firestoreConfig();
    app.locals.db = db;
    app.locals.storage = storage;
    app.locals.admin = admin;
    app.locals.realtimeDb = realtimeDb;
    app.locals.remoteConfig = remoteConfig;
};
storage()
    .then(() => {
        // eslint-disable-next-line no-console
        console.log('firestore connected!');
    }) // eslint-disable-next-line no-console
    .catch((err) => console.log(err));

const connectArangoDB = async () => {
    const arangodb = await arangodbConnect();
    await arangodb.listDatabases();
    app.locals.arangodb = arangodb;
};

connectArangoDB()
    .then(() => {
        // eslint-disable-next-line no-console
        console.log('arangodb connected!');
    }) // eslint-disable-next-line no-console
    .catch((err) => console.log(err));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(
    cors({
        origin: '*',
        exposedHeaders: ['Content-Disposition']
    })
);

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.get('/testing', async (req, res) => {
    // just want to test every db is connected successfully or not
    const { db, realtimeDb, storage, admin, remoteConfig, arangodb } = req.app.locals;
    await arangodb.listDatabases();
    res.send({
        db: db ? true : false,
        realtimeDb: realtimeDb ? true : false,
        storage: storage ? true : false,
        admin: admin ? true : false,
        remoteConfig: remoteConfig ? true : false,
        arangodb: arangodb ? true : false
    });
});


// all api routes for genopi-admin-frontend
app.use(routes);

app.use((req: any, res: any, next: NextFunction) => {
    const error = new Error(`Sorry, Something went Wrong with this url: ${req.originalUrl}`);
    next(error);
});


app.use(Sentry.Handlers.errorHandler());
app.use((err: any, req: any, res: any, next: NextFunction) => {
    console.log(err);
    res.status(err?.status || 404).send({
        status: err?.status || 404,
        message: err?.message || 'Something went wrong'
    });
});

app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Perpettum-backend running on port ${PORT}!`);
});
