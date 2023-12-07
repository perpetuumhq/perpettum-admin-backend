import { Database } from "arangojs";
import { COL } from "../../constants/const";
import queryArangoDB from "../../helpers/arango_helpers/queryArangoDB";
import { build, create, filter, forIn, initialBuilderState, returnExpr, update } from "../../helpers/arango_helpers/dymamicArangoQuery";


export const allCampuses = async (
    arangodb: Database,
): Promise<any> => {
    const builder = build(
        returnExpr(
            forIn(initialBuilderState, COL.campuses, 'topicSection'),
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

export const createCampus = async (
    arangodb: Database,
    body: any,
): Promise<any> => {

    const alreadyExist = await doesExistCampus(arangodb, body.name);
    if (alreadyExist) {
        throw new Error('Campus Name Already Exists!');
    }
    const builder = build(
        create(initialBuilderState, COL.campuses)
    );
    const finalQuery = {
        query: builder.query,
        bindVars: { ...builder.bindVars, body: body }
    };
    await queryArangoDB(arangodb, finalQuery);
    return 'New Campus Created!';
}

// topicSectionName already exists or not

export const doesExistCampus = async (
    arangodb: Database,
    topicSectionName: string,
): Promise<any> => {
    const builder = build(
        returnExpr(
            filter(
                forIn(initialBuilderState, COL.campuses, 'topic'),
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

export const updateCampus = async (
    arangodb: Database,
    topicSectionId: string,
    body: any,
): Promise<any> => {
    const builder = build(
        update(initialBuilderState, '@_key', COL.campuses, '@body')
    );
    const finalQuery = {
        query: builder.query,
        bindVars: { ...builder.bindVars, _key: topicSectionId, body: body }
    };
    await queryArangoDB(arangodb, finalQuery);
    return 'Topic Updated!';
}
