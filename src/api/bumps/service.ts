import { Database } from "arangojs";
import { COL } from "../../constants/const";
import { build, create, forIn, initialBuilderState, returnExpr } from "../../helpers/arango_helpers/dymamicArangoQuery";
import queryArangoDB from "../../helpers/arango_helpers/queryArangoDB";

export const allBumps = async (
    arangodb: Database
): Promise<any> => {
    const builder = build(
        returnExpr(
            forIn(initialBuilderState, COL.bumps, 'bump'),
            'bump'
        )
    );
    const finalQuery = {
        query: builder.query,
        bindVars: {
            ...builder.bindVars,
        }
    };
    const { data, count } = await queryArangoDB(arangodb, finalQuery);
    return { data, count };
}

export const createBump = async (
    arangodb: Database,
    body: any,
): Promise<any> => {
    const builder = build(
        create(initialBuilderState, COL.bumps)
    );
    const finalQuery = {
        query: builder.query,
        bindVars: { ...builder.bindVars, body: body }
    };
    await queryArangoDB(arangodb, finalQuery);
    return 'New Topic Created!';
}