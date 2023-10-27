import {
    build,
    returnExpr,
    filter,
    forIn,
    initialBuilderState,
    update,
    create,
} from '../../helpers/arango_helpers/dymamicArangoQuery';
import queryArangoDB from '../../helpers/arango_helpers/queryArangoDB';
import { COL, EDGE_COL } from '../../constants/const';
import { Database } from 'arangojs';


export const doesUserAlreadyExistService = async (
    arangodb: Database,
    phone: string,
): Promise<boolean> => {
    const phoneNumberCheckBuilder = build(
        returnExpr(
            filter(
                forIn(initialBuilderState, COL.users, 'user'),
                `user.phone == @phoneNumber`
            ),
            'user'
        )
    );

    const phoneQuery = {
        query: phoneNumberCheckBuilder.query,
        bindVars: { ...phoneNumberCheckBuilder.bindVars, phoneNumber: phone }
    };

    const { data } = await queryArangoDB(arangodb, phoneQuery);

    return data && data?.length ? data[0] : null;
}

export const grantAccessService = async (
    arangodb: Database,
    userId: any,
    roomId: string,
    roles: string[],
): Promise<any> => {
    let builder = build(
        filter(
            forIn(initialBuilderState, EDGE_COL.userRole, 'edge'),
            'edge._from == @_from && edge._to == @_to'),
    );

    let finalQuery = {
        query: builder.query,
        bindVars: {
            ...builder.bindVars,
            _from: userId,
            _to: roomId,
        }
    };

    const { data } = await queryArangoDB(arangodb, finalQuery);
    if (!data?.length) {
        builder = build(
            returnExpr(
                create(initialBuilderState, EDGE_COL.userRole),
                'NEW'
            )
        );
        const bindVars = {
            ...builder.bindVars,
            _from: userId,
            _to: roomId,
            roles: roles
        };

        finalQuery = {
            query: builder.query,
            bindVars: bindVars,
        };
    } else {
        const relationKey = data[0]._key;
        const builder = build(
            returnExpr(
                update(
                    initialBuilderState,
                    '@userRoomRelationId',
                    EDGE_COL.userRole,
                    '@body'
                ),
                'NEW'
            )
        );
        const bindVars = {
            ...builder.bindVars,
            _from: userId,
            _to: roomId,
            roles: roles,
            userRoomRelationId: relationKey,
        };
        finalQuery = {
            query: builder.query,
            bindVars: bindVars,
        };
    }
    await queryArangoDB(arangodb, finalQuery);
    return
}

export const fetchAccess = async (
    arangodb: Database,
    userId: any,
): Promise<any> => {
    const builder = build(
        returnExpr(
            filter(
                forIn(initialBuilderState, EDGE_COL.userRole, 'relationData'),
                `relationData._from == @userId`
            ),
            'relationData'
        )
    );
    const finalQuery = {
        query: builder.query,
        bindVars: { ...builder.bindVars, userId }
    };
    const { data } = await queryArangoDB(arangodb, finalQuery);
    if (!data?.length) {
        throw new Error('Unable to fetch user access');
    }
    return data[0].roles
}

export const updateUser = async (
    arangodb: Database,
    userId: string,
    body: any,
): Promise<any> => {
    const builder = build(
        returnExpr(
            update(
                initialBuilderState,
                '@userId',
                COL.users,
                '@body'
            ),
            'NEW'
        )
    );

    const finalQuery = {
        query: builder.query,
        bindVars: {
            ...builder.bindVars, userId, body
        }
    };
    const { data } = await queryArangoDB(arangodb, finalQuery);

    if (!data?.length) {
        throw new Error('Unable to update user');
    }
    return data[0]
}
