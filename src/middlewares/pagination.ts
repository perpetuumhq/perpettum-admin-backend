import { NextFunction, Response } from 'express';

export const pagination = (req: any, res: Response, next: NextFunction): void => {
    const page = parseInt(req.query.page as string, 10);
    const limit = parseInt(req.query.limit as string, 10);

    // Use default values if the provided parameters are not valid
    const validPage = !isNaN(page) && page > 0 ? page : 1;
    const validLimit = !isNaN(limit) && limit > 0 ? limit : 10;

    // Attach the pagination parameters to the request object
    req.pagination = { page: validPage, limit: validLimit };

    next();
};
