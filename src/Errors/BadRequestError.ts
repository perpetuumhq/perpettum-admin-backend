import BaseErrorClass from './BaseErrorClass';

class BadRequestError extends BaseErrorClass {
    code: string;
    isAlreadyExist: boolean | null;
    alreadyExistId: string;
    constructor(
        message: string,
        code = 400,
        isAlreadyExist: boolean | null = null,
        alreadyExistId: any = null
    ) {
        super(message, code);
        this.code = 'Bad Request ';
        if (isAlreadyExist != null) this.isAlreadyExist = isAlreadyExist;
        if (alreadyExistId != null) this.alreadyExistId = alreadyExistId;
    }
}
export default BadRequestError;
