import { Database } from "arangojs";
import { build, create, forIn, initialBuilderState, returnExpr, update } from "../../helpers/arango_helpers/dymamicArangoQuery";
import { COL } from "../../constants/const";
import queryArangoDB from "../../helpers/arango_helpers/queryArangoDB";


export const allTemplates = async (
    arangodb: Database,
): Promise<any> => {

    const builder = build(
        returnExpr(
            forIn(initialBuilderState, COL.notificationTemplates, 'template'),
            'template'
        )
    );
    const finalQuery = {
        query: builder.query,
        bindVars: {
            ...builder.bindVars,
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
        create(initialBuilderState, COL.notificationTemplates)
    );
    const finalQuery = {
        query: builder.query,
        bindVars: { ...builder.bindVars, body: body }
    };
    await queryArangoDB(arangodb, finalQuery);
    return 'New Template Created!';
}

export const updateTopic = async (
    arangodb: Database,
    templateId: string,
    body: any,
): Promise<any> => {
    const builder = build(
        update(initialBuilderState, '@_key', COL.notificationTemplates, '@body')
    );
    const finalQuery = {
        query: builder.query,
        bindVars: { ...builder.bindVars, _key: templateId, body: body }
    };
    await queryArangoDB(arangodb, finalQuery);
    return 'Template Updated!';
}
