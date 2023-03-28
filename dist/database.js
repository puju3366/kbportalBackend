"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = void 0;
const jmEzMySql = require("jm-ez-mysql");
class DB {
    static init() {
        jmEzMySql.init({
            acquireTimeout: 100 * 60 * 1000,
            connectTimeout: 100 * 60 * 1000,
            connectionLimit: 10000,
            database: process.env.DATABASE,
            dateStrings: true,
            host: process.env.DBHOST,
            port: process.env.DBPORT,
            multipleStatements: true,
            password: process.env.DBPASSWORD,
            timeout: 100 * 60 * 1000,
            timezone: "utc",
            user: process.env.DBUSER,
            charset: "utf8mb4"
        });
    }
}
exports.DB = DB;
//# sourceMappingURL=database.js.map