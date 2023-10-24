import { Database } from "arangojs";
import { asyncForEach } from "../asyncForEach";


const queryArangoKVStore = {
    async set(db: Database, col: string, key: string, value: any) {
        const collection = db.collection(col);
        try {
            await collection.save({ _key: key, ...value });
        } catch (e) {
            if (e?.isArangoError && e?.errorNum === 1210) {
                // Unique constraint violation (document with the key already exists)
                await collection.update(key, { ...value });
            } else {
                throw e;
            }
        }
    },

    async get(db: Database, col: string, key: string) {
        const collection = db.collection(col);

        try {
            const doc = await collection.document(key);
            return doc?.value || doc;
        } catch (e) {
            if (e.isArangoError && e.errorNum === 1202) {
                // Document not found
                return null;
            }
            throw e;
        }
    },

    async existsMany(db: Database, items: { col: string, key: string }[]): Promise<boolean[]> {
        const results: boolean[] = [];
        await asyncForEach(items, async (item) => {
            const collection = db.collection(item.col);
            try {
                const doc = await collection.document(item.key);
                results.push(!!doc);

            } catch (e) {
                if (e.isArangoError && e.errorNum === 1202) {
                    // Document not found
                    results.push(false);
                } else {
                    throw e;
                }
            }
        });

        return results;
    },

}
export default queryArangoKVStore;