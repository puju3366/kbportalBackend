"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./helpers/logger");
const admin = require("firebase-admin");
exports.default = () => {
    const firebaseInit = () => __awaiter(void 0, void 0, void 0, function* () {
        const logger = logger_1.Log.getLogger();
        try {
            const serviceAccount = require("../src/config/serviceAccountKey.json");
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                databaseURL: "https://orlando-predators-35d13-default-rtdb.firebaseio.com"
            });
        }
        catch (err) {
            logger.info(`Firebase initializeApp Error: ${err}`);
            return process.exit(1);
        }
    });
    firebaseInit();
};
//# sourceMappingURL=firebase.js.map