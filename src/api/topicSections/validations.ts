export const createTopicSectionSchema = {
    $id: '/topic/createTopicSectionSchema',
    type: 'object',
    required: ['name'],
    properties: {
        name: {
            type: 'string',
            sanitize: 'reqText'
        }
    },
    additionalProperties: false
};

