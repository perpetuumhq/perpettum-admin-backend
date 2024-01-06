import { Database } from "arangojs";
import { build, checkKeysInFieldsDynamic, create, filter, forIn, initialBuilderState, joinMultiple, remove, returnExpr, update } from "../../helpers/arango_helpers/dymamicArangoQuery";
import { COL } from "../../constants/const";
import queryArangoDB from "../../helpers/arango_helpers/queryArangoDB";


export const allFileAndFolder = async (
    arangodb: Database,
    q = null
): Promise<any> => {
    const builder = build(
        returnExpr(
            q !== null ? filter(
                forIn(initialBuilderState, COL.storage, 'storage'),
                q
            ) : forIn(initialBuilderState, COL.storage, 'storage'),
            `storage`
        )
    );
    const finalQuery = {
        query: builder.query,
        bindVars: {
            ...builder.bindVars,
            ...(q !== null && { q }),
        }
    };
    const { data, count } = await queryArangoDB(arangodb, finalQuery, true);
    return { data, count };
}

export const createStorage = async (
    arangodb: Database,
    body: any,
): Promise<any> => {
    const builder = build(
        create(initialBuilderState, COL.storage)
    );
    const finalQuery = {
        query: builder.query,
        bindVars: { ...builder.bindVars, body: body }
    };
    await queryArangoDB(arangodb, finalQuery);
    return 'Created!';
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

export const deleteData = async (
    arangodb: Database,
    id: string,
): Promise<any> => {
    const builder = build(
        remove(initialBuilderState, '@_key', COL.storage)
    );
    const finalQuery = {
        query: builder.query,
        bindVars: { ...builder.bindVars, _key: id }
    };
    await queryArangoDB(arangodb, finalQuery);
    return 'File Deleted!';
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