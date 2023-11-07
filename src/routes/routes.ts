import express, { Response } from 'express';
import morgan from 'morgan';
import { environment } from '../config/config';
import inviteRoutes from '../api/invite/routes';
import topicRoutes from '../api/topics/routes';
import bumpRoutes from '../api/bumps/routes';
import userRoutes from '../api/user/routes';
import campus from '../api/campus/routes';
import catalogue from '../api/catalogue/routes';

const router = express.Router();

if (environment === 'local' || environment === 'dev') {
    router.use(morgan('dev'));
}

router.get('/', (req: any, res: Response) => {
    res.send('PERPETTUM-ADMIN-BACKEND API is running');
});


router.use('/invite', inviteRoutes);
router.use('/user', userRoutes);
router.use('/topic', topicRoutes);
router.use('/bump', bumpRoutes)
router.use('/campus', campus)
router.use('/catalogue', catalogue)

export default router;
