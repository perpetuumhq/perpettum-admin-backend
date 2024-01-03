export const createTemplateSchema = {
    $id: '/notificaiton-template/createTemplateSchema',
    type: 'object',
    required: ['type', 'title', 'body'],
    properties: {
        type: {
            type: 'string',
            sanitize: 'reqText'
        },
        title: {
            type: 'string',
            sanitize: 'reqText'
        },
        body: {
            type: 'string',
            sanitize: 'reqText'
        },
    },
    additionalProperties: false
};
