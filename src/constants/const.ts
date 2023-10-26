export const COL = {
    info: 'test_info',
    otps: 'test_otps',
    users: 'test_users',
    userData: 'test_userData',
    topics: 'test_topics',
    prompts: 'test_prompts',
    bumps: 'test_bumps',
    reactions: 'test_reactions',
    relations: 'test_relations',
    nudges: 'test_nudges',
    chat: 'test_chat',
    calls: 'test_calls',
    notification: 'test_notification',
    feedback: 'test_feedback',
    invite: 'test_invite',
    notificationTemplates: 'test_notificationTemplates',
};
export const EDGE_COL = {
    room: 'test_room',
    audio: 'test_audio',
    circle: 'test_circle',
    userRole: 'test_user_room_role_relation',
};

export const INFO_META = {
    doc_id: 'metadata',
    promptsCount: 'promptsCount',
    usersCount: 'usersCount',
    topicsCount: 'topicsCount',
    relationsCount: 'relationsCount',
    reactionsCount: 'reactionsCount'
};

export const RELATION_STATUS = {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected'
};

export const RELATION_MARBLE_STATUS = {
    INITIATE: 'initiate',
    CREATED: 'created',
    DIMMED: 'dimmed',
}

export const CALL_STATUS = {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected'
};

export const EXPIRE_TIME_RANGE_IN_SEC = {
    OTP: 300000, // 5 min
    CALL: 1800000, // 30 min
    RELATION: 1800000, // 30 min
    RELATION_CHAT: 86400000, // 24 hours
    NUDGE: 3600000, // 1 hour
};

export const CHAT_TYPE = {
    CALL: 'call',
    REACTION: 'reaction',
    RELATION: 'relation',
    POST: 'post',
    AUDIO: 'audio',
    TEXT: 'text',
};

export const CHAT_POSITION = {
    LEFT: 'left',
    RIGHT: 'right',
    CENTER: 'center'
}

export const INVITE_TYPE = {
    single: 'single',
    multiple: 'multiple',
    group: 'group'
};

export const STORAGE_PATH = {
    ROOM_PATH: 'images',
    AUDIO_PATH: 'audio'
};

export const STORAGE_SIZE_LIMIT = {
    ROOM_SIZE: 10 * 1024 * 1024, // 10 MB
    AUDIO_SIZE: 10 * 1024 * 1024, // 10 MB
}

export const STATUS_MSG = {
    FIND: 'Retrieve records successfully.',
    FIND_ONE: 'Retrieve record successfully.',
    COUNT: 'Retrieve count successfully.',
    CREATE: 'Record created successfully.',
    UPDATE: 'Record updated successfully.',
    DELETE: 'Record deleted successfully.',
    NOT_FOUND: 'Not Found',
    LOGIN_SUCCESS: 'Logged In successfully.',
    LOGOUT_SUCCESS: 'Logged Out successfully.',
    ANSWER_SUCCESS: 'Answer Generated successfully.'
};

export const NOTIFICATION_TYPE = {
    NUDGE: 'nudge',
    CHAT: 'chat',
    RELATION_CHAT: 'relation_chat',
    CALL: 'call',
    REACTION: 'reaction',
    RELATION: 'relation',
    RELATION_CREATED: 'relation_created',
    RELATION_INITIATE: 'relation_initiate',
    RELATION_REJECTED: 'relation_rejected',
    SEEN: 'seen',
}

export const TIME_ZONE = 'Asia/Kolkata';