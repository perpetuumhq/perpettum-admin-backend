import { Database } from 'arangojs';
import { ARANGO_DB_NAME, ARANGO_DB_PASSWORD, ARANGO_DB_URL, ARANGO_DB_USERNAME } from './config';


const connectArangoDB = async () => {
    const db = new Database({ url: ARANGO_DB_URL });
    db.useDatabase(ARANGO_DB_NAME);  // _system is default for arangodb community edition
    db.useBasicAuth(ARANGO_DB_USERNAME, ARANGO_DB_PASSWORD);  // Use the appropriate username and password
    return db;
};

export default connectArangoDB;