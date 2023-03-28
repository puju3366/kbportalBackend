"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jwt = void 0;
const jwt = require("jsonwebtoken");
const userUtils_1 = require("../v1/modules/user/userUtils");
const tokens = [];
const userUtils = new userUtils_1.UserUtils();
class Jwt {
    /*
    * getAuthToken
    */
    static getAuthToken(data) {
        return jwt.sign(data, process.env.JWT_SECRET);
    }
    /*
    * decodeAuthToken
    */
    static decodeAuthToken(token) {
        if (token) {
            try {
                return jwt.verify(token, process.env.JWT_SECRET);
            }
            catch (error) {
                return false;
            }
        }
        return false;
    }
}
exports.Jwt = Jwt;
//# sourceMappingURL=jwt.js.map