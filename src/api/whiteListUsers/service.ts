import { Database } from "arangojs";
import { COL } from "../../constants/const";
import queryArangoDB from "../../helpers/arango_helpers/queryArangoDB";
import { build, create, filter, forIn, initialBuilderState, joinMultiple, returnExpr, update } from "../../helpers/arango_helpers/dymamicArangoQuery";


export const allCampuses = async (
    arangodb: Database,
): Promise<any> => {
    const builder = build(
        returnExpr(
            joinMultiple(
                forIn(initialBuilderState, COL.whiteListUsers, 'topicSection'),
                'topicSection',
                [
                    { fieldName: 'campus', targetCollection: COL.campuses, joinType: 'oneToOne' },
                ]),
            `MERGE(topicSection, {
                campus: topicSection_campus[0].name
            })`,
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
    const alreadyExist = await doesExistCampus(arangodb, body.phone);
    if (alreadyExist) {
        throw new Error('Campus Name Already Exists!');
    }
    const builder = build(
        create(initialBuilderState, COL.whiteListUsers)
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
                forIn(initialBuilderState, COL.whiteListUsers, 'topic'),
                'topic.phone == @phone'
            ),
            'topic',
        ));
    const finalQuery = {
        query: builder.query,
        bindVars: { ...builder.bindVars, phone: topicSectionName }
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
        update(initialBuilderState, '@_key', COL.whiteListUsers, '@body')
    );
    const finalQuery = {
        query: builder.query,
        bindVars: { ...builder.bindVars, _key: topicSectionId, body: body }
    };
    await queryArangoDB(arangodb, finalQuery);
    return 'Topic Updated!';
}
