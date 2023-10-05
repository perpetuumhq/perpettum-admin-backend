import { Database } from "arangojs";


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
    }
}
export default queryArangoKVStore;