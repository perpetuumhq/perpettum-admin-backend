import { Database } from "arangojs";
import { COL } from "../../constants/const";
import queryArangoDB from "../../helpers/arango_helpers/queryArangoDB";
import { build, create, filter, forIn, initialBuilderState, returnExpr, update } from "../../helpers/arango_helpers/dymamicArangoQuery";


export const allTopicSections = async (
    arangodb: Database,
): Promise<any> => {
    const builder = build(
        returnExpr(
            forIn(initialBuilderState, COL.topicSections, 'topicSection'),
            'topicSection',
        ));
    const finalQuery = {
        query: builder.query,
        bindVars: {
            ...builder.bindVars
        }
    };
    const { data, count } = await queryArangoDB(arangodb, finalQuery);
    if (data) {
        return { data, count };
    }
    return { data: [], count: 0 }
}

export const createTopicSection = async (
    arangodb: Database,
    body: any,
): Promise<any> => {

    const alreadyExist = await doesExistTopicSection(arangodb, body.name);
    if (alreadyExist) {
        throw new Error('Topic Section Name Already Exists!');
    }
    const builder = build(
        create(initialBuilderState, COL.topicSections)
    );
    const finalQuery = {
        query: builder.query,
        bindVars: { ...builder.bindVars, body: body }
    };
    await queryArangoDB(arangodb, finalQuery);
    return 'New Topic Created!';
}

// topicSectionName already exists or not

export const doesExistTopicSection = async (
    arangodb: Database,
    topicSectionName: string,
): Promise<any> => {
    const builder = build(
        returnExpr(
            filter(
                forIn(initialBuilderState, COL.topicSections, 'topic'),
                'topic.name == @name'
            ),
            'topic',
        ));
    const finalQuery = {
        query: builder.query,
        bindVars: { ...builder.bindVars, name: topicSectionName }
    };
    const { data } = await queryArangoDB(arangodb, finalQuery);
    return data.length > 0 ? true : false;
}

export const updateTopicSection = async (
    arangodb: Database,
    topicSectionId: string,
    body: any,
): Promise<any> => {
    const builder = build(
        update(initialBuilderState, '@_key', COL.topicSections, '@body')
    );
    const finalQuery = {
        query: builder.query,
        bindVars: { ...builder.bindVars, _key: topicSectionId, body: body }
    };
    await queryArangoDB(arangodb, finalQuery);
    return 'Topic Updated!';
}
