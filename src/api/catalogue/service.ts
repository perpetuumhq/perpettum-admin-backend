import { Database } from "arangojs";
import { COL, EDGE_COL } from "../../constants/const";
import { build, create, filterGroup, forIn, initialBuilderState, remove, returnExpr, update,limitExpr, filter } from "../../helpers/arango_helpers/dymamicArangoQuery";
import queryArangoDB from "../../helpers/arango_helpers/queryArangoDB";


export const createCatalogues = async (
    arangodb: Database,
    body: any,
): Promise<any> => {
    const builder = build(
        create(initialBuilderState, COL.catalogues)
    );
    const finalQuery = {
        query: builder.query,
        bindVars: { ...builder.bindVars, body: body }
    };
    await queryArangoDB(arangodb, finalQuery);
    return 'New Catalogue Created!';
}

export const updateCatalogue = async (
    arangodb: Database,
    id: string,
    body: any,
): Promise<any> => {
    const builder = build(
        returnExpr(
            update(
                initialBuilderState,
                '@id',
                COL.catalogues,
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
    return 'Catalogue Updated!';
}

export const fetchCatalogues = async (
    arangodb: Database,
    catalogueType: string,
    prevPage: string,
    limit:any
): Promise<any> => {
    const builder = build(
        returnExpr(
            filter(
            limitExpr(
                forIn(initialBuilderState, COL.catalogues, 'catalogues'),
                prevPage,
                limit),
                'catalogues.type == @catalogueType'
            ),
            'catalogues'
        )
    );

    let finalQuery = {
        query: builder.query,
        bindVars: {
            catalogueType,
        }
    };
    const { data } = await queryArangoDB(arangodb, finalQuery);

    if (!data?.length) {
        throw new Error('Unable to fetch catalogues');
    }
    return data
}