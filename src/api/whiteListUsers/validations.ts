export const createTopicSectionSchema = {
    $id: '/topic/createTopicSectionSchema',
    type: 'object',
    required: ['phone', 'education', 'campus'],
    properties: {
        firstName: {
            type: 'string',
            sanitize: 'reqText'
        },
        lastName: {
            type: 'string',
            sanitize: 'reqText'
        },
        phone: {
            type: 'string',
            sanitize: 'reqText'
        },
        education: {
            type: 'string',
            sanitize: 'reqText'
        },
        campus: {
            type: 'string',
            sanitize: 'reqText'
        }
    },
    additionalProperties: false
};

