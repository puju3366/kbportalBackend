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
exports.UserUtils = void 0;
const Sql = require("jm-ez-mysql");
const tables_1 = require("../../../config/tables");
const responseBuilder_1 = require("../../../helpers/responseBuilder");
const utils_1 = require("../../../helpers/utils");
const constants_1 = require("../../../config/constants");
class UserUtils {
    addUserDetails(details) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Sql.insert(tables_1.Tables.USERS, details);
            }
            catch (err) {
                throw responseBuilder_1.ResponseBuilder.error(err);
            }
        });
    }
    addUserDeviceToken(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Sql.insert(tables_1.Tables.USERSDEVICE, data);
            }
            catch (err) {
                throw responseBuilder_1.ResponseBuilder.error(err);
            }
        });
    }
    // get User by email
    getUserByEmail(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let where = `email = '${data.email}'`;
                const user = yield Sql.first(tables_1.Tables.USERS, ["id", "first_name", "last_name", "email", "password", "isVerified", "status"], `status = 1 And deleted = 0 AND ${where}`);
                if (user) {
                    return responseBuilder_1.ResponseBuilder.data(user);
                }
                else {
                    return responseBuilder_1.ResponseBuilder.data({});
                }
            }
            catch (err) {
                throw responseBuilder_1.ResponseBuilder.error(err);
            }
        });
    }
    getTokenByuid(id, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield Sql.first(tables_1.Tables.USERSDEVICE, ["*"], "user_id = ? AND device_token = ?", [id, token]);
                if (user) {
                    return responseBuilder_1.ResponseBuilder.data(user);
                }
                else {
                    return responseBuilder_1.ResponseBuilder.notFound({});
                }
            }
            catch (err) {
                throw responseBuilder_1.ResponseBuilder.error(err);
            }
        });
    }
    getAllTokenBy() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield Sql.findAll(tables_1.Tables.USERSDEVICE, ["device_token"]);
                if (user) {
                    return responseBuilder_1.ResponseBuilder.data(user);
                }
                else {
                    return responseBuilder_1.ResponseBuilder.notFound({});
                }
            }
            catch (err) {
                throw responseBuilder_1.ResponseBuilder.error(err);
            }
        });
    }
    verifyOtp(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const userDetail = yield Sql.first(tables_1.Tables.USERS, ["id", "otp", "otp_created_at", "email", "isVerified"], "email = ? OR phone_number = ? ", [req.body.email_or_phn, req.body.email_or_phn]);
            if (userDetail) {
                if (userDetail.otp == req.body.otp) {
                    let ts1 = Math.floor(new Date(userDetail.otp_created_at).getTime());
                    if ((Date.now() - ts1) / 1000 <= 300) {
                        const updateRes = yield Sql.update(`${tables_1.Tables.USERS}`, { isVerified: 1, otp_created_at: null, otp: null }, "id = ? ", [userDetail.id]);
                        if (updateRes !== null || updateRes !== undefined) {
                            userDetail.message = "OTP Verified Successfully";
                            let userData = {
                                id: userDetail.id,
                                email: userDetail.email
                            };
                            return responseBuilder_1.ResponseBuilder.data(userData);
                        }
                        else {
                            return responseBuilder_1.ResponseBuilder.data({});
                        }
                    }
                    else {
                        return responseBuilder_1.ResponseBuilder.errorMessage(req.t("TIME_OUT"));
                    }
                }
                else {
                    return responseBuilder_1.ResponseBuilder.errorMessage(req.t("INVALID_OTP"));
                }
            }
            else {
                return responseBuilder_1.ResponseBuilder.errorMessage(req.t("EMAIL_NOT_REGISTERED"));
            }
        });
    }
    updateUserDetails(details, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Sql.updateFirst(tables_1.Tables.USERS, details, "id = ?", [id]);
            }
            catch (err) {
                throw responseBuilder_1.ResponseBuilder.error(err);
            }
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body.newPassword && req.body.email_or_phn) {
                if (req.body.newPassword !== req.body.confirmPassword) {
                    res.status(constants_1.Constants.BAD_REQ).json(responseBuilder_1.ResponseBuilder.getErrorResponse({}, req.t("CONFIRM_PASSWORD_NOT_MATCH"), constants_1.Constants.BAD_REQ));
                }
                else {
                    const hash = yield utils_1.Utils.encryptText(req.body.newPassword);
                    req.body.newPassword = hash;
                    let where = ` (email = '${req.body.email_or_phn}' OR phone_number = '${req.body.email_or_phn}' )`;
                    const user = yield Sql.first(tables_1.Tables.USERS, ["id", "first_name", "last_name", "email", "password", "phone_number", "isVerified", "status"], `status = 1 And deleted = 0 AND ${where}`);
                    if (user) {
                        req.body.updated_at = new Date();
                        const data = yield Sql.update(`${tables_1.Tables.USERS}`, { password: hash, updated_at: req.body.updated_at }, "id= ?", [user.id]);
                        const returnRes = {
                            id: user.id,
                            first_name: user.first_name,
                            last_name: user.last_name,
                            email: user.email,
                            password: user.password,
                            phone_number: user.phone_number,
                            status: user.status,
                            isVerified: user.isVerified,
                        };
                        return responseBuilder_1.ResponseBuilder.data(returnRes);
                    }
                    else {
                        return responseBuilder_1.ResponseBuilder.errorMessage(req.t("EMAIL_NOT_REGISTERED"));
                    }
                }
            }
            else {
                return responseBuilder_1.ResponseBuilder.errorMessage(req.t("EMAIL_MOBILE"));
            }
        });
    }
    updatePassword(password, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield Sql.update(tables_1.Tables.USERS, { password }, "id = ?", [userId]);
            return responseBuilder_1.ResponseBuilder.data({ data: data });
        });
    }
    getProfile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userProfile = yield Sql.first(`${tables_1.Tables.USERS}`, ["id", "first_name", "last_name", "email", "password", "status", "isVerified"], "id = ?", [id]);
            if (userProfile) {
                return responseBuilder_1.ResponseBuilder.data(userProfile);
            }
            else {
                return responseBuilder_1.ResponseBuilder.data({});
            }
        });
    }
    userVerification(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const userDetail = yield Sql.first(tables_1.Tables.USERS, ["id", "otp", "otp_created_at", "email", "isVerified"], "email = ? ", [req.body.email]);
            if (userDetail) {
                const updateRes = yield Sql.update(`${tables_1.Tables.USERS}`, { isVerified: req.body.isVerified }, "id = ? ", [userDetail.id]);
                if (updateRes !== null || updateRes !== undefined) {
                    userDetail.message = "Verified Successfully";
                    let userData = {
                        email: userDetail.email,
                        isVerified: req.body.isVerified,
                    };
                    return responseBuilder_1.ResponseBuilder.data(userData);
                }
                else {
                    return responseBuilder_1.ResponseBuilder.data({});
                }
            }
            else {
                return responseBuilder_1.ResponseBuilder.errorMessage("User is not verified, Please verify your account from email");
            }
        });
    }
}
exports.UserUtils = UserUtils;
//# sourceMappingURL=userUtils.js.map