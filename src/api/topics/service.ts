import { Database } from "arangojs";
import { wordMatch, build, checkKeysInFieldsDynamic, create, filter, forIn, initialBuilderState, joinMultiple, remove, returnExpr, update } from "../../helpers/arango_helpers/dymamicArangoQuery";
import { COL } from "../../constants/const";
import queryArangoDB from "../../helpers/arango_helpers/queryArangoDB";


export const allTopics = async (
    arangodb: Database,
    active = null,
    topicName: string,
): Promise<any> => {
    // in active variable, can pass null or true/false, if not null ,then will filter by active
    const builder = build(
        returnExpr(
            joinMultiple(
                active !== null ? wordMatch(filter(
                    forIn(initialBuilderState, COL.topics, 'topic'),
                    `topic.isActive == @active` 
                ),'topic.name',topicName) : wordMatch(forIn(initialBuilderState, COL.topics, 'topic'),'topic.name',topicName),
                'topic',
                [
                    { fieldName: 'relatedTopics', targetCollection: COL.topics, joinType: 'manyToMany' },
                    { fieldName: 'subs', targetCollection: COL.topics, joinType: 'manyToMany' }
                ]
            ),
            () => `
            MERGE(topic, {
                relatedTopics: topic_relatedTopics,
                subs: topic_subs
            })
        `
        )
    );
    const finalQuery = {
        query: builder.query,
        bindVars: {
            ...builder.bindVars,
            ...(active !== null && { active: Boolean(active) })
        }
    };
    const { data, count } = await queryArangoDB(arangodb, finalQuery, true);
    return { data, count };
}

export const createTopic = async (
    arangodb: Database,
    body: any,
): Promise<any> => {
    const builder = build(
        create(initialBuilderState, COL.topics)
    );
    const finalQuery = {
        query: builder.query,
        bindVars: { ...builder.bindVars, body: body }
    };
    await queryArangoDB(arangodb, finalQuery);
    return 'New Topic Created!';
}

export const updateTopic = async (
    arangodb: Database,
    topicId: string,
    body: any,
): Promise<any> => {
    const builder = build(
        update(initialBuilderState, '@_key', COL.topics, '@body')
    );
    const finalQuery = {
        query: builder.query,
        bindVars: { ...builder.bindVars, _key: topicId, body: body }
    };
    await queryArangoDB(arangodb, finalQuery);
    return 'Topic Updated!';
}

export const deleteTopic = async (
    arangodb: Database,
    topicId: string,
): Promise<any> => {
    const builder = build(
        remove(initialBuilderState, '@_key', COL.topics)
    );
    const finalQuery = {
        query: builder.query,
        bindVars: { ...builder.bindVars, _key: topicId }
    };
    await queryArangoDB(arangodb, finalQuery);
    return 'Topic Deleted!';
}

export const existsConnectionWithOthers = async (
    arangodb: Database,
    topicId: string,
): Promise<void> => {
    const builder = build(
        checkKeysInFieldsDynamic(initialBuilderState, [
            { collectionName: COL.topics, fieldName: 'relatedTopics', relationType: 'array', keys: [topicId] },
        ])
    );
    const finalQuery = {
        query: builder.query,
        bindVars: { ...builder.bindVars, topicId }
    };
    const { data } = await queryArangoDB(arangodb, finalQuery);
    if (data?.length) {
        throw new Error('Topic is connected with other topics');
    }
}