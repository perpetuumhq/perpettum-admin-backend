import { Database } from "arangojs";
import { COL } from "../../constants/const";
import { build, create, filterGroup, forIn, initialBuilderState, remove, returnExpr, update } from "../../helpers/arango_helpers/dymamicArangoQuery";
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

export const updateBump = async (
    arangodb: Database,
    id: string,
    body: any,
): Promise<any> => {
    const builder = build(
        returnExpr(
            update(
                initialBuilderState,
                '@id',
                COL.bumps,
                '@body'
            ),
            'NEW'
        )
    );

    const finalQuery = {
        query: builder.query,
        bindVars: { ...builder.bindVars, id: id, body: body }
    };

    await queryArangoDB(arangodb, finalQuery);
    return 'Bump Updated!';
}

export const deleteBumps = async (
    arangodb: Database,
    body: any,
): Promise<any> => {
    const builder = build(
        remove(
            filterGroup(
                forIn(initialBuilderState, COL.bumps, 'room'),
                [
                    `room._key IN @ids`
                ]
            ),
            'room',
            COL.bumps
        )
    );

    const finalQuery = {
        query: builder.query,
        bindVars: { ...builder.bindVars, ids: body.ids }
    };

    await queryArangoDB(arangodb, finalQuery);

}