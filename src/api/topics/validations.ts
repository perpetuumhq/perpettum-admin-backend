export const createTopicSchema = {
    $id: '/topic/createTopicSchema',
    type: 'object',
    required: ['name'],
    properties: {
        name: {
            type: 'string',
            sanitize: 'reqText'
        },
        icon: {
            type: 'string',
            sanitize: 'reqText'
        },
        bgColor: {
            type: 'string',
            sanitize: 'reqText'
        },
        description: {
            type: 'string',
            sanitize: 'reqText'
        },
        relatedTopics: {
            type: 'array',
            items: {
                type: 'string'
            }
        },
        subs: {
            type: 'array',
            items: {
                type: 'string'
            }
        }
    },
    additionalProperties: false
};

export const updateTopicOrderSchema = {
    $id: '/topic/updateTopicOrderSchema',
    type: 'object',
    required: ['topics'],
    properties: {
        topics: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    topicId: {
                        type: 'string'
                    },
                    order: {
                        type: 'string',
                        sanitize: 'reqNumber'
                    }
                }
            }
        }
    },
    additionalProperties: false
};
