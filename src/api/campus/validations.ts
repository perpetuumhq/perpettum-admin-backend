export const phoneOtpSchema = {
    $id: '/user/phoneOtpSchema',
    type: 'object',
    required: ['phone'],
    properties: {
        phone: {
            type: 'string',
            sanitize: 'reqPhone'
        }
    },
    additionalProperties: false
};

export const phoneOtpVerificationSchema = {
    $id: '/user/phoneOtpVerificationSchema',
    type: 'object',
    required: ['phone', 'otp'],
    properties: {
        phone: {
            type: 'string',
            sanitize: 'reqPhone'
        },
        otp: {
            type: 'string',
            sanitize: 'reqText'
        }
    },
    additionalProperties: false
};

export const grantAccessVerificationSchema = {
    $id: '/user/grantAccessVerificationSchema',
    type: 'object',
    required: ['phone', 'name'],
    properties: {
        phone: {
            type: 'string',
            sanitize: 'reqPhone'
        },
        name: {
            type: 'string',
            sanitize: 'reqText'
        }
    },
    additionalProperties: false
};
