import { Database } from "arangojs";
import { COL, EDGE_COL } from "../../constants/const";
import { build, create, filterGroup, forIn, initialBuilderState, remove, returnExpr, update,limitExpr, filter } from "../../helpers/arango_helpers/dymamicArangoQuery";
import queryArangoDB from "../../helpers/arango_helpers/queryArangoDB";

export const allBumps = async (
    arangodb: Database,
    prevPage: string,
    limit:any
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

export const fetchCampusService = async (
    arangodb: Database,
    userKey: string,
): Promise<any> => {
    const  query = `LET campusRepresentativesEdges = (FOR edge IN test_campus_representative FILTER edge._to == @userId RETURN edge._from) LET campusRep = (FOR edge IN test_campus FILTER edge._to == @userId RETURN edge._from)
    LET nearby5KmCampuses = (FOR campusId IN campusRepresentativesEdges LET repCampus = (FOR campus IN test_campus FILTER campus._id == campusId RETURN campus)FOR campus IN test_campus LET distance = DISTANCE(campus.location.latitude, campus.location.longitude, repCampus.location.latitude, repCampus.location.longitude) FILTER distance <= 5  and campus._id != campusId RETURN campus)  LET nearby10KmCampuses = (FOR campusId IN campusRepresentativesEdges LET repCampus = (FOR campus IN test_campus FILTER campus._id == campusId RETURN campus)FOR campus IN test_campus LET distance = DISTANCE(campus.location.latitude, campus.location.longitude, repCampus.location.latitude, repCampus.location.longitude) FILTER distance <= 10 and distance>5 and campus._id != campusId RETURN campus) RETURN { nearby5KmCampuses: nearby5KmCampuses,nearby10KmCampuses:nearby10KmCampuses }`
    const userId = "test_representatives/"+userKey;

    let finalQuery = {
        query: query,
        bindVars: {
            userId,
        }
    };
    const { data } = await queryArangoDB(arangodb, finalQuery);

    if (!data?.length) {
        throw new Error('Unable to fetch representatives');
    }
    return data[0]
}