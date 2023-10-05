import ajv from '../ajv/ajv';
import { NextFunction, Request, Response } from 'express';

const staticSchemaValidation = (schema: any) => {
    return (req: Request | any, res: Response, next: NextFunction): any => {
        try {
            const validate = ajv.compile(schema);
            const valid = validate(req.body);
            if (!valid) {
                return res.status(400).send({
                    status: 400,
                    code: 'INVALID_REQUEST_BODY',
                    message: 'Something went wrong'
                });
            }

            return next();
        } catch (e: any) {
            res.status(e.status || 500).send({
                status: e.status || 500,
                code: e.status ? e.code : 'UNKNOWN_ERROR',
                error: e.status ? e.message : 'Something went wrong'
            });
        }
    };
};

export default staticSchemaValidation;
