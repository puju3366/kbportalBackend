import { Log } from "./helpers/logger";
import * as admin from "firebase-admin";

export default () => {
    const firebaseInit = async () => {
        const logger = Log.getLogger();
        try {
            const serviceAccount = require("../src/config/serviceAccountKey.json");
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                databaseURL: "https://orlando-predators-35d13-default-rtdb.firebaseio.com"
            });
        } catch (err) {
            logger.info(`Firebase initializeApp Error: ${err}`);
            return process.exit(1);
        }
    };
    firebaseInit();
};
