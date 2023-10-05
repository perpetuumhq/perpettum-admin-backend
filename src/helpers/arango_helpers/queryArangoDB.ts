import { Database } from "arangojs";

type arangoQuery = {
    query: string,
    bindVars: { [key: string]: any };
}

export default async function queryArangoDB(arangodb: Database, query: arangoQuery): Promise<any | null> {
    try {
        const res: any = await arangodb.query(query.query, query.bindVars);

        return {
            data: res?._result,
            hasMore: res?._hasMore,
            ...(res?._count && { count: res?._count }),
        }
    } catch (err) {
        console.log(err);
        return null;
    }
}