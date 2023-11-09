import { Database } from "arangojs";
import { COL, EDGE_COL } from "../../constants/const";
import { build, create, filterGroup, forIn, initialBuilderState, remove, returnExpr, update, limitExpr, filter } from "../../helpers/arango_helpers/dymamicArangoQuery";
import queryArangoDB from "../../helpers/arango_helpers/queryArangoDB";

export const allBumps = async (
    arangodb: Database,
    prevPage: string,
    limit: any
): Promise<any> => {
    const builder = build(
        returnExpr(
            limitExpr(
                forIn(initialBuilderState, COL.bumps, 'bump'),
                prevPage,
                limit),
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

export const allMyBumps = async (
    arangodb: Database,
    userId: string,
    prevPage: string,
    limit: any,
    bumpStatus: string
): Promise<any> => {
    const builder = build(
        returnExpr(
            filter(filter(
                limitExpr(
                    forIn(initialBuilderState, COL.bumps, 'bump'),
                    prevPage,
                    limit),
                "bump.createdBy == @userId"), "bump.bumpStatus == @bumpStatus"),

            'bump'
        )

    );
    const finalQuery = {
        query: builder.query,
        bindVars: {
            ...builder.bindVars,
            userId,
            bumpStatus,
        }
    };
    const { data, count } = await queryArangoDB(arangodb, finalQuery);
    return { data, count };
}

export const repCreatedBumps = async (
    arangodb: Database,
    userId: string,
    prevPage: string,
    limit: any,
    bumpStatus: string
): Promise<any> => {
    let query = `LET reps = ( FOR edge IN ${EDGE_COL.adminRep}  FILTER edge._from == CONCAT('${COL.users}/', @userId) LET cleanId = SPLIT(edge._to, '/')[1] RETURN cleanId ) FOR bump IN ${COL.bumps} LIMIT @prevPage, @limit FILTER bump.createdBy IN reps FILTER bump.bumpStatus == @bumpStatus RETURN bump`
    userId = `${COL.users}/` + userId
    const finalQuery = {
        query: query,
        bindVars: {
            userId,
            prevPage,
            limit,
            bumpStatus,
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
    userId: string,
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

export const fetchCampusService = async (
    arangodb: Database,
    userKey: string,
    campusName: string,
    prevPage: string,
    limit: any
): Promise<any> => {
    const maxDistances = [5, 10, 20, 50, 100]
    const userId = `${COL.users}/` + userKey;
    const query = `LET campusId = ( FOR edge IN ${EDGE_COL.campusRepresentative} FILTER edge._to == @userId RETURN edge._from )[0] LET campusLocation = (  FOR campus IN ${COL.campus}  FILTER campus._id == campusId RETURN campus.location  )[0] LET maxDistances = @maxDistances  FOR campus IN ${COL.campus} FILTER ANALYZER(campus.campusName LIKE CONCAT("${campusName}", '%'), 'textAnalyzer') LIMIT @prevPage, @limit LET distance = DISTANCE(campusLocation.latitude, campusLocation.longitude, campus.location.latitude, campus.location.longitude) LET distanceCategory = ( FOR i IN 0..LENGTH(maxDistances) - 1 FILTER distance <= maxDistances[i] RETURN CONCAT('under',maxDistances[i], 'km')  )[0] || 'over100km' COLLECT category = distanceCategory INTO groupedCampuses  RETURN { distanceCategory: category, campuses:groupedCampuses }`
    const finalQuery = {
        query: query,
        bindVars: {
            userId,
            maxDistances,
            prevPage,
            limit,
        }
    };
    const { data } = await queryArangoDB(arangodb, finalQuery);

    if (!data?.length) {
        throw new Error('Unable to fetch campus');
    }
    return data
}