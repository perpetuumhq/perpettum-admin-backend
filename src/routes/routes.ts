import express, { Response } from 'express';
import morgan from 'morgan';
import { environment } from '../config/config';
import inviteRoutes from '../api/invite/routes';
import topicRoutes from '../api/topics/routes';
import bumpRoutes from '../api/bumps/routes';

const router = express.Router();

if (environment === 'local' || environment === 'dev') {
    router.use(morgan('dev'));
}

router.get('/', (req: any, res: Response) => {
    res.send('PERPETTUM-ADMIN-BACKEND API is running');
});

router.use('/invite', inviteRoutes);
router.use('/topic', topicRoutes);
router.use('/bump', bumpRoutes)

export default router;
