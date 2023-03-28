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
exports.Middleware = void 0;
const Sql = require("jm-ez-mysql");
const _ = require("lodash");
const jwt_1 = require("./helpers/jwt");
const tables_1 = require("./config/tables");
const user_1 = require("./helpers/user");
const responseBuilder_1 = require("./helpers/responseBuilder");
const constants_1 = require("./config/constants");
class Middleware {
    constructor() {
        this.user = new user_1.User();
        this.getUserAuthorized = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const authorization = req.headers['authorization'];
            if (authorization && !_.isEmpty(authorization)) {
                try {
                    let tokenInfo;
                    if (authorization && (authorization.split(' ')[0] === 'JWT'
                        || authorization.split(' ')[0] === 'Bearer')) {
                        tokenInfo = jwt_1.Jwt.decodeAuthToken(authorization.split(' ')[1]);
                    }
                    else if (req.session && req.session.token) {
                        tokenInfo = jwt_1.Jwt.decodeAuthToken(req.session.token);
                    }
                    if (tokenInfo) {
                        //query
                        const user = yield Sql.first(tables_1.Tables.USERS, ["id", "name", "last_name", "password", "email", "phone_number", "status"], "id = ?", [tokenInfo.userId]);
                        // await Sql.query(`SELECT u.status, ur.isVerified, u.first_name, u.last_name, u.id, u.email, u.phone, ur.id as role_id FROM users AS u
                        // LEFT JOIN users_roles_relation AS ur ON ur.user_id = u.id
                        // WHERE u.id = ${tokenInfo.userId}
                        // ORDER BY ur.created_at LIMIT 0, 1`)
                        if (user.length > 0) {
                            if (user[0].status == 0) {
                                const response = responseBuilder_1.ResponseBuilder.getErrorResponse({}, req.t("INACTIVE_USER"), constants_1.Constants.UNAUTHORIZED);
                                res.status(constants_1.Constants.UNAUTHORIZED).json(response);
                            }
                            else if (user[0].isVerified === 1) {
                                if (user[0].status == 1) {
                                    req._user = user[0];
                                    next();
                                }
                                else {
                                    const response = responseBuilder_1.ResponseBuilder.getErrorResponse({}, req.t("ERR_UNAUTH"), constants_1.Constants.UNAUTHORIZED);
                                    res.status(constants_1.Constants.UNAUTHORIZED).json(response);
                                    return;
                                }
                            }
                            else {
                                const response = responseBuilder_1.ResponseBuilder.getErrorResponse({}, req.t("USER_NOT_VERIFIED"), constants_1.Constants.PRECONDITION_FAILED);
                                res.status(constants_1.Constants.PRECONDITION_FAILED).json(response);
                                return;
                            }
                        }
                        else {
                            const response = responseBuilder_1.ResponseBuilder.getErrorResponse({}, req.t("ERR_UNAUTH"), constants_1.Constants.UNAUTHORIZED);
                            res.status(constants_1.Constants.UNAUTHORIZED).json(response);
                            return;
                        }
                    }
                    else {
                        const response = responseBuilder_1.ResponseBuilder.getErrorResponse({}, req.t("ERR_UNAUTH"), constants_1.Constants.UNAUTHORIZED);
                        res.status(constants_1.Constants.UNAUTHORIZED).json(response);
                        return;
                    }
                }
                catch (error) {
                    const response = responseBuilder_1.ResponseBuilder.getErrorResponse({}, req.t("ERR_INTERNAL_SERVER"), constants_1.Constants.INTERNAL_SERVER);
                    res.status(constants_1.Constants.INTERNAL_SERVER).json(response);
                    return;
                }
            }
            else {
                const response = responseBuilder_1.ResponseBuilder.getErrorResponse({}, req.t("ERR_UNAUTH"), constants_1.Constants.UNAUTHORIZED);
                res.status(constants_1.Constants.UNAUTHORIZED).json(response);
                return;
            }
        });
        this.checktoken = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { headers: { authorization }, } = req;
            if (authorization && (authorization.split(' ')[0] === 'JWT'
                || authorization.split(' ')[0] === 'Bearer')) {
                const token = jwt_1.Jwt.decodeAuthToken(authorization.split(' ')[1]);
                req.payload = token;
                next();
            }
            else if (req.session && req.session.token) {
                const token = jwt_1.Jwt.decodeAuthToken(req.session.token);
                req.payload = token;
                next();
            }
            else {
                return res.status(401).json({ error: req.t("TOKEN_NOT_FOUND") });
            }
        });
    }
}
exports.Middleware = Middleware;
//# sourceMappingURL=middleware.js.map