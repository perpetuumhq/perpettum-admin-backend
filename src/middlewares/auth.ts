import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/config';
interface DecodedToken {
    [key: string]: any;
}

export const auth = (req: any, res: Response, next: NextFunction) => {
    // Get the token from the 'Authorization' header
    const authHeader = req.headers.authorization;
    const timeZone = req.headers['Time-Zone'] ?? 'Asia/Kolkata';

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('You are not allowed/Unauthorized');
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_CONFIG.secretKey) as DecodedToken;

        delete decoded.exp;
        delete decoded.iat;
        req.user = decoded;
        req.timeZone = timeZone;
        next();
    } catch (error) {
        throw new Error(error);
    }
};
