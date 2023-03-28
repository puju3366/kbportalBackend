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
exports.UserController = void 0;
const constants_1 = require("../../../config/constants");
const jwt_1 = require("../../../helpers/jwt");
const responseBuilder_1 = require("../../../helpers/responseBuilder");
const userUtils_1 = require("./userUtils");
const utils_1 = require("../../../helpers/utils");
const sendEmail_1 = require("../../../helpers/sendEmail");
const SendPushNotification_1 = require("../../../helpers/SendPushNotification");
const Data_1 = require("./Data");
const jwt_decode_1 = require("jwt-decode");
const xml2js = require("xml2js");
const jwt = require("jsonwebtoken");
const request = require('request');
// const node_local_storage = require("node-localstorage").LocalStorage;
const bcrypt = require("bcryptjs");
const banner_sponser = Data_1.banner_sponser1;
const match_schedule = Data_1.match_schedule1;
var fs = require('fs');
class UserController {
    constructor() {
        this.userUtils = new userUtils_1.UserUtils();
        this.utils = new utils_1.Utils();
        this.signup = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const input = req.body;
            input.password = yield utils_1.Utils.encryptText(input.password);
            input.otp = this.utils.createRandomcode(4, true);
            const device_token = req.headers["device_token"];
            if (!device_token) {
                const response = responseBuilder_1.ResponseBuilder.getErrorResponse({}, req.t("ADD_DIVICE_TOKEN"));
                res.status(constants_1.Constants.NOT_FOUND).json(response);
            }
            const userExist = yield this.userUtils.getUserByEmail(input);
            let response;
            if (!userExist.result.length) {
                const result = yield this.userUtils.addUserDetails(input);
                const deviceData = {
                    user_id: result.insertId,
                    device_token: device_token,
                };
                const device = yield this.userUtils.addUserDeviceToken(deviceData);
                const data = {
                    id: result.insertId,
                    first_name: userExist.result.first_name
                        ? userExist.result.first_name
                        : input.first_name,
                    last_name: userExist.result.last_name
                        ? userExist.result.last_name
                        : input.last_name,
                    email: userExist.result.email ? userExist.result.email : input.email,
                    password: userExist.result.password
                        ? userExist.result.password
                        : input.password,
                    status: userExist.result.status ? userExist.result.status : 1,
                    isVerified: userExist.result.isVerified
                        ? userExist.result.isVerified
                        : 0,
                };
                response = responseBuilder_1.ResponseBuilder.getSuccessResponse(data, req.t("SIGNUP_SUCCESS"));
            }
            else {
                response = responseBuilder_1.ResponseBuilder.getSuccessResponse({}, req.t("USER_EXIST_SAME_EMAIL"));
            }
            res.status(200).json(response);
        });
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { password } = req.body;
                const result = yield this.userUtils.getUserByEmail(req.body);
                const token = req.headers["device_token"];
                if (!token) {
                    const response = responseBuilder_1.ResponseBuilder.getErrorResponse({}, req.t("ADD_DIVICE_TOKEN"));
                    res.status(constants_1.Constants.NOT_FOUND).json(response);
                }
                if (result && result.result) {
                    const userData = result.result;
                    const verifyPassword = yield utils_1.Utils.compareEncryptedText(password, userData.password);
                    if (verifyPassword) {
                        const userDetails = userData;
                        let obj = {
                            id: userData.id,
                        };
                        userDetails.token = jwt_1.Jwt.getAuthToken(obj);
                        const tokenresult = yield this.userUtils.getTokenByuid(userData.id, token);
                        if (tokenresult.result == null && !tokenresult.result) {
                            const deviceData = {
                                user_id: userData.id,
                                device_token: token,
                            };
                            yield this.userUtils.addUserDeviceToken(deviceData);
                        }
                        const data = {
                            accessToken: "Bearer " + userDetails.token,
                            user: userDetails,
                            status: userDetails.status,
                        };
                        delete userDetails.usergroup;
                        delete userDetails.token;
                        const response = responseBuilder_1.ResponseBuilder.getSuccessResponse(data, req.t("LOGIN_SUCCESS"));
                        res.status(result.code).json(response);
                    }
                    else {
                        const response = responseBuilder_1.ResponseBuilder.getErrorResponse({}, req.t("INVALID_CREDENTIAL"));
                        res.status(constants_1.Constants.NOT_FOUND).json(response);
                    }
                }
                else {
                    const response = responseBuilder_1.ResponseBuilder.getErrorResponse({}, req.t("INVALID_CREDENTIAL"));
                    res.status(constants_1.Constants.NOT_FOUND).json(response);
                }
            }
            catch (error) {
                const response = responseBuilder_1.ResponseBuilder.getErrorResponse({}, req.t("INVALID_CREDENTIAL"));
                res.status(constants_1.Constants.NOT_FOUND).json(response);
                return;
            }
        });
        this.verifyOtp = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.userUtils.verifyOtp(req);
            if (result && result.result) {
                const response = responseBuilder_1.ResponseBuilder.getSuccessResponse(result.result, "OTP verified Successfully");
                res.status(result.code).json(response);
            }
            else {
                const response = responseBuilder_1.ResponseBuilder.getSuccessResponse({}, result.message);
                res.status(result.code).json(response);
            }
        });
        this.sendOTP = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const input = req.body;
            const items = yield this.userUtils.getUserByEmail(req.body);
            if (items.result) {
                const token = req.headers["device_token"];
                const tokenresult = yield this.userUtils.getTokenByuid(items.result.id, token);
                if (tokenresult.result == null && !tokenresult.result) {
                    const deviceData = {
                        user_id: items.result.id,
                        device_token: token,
                    };
                    yield this.userUtils.addUserDeviceToken(deviceData);
                }
                const otp = this.utils.createRandomcode(4, true);
                let sendToken = tokenresult.result
                    ? tokenresult.result.device_token
                    : token;
                const payloadFCM = {
                    notification: {
                        title: "Orlando predators",
                        body: `Dear ${input.first_name}, A temporary one-time 4 digit verification code has automatically been generated for you. Please authenticate using the verification code in the mobile app to proceed further. this otp is valid for 5 minutes. OTP is ${otp}`,
                    },
                };
                SendPushNotification_1.SendPushNotification.sendPushNotificationFirebase(sendToken, payloadFCM);
                const emailData = {
                    username: items.result.first_name,
                    one_time_password: otp,
                };
                sendEmail_1.SendEmail.sendRawMail("otp", emailData, [items.result.email], `Please confirm your email account`, "");
                const result = yield this.userUtils.updateUserDetails({ otp: otp }, items.result.id);
                const response = responseBuilder_1.ResponseBuilder.getSuccessResponse({}, req.t("EMAIL_SENT"));
                res.status(items.code).json(response);
            }
            else {
                const response = responseBuilder_1.ResponseBuilder.getSuccessResponse({}, req.t("EMAIL_NOT_REGISTERED"));
                res.status(items.code).json(response);
            }
        });
        // Reset Password
        this.resetPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.userUtils.resetPassword(req, res);
            if (result.result) {
                const response = responseBuilder_1.ResponseBuilder.getSuccessResponse(result.result, req.t("PASSWORD_RESETED"));
                res.status(result.code).json(response);
            }
            else {
                res.status(result.code).json(result);
            }
        });
        // update password
        this.updatePassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const input = req.body;
            input.newPassword = yield utils_1.Utils.encryptText(input.newPassword);
            const result = yield this.userUtils.updatePassword(input.newPassword, req._user.id);
            const response = responseBuilder_1.ResponseBuilder.getSuccessResponse({}, req.t("PASSWORD_UPDATED"));
            res.status(200).json(response);
        });
        this.getProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.userUtils.getProfile(req.params.id);
            if (result) {
                const response = responseBuilder_1.ResponseBuilder.getSuccessResponse(result.result, req.t("SUCCESS"));
                res.status(constants_1.Constants.OK).json(response);
            }
            else {
                res
                    .status(constants_1.Constants.NOT_FOUND)
                    .json(responseBuilder_1.ResponseBuilder.getErrorResponse({}, req.t("NO_RECORD_FOUND"), constants_1.Constants.NOT_FOUND));
            }
        });
        this.getMatchSchedule = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const response = responseBuilder_1.ResponseBuilder.getSuccessResponse(match_schedule, req.t("SUCCESS"));
            res.status(constants_1.Constants.OK).json(response);
        });
        this.getBannerSponser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const response = responseBuilder_1.ResponseBuilder.getSuccessResponse(banner_sponser, req.t("SUCCESS"));
            res.status(constants_1.Constants.OK).json(response);
        });
        this.getAllNotification = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.userUtils.getAllTokenBy();
            if (result) {
                var newToeknArr = [];
                for (let i = 0; i < result.result.length; i++) {
                    newToeknArr.push(result.result[i].device_token);
                }
                const payloadFCM = {
                    notification: {
                        title: "Orlando predators",
                        body: `${req.body.notification}`,
                    },
                };
                SendPushNotification_1.SendPushNotification.sendPushNotificationFirebase(newToeknArr, payloadFCM);
            }
            const response = responseBuilder_1.ResponseBuilder.getSuccessResponse({}, req.t("NOTIFICATION_SEND"));
            res.status(200).json(response);
        });
        this.userVerification = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.userUtils.userVerification(req);
            if (result && result.result) {
                const response = responseBuilder_1.ResponseBuilder.getSuccessResponse(result.result, "verified Successfully");
                res.status(result.code).json(response);
            }
            else {
                const response = responseBuilder_1.ResponseBuilder.getErrorResponse({}, result.message);
                res.status(result.code).json(response);
            }
        });
        this.adfslogin = (req, res) => {
            xml2js.parseString(req.body.wresult, { mergeAttrs: true }, (err, result) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    res.status(constants_1.Constants.INTERNAL_SERVER).json(responseBuilder_1.ResponseBuilder.getErrorResponse({}, req.t("ERR_INTERNAL_SERVER"), constants_1.Constants.INTERNAL_SERVER));
                }
                const jsonString = JSON.stringify(result, null, 4);
                const json = JSON.parse(jsonString);
                var useremail = 'default';
                useremail =
                    json["t:RequestSecurityTokenResponse"]["t:RequestedSecurityToken"][0]['saml:Assertion'][0]["saml:AttributeStatement"][0]["saml:Attribute"][0]["saml:AttributeValue"][0];
                if (useremail) {
                    request.post({
                        url: `${process.env.NODE_RBACK_LOGIN_API}`,
                        headers: {
                            "content-type": "application/json",
                            "origin": "https://kb.devitsandbox.com"
                        },
                        body: {
                            "email": useremail
                        },
                        json: true
                    }, (error, response, body) => __awaiter(this, void 0, void 0, function* () {
                        if (error) {
                            res.status(500).json({ errors: "something went wrong" });
                        }
                        if (response.statusCode == 200) {
                            var Decodetoken = jwt_decode_1.default(body.token);
                            fs.writeFile(`./localStorage/${Decodetoken.device_token.id}.txt`, body.menuToken, function (err) {
                                if (err)
                                    throw err;
                            });
                            res.cookie("logintoken", body.token);
                            res.cookie("loginuser", useremail);
                            res.cookie("menutoken", `${Decodetoken.device_token.id}.txt`);
                            res.redirect(`${process.env.NODE_REACT_REDIRECT_URL}`);
                        }
                        else {
                            res.redirect(process.env.FRONT_ERROR_URL);
                        }
                    }));
                }
                else {
                    res.status(constants_1.Constants.INTERNAL_SERVER).json(responseBuilder_1.ResponseBuilder.getErrorResponse({}, req.t("ERR_INTERNAL_SERVER"), constants_1.Constants.INTERNAL_SERVER));
                }
            }));
        };
        /* End New */
    }
}
exports.UserController = UserController;
//# sourceMappingURL=userController.js.map