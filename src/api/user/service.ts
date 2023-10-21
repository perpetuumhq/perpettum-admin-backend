import {
    build,
    returnExpr,
    filter,
    forIn,
    initialBuilderState,
    update,
    create,
    exists
} from '../../helpers/arango_helpers/dymamicArangoQuery';
import queryArangoDB from '../../helpers/arango_helpers/queryArangoDB';
import { COL } from '../../constants/const';
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

export const createUser = async (
    arangodb: Database,
    body: any,
): Promise<any> => {
    const builder = build(
        returnExpr(
            create(initialBuilderState, COL.users),
            'NEW'
        )
    );
    const finalQuery = {
        query: builder.query,
        bindVars: { ...builder.bindVars, body: body }
    };
    const { data } = await queryArangoDB(arangodb, finalQuery);
    if (!data?.length) {
        throw new Error('Unable to create user');
    }
    return data[0]
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
