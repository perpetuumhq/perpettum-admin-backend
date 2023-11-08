import {
    build,
    returnExpr,
    filter,
    forIn,
    initialBuilderState,
    update,
    create,
    bulkCreate,
    mergeExpr,
    limitExpr,
    remove,
} from '../../helpers/arango_helpers/dymamicArangoQuery';
import queryArangoDB from '../../helpers/arango_helpers/queryArangoDB';
import { COL, EDGE_COL } from '../../constants/const';
import { Database } from 'arangojs';

export const fetchAllCampusService = async (
    arangodb: Database,
    campusName:string,
    prevPage: string, limit: any
): Promise<any> => {
    const builder = build(
        mergeExpr(
            limitExpr(
                forIn(initialBuilderState, COL.campus, 'campus'),
                prevPage,
                limit),
            () => `FILTER ANALYZER(campus.campusName LIKE CONCAT("${campusName}", '%'), 'textAnalyzer') LET campusRepresentativesEdges = ( FOR edge IN ${EDGE_COL.campusRepresentative} FILTER edge._from == campus._id RETURN edge._to ) LET verifiedCount = LENGTH(FOR representativeId IN  campusRepresentativesEdges FOR representative IN ${COL.users} FILTER representative._id == representativeId && representative.verified == true RETURN 1 ) LET unverifiedCount = LENGTH( FOR representativeId IN campusRepresentativesEdges FOR representative IN ${COL.users} FILTER representative._id == representativeId && representative.verified != true RETURN 1 ) RETURN {campus: { collegeName:campus.campusName, displayName:campus.displayName, status:campus.status}, verifiedCount: verifiedCount,unverifiedCount: unverifiedCount}`
        )
    );
    let finalQuery = {
        query: builder.query,
        bindVars: {
            ...builder.bindVars,
        }
    };
    const { data } = await queryArangoDB(arangodb, finalQuery);

    if (!data?.length) {
        throw new Error('Unable to fetch representatives');
    }
    return data
}

export const fetchCampusService = async (
    arangodb: Database,
    campusId: string,
): Promise<any> => {
    const builder = build(
        mergeExpr(
            filter(
                forIn(initialBuilderState, COL.campus, 'campus'),
                'campus._key == @campusId'
            ),
            () => ` LET campusRepresentativesEdges = ( FOR edge IN ${EDGE_COL.campusRepresentative} FILTER edge._from == campus._id RETURN edge._to ) LET representatives = ( FOR representativeId IN campusRepresentativesEdges FOR representative IN ${COL.users} FILTER representative._id == representativeId RETURN representative )RETURN {campus: campus,representatives: representatives}`
        )
    );
    let finalQuery = {
        query: builder.query,
        bindVars: {
            ...builder.bindVars,
            campusId,
        }
    };
    const { data } = await queryArangoDB(arangodb, finalQuery);

    if (!data?.length) {
        throw new Error('Unable to fetch representatives');
    }
    return data[0]
}

export const createCampusService = async (
    arangodb: Database,
    requestBody: any,
): Promise<any> => {
    let builder = build(
        returnExpr(
            filter(
                forIn(initialBuilderState, COL.campus, 'campus'),
                `campus.displayName == @displayName OR campus.campusName == @campusName `
            ),
            'campus'
        )
    );
    const campusQuery = {
        query: builder.query,
        bindVars: { ...builder.bindVars, displayName: requestBody["displayName"], campusName: requestBody["campusName"] }
    };

    const campusData = await queryArangoDB(arangodb, campusQuery);
    if (campusData.data?.length) {
        throw new Error('Campus already exists');
    }

    const { representatives, ...body } = requestBody;
    builder = build(
        returnExpr(
            bulkCreate(initialBuilderState, "@representatives", COL.users),
            'NEW._id'
        )
    );

    const representativesQuery = {
        query: builder.query,
        bindVars: { ...builder.bindVars, representatives: requestBody.representatives }
    };

    let { data } = await queryArangoDB(arangodb, representativesQuery);
    if (!data?.length) {
        throw new Error('Unable to add representatives');
    }
    const representativesId = data

    builder = build(
        returnExpr(
            create(initialBuilderState, COL.campus),
            'NEW._id'
        )
    );
    const finalQuery = {
        query: builder.query,
        bindVars: { ...builder.bindVars, body }
    };
    const campusResponse = await queryArangoDB(arangodb, finalQuery);

    if (!campusResponse.data?.length) {
        throw new Error('Unable to create campus');
    }
    const campusId = campusResponse.data[0];

    const adminRep = representativesId.map((representativeId: string) => {
        return {
            _from: "test_admin_users/"+requestBody["createdBy"],
            _to: representativeId,
        };
    });
    builder = build(
        returnExpr(
            bulkCreate(initialBuilderState, "@adminRep", EDGE_COL.adminRep),
            'NEW._id'
        )
    );

    const adminRepQuery = {
        query: builder.query,
        bindVars: { ...builder.bindVars, adminRep: adminRep }
    };
    const adminRepRelation = await queryArangoDB(arangodb, adminRepQuery);
    if (!adminRepRelation.data?.length) {
        throw new Error('Unable to add representatives');
    }

    const edgeDocuments = representativesId.map((representativeId: string) => {
        return {
            _from: campusId,
            _to: representativeId,
        };
    });
    builder = build(
        returnExpr(
            bulkCreate(initialBuilderState, "@campusRepresentativesQuery", EDGE_COL.campusRepresentative),
            'NEW._id'
        )
    );

    const campusRepresentativesQuery = {
        query: builder.query,
        bindVars: { ...builder.bindVars, campusRepresentativesQuery: edgeDocuments }
    };
    const campusRepresentativeRelation = await queryArangoDB(arangodb, campusRepresentativesQuery);
    if (!campusRepresentativeRelation.data?.length) {
        throw new Error('Unable to add representatives');
    }
    return campusRepresentativeRelation.data[0]
}

export const updateCampusService = async (
    arangodb: Database,
    requestBody: any,
): Promise<any> => {
    const { representatives, campusKey, ...body } = requestBody;
    let builder = build(
        returnExpr(
            bulkCreate(initialBuilderState, "@representatives", COL.users),
            'NEW._id'
        )
    );

    const representativesQuery = {
        query: builder.query,
        bindVars: { ...builder.bindVars, representatives: requestBody.representatives }
    };

    let { data } = await queryArangoDB(arangodb, representativesQuery);
    if (!data?.length) {
        throw new Error('Unable to add representatives');
    }
    const representativesId = data

    builder = build(
        returnExpr(
            update(initialBuilderState, "@campusKey", COL.campus, "@body"),
            'NEW._id'
        )
    );
    const finalQuery = {
        query: builder.query,
        bindVars: { ...builder.bindVars, body, campusKey }
    };
    const campusResponse = await queryArangoDB(arangodb, finalQuery);

    if (!campusResponse.data?.length) {
        throw new Error('Unable to create campus');
    }
    const campusId = campusResponse.data[0]
    const edgeDocuments = representativesId.map((representativeId: string) => {
        return {
            _from: campusId,
            _to: representativeId,
        };
    });
    builder = build(
        returnExpr(
            bulkCreate(initialBuilderState, "@campusRepresentativesQuery", EDGE_COL.campusRepresentative),
            'NEW._id'
        )
    );
    const campusRepresentativesQuery = {
        query: builder.query,
        bindVars: { ...builder.bindVars, campusRepresentativesQuery: edgeDocuments }
    };
    const campusRepresentativeRelation = await queryArangoDB(arangodb, campusRepresentativesQuery);
    if (!campusRepresentativeRelation.data?.length) {
        throw new Error('Unable to add representatives');
    }
    return campusRepresentativeRelation.data[0]
}

export const removeRep = async (
    arangodb: Database,
    repId: any,
): Promise<any> => {
    let builder = build(
        returnExpr(
            remove(
                filter(
                    forIn(initialBuilderState, EDGE_COL.campusRepresentative, 'campusRepresentative'),
                    `campusRepresentative._to == @repId`
                ),
                'campusRepresentative',
                EDGE_COL.campusRepresentative
            ),
            "OLD"
        )
    );

    const representativesQuery = {
        query: builder.query,
        bindVars: { ...builder.bindVars, repId: repId }
    };
    const { data } = await queryArangoDB(arangodb, representativesQuery);

    if (!data?.length) {
        throw new Error('Unable to delete representatives');
    }

    builder = build(
        returnExpr(
            remove(
                filter(
                    forIn(initialBuilderState, COL.users, 'representatives'),
                    `representatives._id == @repId`
                ),
                'representatives',
                COL.users
            ), "OLD")
    );

    const representativesRemovalQuery = {
        query: builder.query,
        bindVars: { ...builder.bindVars, repId: repId }
    };

    const representativesRemovalData = await queryArangoDB(arangodb, representativesRemovalQuery);

    if (!representativesRemovalData.data?.length) {
        throw new Error('Unable to remove representative data');
    }
    return
}
