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
        returnExpr(
            create(initialBuilderState, COL.bumps),
            'NEW'
        )
    );
    const finalQuery = {
        query: builder.query,
        bindVars: { ...builder.bindVars, body: body }
    };
    const { data } = await queryArangoDB(arangodb, finalQuery);
    if (data.length === 0) throw new Error('Error creating new bump');

    return data[0];
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

    const { data } = await queryArangoDB(arangodb, finalQuery);
    if (data.length === 0) throw new Error('Error updating bump');
    return data[0];
}

export const deleteBumps = async (
    arangodb: Database,
    body: any,
): Promise<any> => {
    const builder = build(
        returnExpr(
            remove(
                filterGroup(
                    forIn(initialBuilderState, COL.bumps, 'room'),
                    [
                        `room._key IN @ids`
                    ]
                ),
                'room',
                COL.bumps
            ),
            'OLD'
        )
    );

    const finalQuery = {
        query: builder.query,
        bindVars: { ...builder.bindVars, ids: body.ids }
    };

    const { data } = await queryArangoDB(arangodb, finalQuery);
    return data[0]
}