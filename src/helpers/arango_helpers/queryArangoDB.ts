import { Database } from "arangojs";

type arangoQuery = {
    query: string,
    bindVars: { [key: string]: any };
}

export default async function queryArangoDB(arangodb: Database, query: arangoQuery, count = false): Promise<any | null> {
    try {
        const res: any = await arangodb.query(query.query, query.bindVars);
        return {
            data: res?._result || [],
            hasMore: res?._hasMore,
            ...(count && { count: res?._result?.length > 0 ? res?._count : 0 }),
        }
    } catch (err) {
        console.log(err);
        return null;
    }
}