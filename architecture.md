# architecture:

` primary_key: uid`

-   user ->

    ```
    {
    username -(unique),
    phone,
    dob,
    gender,
    country,
    email,
    onWaitList: true/false,
    lastActiveTime: timestamp,
    isOnCall: true/false,
    languages : ['hindi', 'english'],
    location: {
    lat, lng
    }
    socialmedia: [ insta, linkedin, facebook ],
    avatar -> {
    hair,
    glasses,
    earings,
    clothes,
    body,
    tattoo,
    }
    }
    ```

<!-- relationship: {
initiator,
acceptor
}

history: {
userId,
} -->

-   Topics ->

    ```
    {
    created_by: primary_key
    name,
    isActive: true/false
    relatedTopics: [
    topic_id, ...
    ]
    sub: [
    topic_id, ...
    ],
    }
    ```

-   Subjects(Prompts) ->

    ```
    {
    topic_id,
    title,
    description,
    isActive: true/false
    published_at,
    created_at,
    updated_at,
    valid_till -> Timestamps
    user_count,
    tags: []
    }
    ```

-   Posts (reaction) ->

    ```
    {
    parent: reaction_id
    prompt_id,
    user_id,
    audio_link,
    audio_lang,
    audio_duration,
    created_at,
    updated_at,
    location: {
    lat,lng
    }
    like_count,
    view_count,
    play_count,
    }
    ```

-   relation:

    ```
    {
    reaction_id,
    sender: user_id,
    receiver: user_id,
    accepted: true/false
    created_at:
    accepted_at:,
    marble: {
    image,
    intensity
    }
    }
    ```

-   call:

    ```
    {
    relation_id,
    reaction_id,
    valid_till,
    created_at,
    call_intiateTime,
    attended_by: [user_id,...]
    call_endTime,
    audio_recording,
    audio\*
    feedback: [
    {
    user_id,
    rating,
    feedback_text
    },...
    ]
    }
    ```

-   activity: {
    user_id,
    }

-   notification: {
    typ....
    isSeen:true/false,
    }
