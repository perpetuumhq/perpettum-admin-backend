import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/config';
import { COL, EDGE_COL } from "../constants/const";
import { build, create, filterGroup, forIn, initialBuilderState, remove, returnExpr, update,limitExpr, filter } from "../helpers/arango_helpers/dymamicArangoQuery";
import queryArangoDB from "../helpers/arango_helpers/queryArangoDB";


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

export const adminAuth = async (req: any, res: Response, next: NextFunction) => {
    const { arangodb } = req.app.locals;
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
        const userId = req.user.id;
        req.timeZone = timeZone;
        const builder = build(
            returnExpr(
                filter(
                    forIn(initialBuilderState, COL.admin, 'admin'),
                    'admin._key == @userId'
                ),
                'admin'
            )
        );
    
        let finalQuery = {
            query: builder.query,
            bindVars: {
                userId,
            }
        };
        const { data } = await queryArangoDB(arangodb, finalQuery);
    
        if (!data?.length) {
            throw new Error('You are not Unauthorized');
        }
        next();
    } catch (error) {
        throw new Error(error);
    }
};