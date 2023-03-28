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
exports.UserMiddleware = void 0;
const Sql = require("jm-ez-mysql");
const tables_1 = require("../../../config/tables");
const utils_1 = require("../../../helpers/utils");
const responseBuilder_1 = require("../../../helpers/responseBuilder");
const constants_1 = require("../../../config/constants");
class UserMiddleware {
    constructor() {
        this.checkMobileNumberExists = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const user = yield Sql.query(`SELECT count(u.id) as count FROM users AS u
    WHERE u.phone_number LIKE '%${req.body.phone_number}%' AND deleted = 0 AND status = 1`);
            if (user[0].count > 0) {
                res.status(constants_1.Constants.BAD_REQ).json(responseBuilder_1.ResponseBuilder.getErrorResponse({}, req.t("ERR_MOBILE_ALREADY_EXISTS"), constants_1.Constants.BAD_REQ));
            }
            else {
                next();
            }
        });
        this.checkEmailExists = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const email = req.body.email;
            const user = yield Sql.query(`SELECT count(u.id) as count FROM users AS u
    WHERE u.email LIKE '${email}' AND deleted = 0 AND status = 1`);
            if (user[0].count > 0) {
                res.status(constants_1.Constants.BAD_REQ).json(responseBuilder_1.ResponseBuilder.getErrorResponse({}, req.t("ERR_EMAIL_ALREADY_EXISTS"), constants_1.Constants.BAD_REQ));
            }
            else {
                next();
            }
        });
        this.IsUserExists = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const customer = yield Sql.first(tables_1.Tables.USERS, ["*"], `email = ? and status != 2`, [req.body.email]);
            if (customer) {
                if (!customer.status) {
                    res.status(constants_1.Constants.UNAUTHORIZED).json(responseBuilder_1.ResponseBuilder.getErrorResponse({}, req.t("INACTIVE_USER"), constants_1.Constants.UNAUTHORIZED));
                }
                else {
                    next();
                }
            }
            else {
                res.status(constants_1.Constants.NOT_FOUND).json(responseBuilder_1.ResponseBuilder.getErrorResponse({}, req.t("USER_NOT_EXISTS"), constants_1.Constants.NOT_FOUND));
            }
        });
        this.IsUserRegistered = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const customer = yield Sql.query(`SELECT * FROM ${tables_1.Tables.USERS} WHERE email = '${req.body.email}' and status= 1`);
            if (customer && customer.length > 0) {
                // if (!customer[0].email) {
                // res.status(401).json({ error: req.t("CONFIRM_EMAIL")});
                // } else {
                next();
                // }
            }
            else {
                res.status(404).json({ error: req.t("USER_NOT_EXISTS") });
            }
        });
        this.IsUserInactive = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const customer = yield Sql.query(`SELECT * FROM ${tables_1.Tables.USERS} WHERE email = '${req.body.email}' and  status = 1`);
            if (customer && customer.length > 0) {
                next();
            }
            else {
                res.status(404).json({ error: req.t("INACTIVE_USER") });
            }
        });
        this.IsUserExistsInSignUp = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (req.body && ((_a = req.body) === null || _a === void 0 ? void 0 : _a.flag) == true) {
                next();
            }
            else {
                const customer = yield Sql.first(tables_1.Tables.USERS, ["*"], `email = ? and status != 2`, [req.body.email]);
                if (customer) {
                    if (!customer.status) {
                        res.status(constants_1.Constants.UNAUTHORIZED).json(responseBuilder_1.ResponseBuilder.getErrorResponse({}, req.t("INACTIVE_USER"), constants_1.Constants.UNAUTHORIZED));
                    }
                    else {
                        res.status(constants_1.Constants.UNAUTHORIZED).json(responseBuilder_1.ResponseBuilder.getErrorResponse({}, req.t("USER_EXIST_SAME_EMAIL"), constants_1.Constants.UNAUTHORIZED));
                    }
                }
                else {
                    next();
                }
            }
        });
        this.verifyOldPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (req.body.newPassword !== req.body.confirmPassword) {
                res.status(constants_1.Constants.BAD_REQ).json(responseBuilder_1.ResponseBuilder.getErrorResponse({}, req.t("CONFIRM_PASSWORD_NOT_MATCH"), constants_1.Constants.BAD_REQ));
            }
            else {
                const result = yield Sql.first(tables_1.Tables.USERS, ["password"], "id = ?", [req._user.id]);
                const comparePassword = yield utils_1.Utils.compareEncryptedText(req.body.oldPassword, result.password);
                if (comparePassword) {
                    next();
                }
                else {
                    res.status(constants_1.Constants.BAD_REQ).json(responseBuilder_1.ResponseBuilder.getErrorResponse({}, req.t("OLD_PASSWORD_WRONG"), constants_1.Constants.BAD_REQ));
                }
            }
        });
        //Below middleware is for checking if mobile no is registered or not
        this.isMobileRegistered = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const user = yield Sql.first(tables_1.Tables.USERS, ["*"], `mobile = ?`, [req.body.mobile]);
            if (user && user.isBlock === 0) {
                next();
            }
            else if (user.isBlock === 1) {
                res.status(constants_1.Constants.NOT_FOUND).json(responseBuilder_1.ResponseBuilder.getErrorResponse({}, req.t("INACTIVE_USER"), constants_1.Constants.NOT_FOUND));
            }
            else {
                res.status(constants_1.Constants.NOT_FOUND).json(responseBuilder_1.ResponseBuilder.getErrorResponse({}, req.t("MOBILE_NOT_REGISTERED"), constants_1.Constants.NOT_FOUND));
            }
        });
        this.isEmailRegistered = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const user = yield Sql.first(tables_1.Tables.USERS, ["*"], `email = ? and status != 2`, [req.body.email]);
            if (user && user.status === 1) {
                // User not verified yet
                if (user.isVerified === 1) {
                    next();
                }
                else {
                    const response = responseBuilder_1.ResponseBuilder.getErrorResponse({}, req.t("USER_NOT_VERIFIED"), constants_1.Constants.FORBIDDEN);
                    res.status(constants_1.Constants.FORBIDDEN).json(response);
                }
            }
            else if (user.status === 0) {
                const response = responseBuilder_1.ResponseBuilder.getErrorResponse({}, req.t("INACTIVE_USER"), constants_1.Constants.FORBIDDEN);
                res.status(constants_1.Constants.FORBIDDEN).json(response);
            }
            else {
                const response = responseBuilder_1.ResponseBuilder.getErrorResponse({}, req.t("EMAIL_NOT_REGISTERED"), constants_1.Constants.NOT_FOUND);
                res.status(constants_1.Constants.NOT_FOUND).json(response);
            }
        });
        this.isEmailReg = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const user = yield Sql.first(tables_1.Tables.USERS, ["*"], `email = ?`, [req.body.email]);
            if (!user) {
                next();
            }
            else {
                const response = responseBuilder_1.ResponseBuilder.getErrorResponse({}, req.t("EMAIL_REGISTERED"));
                res.status(200).json(response);
            }
        });
        this.IsValidId = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (isNaN(req.params.id)) {
                res.status(constants_1.Constants.BAD_REQ).json(responseBuilder_1.ResponseBuilder.getErrorResponse({}, req.t("INVAILD_ID"), constants_1.Constants.BAD_REQ));
            }
            else {
                next();
            }
        });
    }
}
exports.UserMiddleware = UserMiddleware;
//# sourceMappingURL=userMiddleware.js.map