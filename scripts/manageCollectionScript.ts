// this is to migrate collection from arangodb
import { Database } from 'arangojs';
import { EDGE_COL,COL } from '../src/constants/const';
import { config } from 'dotenv';
config();

const { ARANGO_DB_URL, ARANGO_DB_NAME, ARANGO_DB_USERNAME, ARANGO_DB_PASSWORD } = process.env;

async function manageCollections() {
    const db = new Database({ url: ARANGO_DB_URL });
    await db.login(ARANGO_DB_USERNAME, ARANGO_DB_PASSWORD);
    const database = db.useDatabase(ARANGO_DB_NAME ?? "_system");

    // Get existing collections
    const existingCollections = await database.collections();
    const existingCollectionNames = [...existingCollections || []].map((col: any) => col.name);

    const objectValues = Object.values(COL);

    // Create missing collections
    for (const collectionName of objectValues) {
        if (!existingCollectionNames.includes(collectionName)) {
            console.log(`Creating collection: ${collectionName}`);
            await database.collection(collectionName).create();
        }
    }

    const edgesCollection = Object.values(EDGE_COL);

    // Create missing collections
    for (const collectionName of edgesCollection) {
        if (!existingCollectionNames.includes(collectionName)) {
            console.log(`Creating collection: ${collectionName}`);
            await database.collection(collectionName).create();
        }
    }
    // Delete extra collections
    for (const existingCollection of existingCollections) {
        if (!objectValues.includes(existingCollection.name)) {
            console.log(`Deleting collection: ${existingCollection.name}`);
            await existingCollection.drop();
        }
    }
}

manageCollections().catch(error => console.error(error));
