import Ajv from 'ajv';
import validator from 'validator';
import ajvError from 'ajv-errors';

export const { normalizeEmail, isURL, trim, isEmail } = validator;

const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });

ajvError(ajv);

ajv.addKeyword({
    errors: true,
    modifying: true,
    keyword: 'sanitize',
    type: 'string',
    compile: (schema: any) => {
        return (data: any, currentDataPath: any) => {
            if (
                ['phone', 'url', 'email', 'date', 'text', 'objectId', 'file'].includes(schema) &&
                data === ''
            ) {
                return true;
            }
            if (schema === 'reqFile') {
                return data.length;
            }
            if (schema === 'number') {
                if (typeof Number(data) !== 'number') {
                    return false;
                }
                if (data === '') {
                    return true;
                }
                currentDataPath.parentData[currentDataPath.parentDataProperty] = Number(data);
                return true;
            }
            if (schema === 'reqNumber') {
                if (typeof Number(data) !== 'number') {
                    return false;
                }
                currentDataPath.parentData[currentDataPath.parentDataProperty] = Number(data);
                return true;
            }
            if (['phone', 'reqPhone'].includes(schema)) {
                return true;
            }
            if (['url', 'reqUrl'].includes(schema)) {
                return isURL(data);
            }
            if (['email', 'reqEmail'].includes(schema)) {
                if (!isEmail(data)) {
                    return false;
                }
                currentDataPath.parentData[currentDataPath.parentDataProperty] =
                    normalizeEmail(data);
                return true;
            }
            if (['date', 'reqDate'].includes(schema)) {
                currentDataPath.parentData[currentDataPath.parentDataProperty] = new Date(data);
                return true;
            }
            if (['text', 'reqText'].includes(schema)) {
                currentDataPath.parentData[currentDataPath.parentDataProperty] = trim(
                    data.replace(/<script>/g, '').replace(/<\/script>/g, '')
                );
                return true;
            }
            return true;
        };
    }
});

export default ajv;
