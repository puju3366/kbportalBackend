import { Response } from "express";
import * as _ from "lodash";
import { Constants } from "../../../config/constants";
import { Jwt } from "../../../helpers/jwt";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { UserUtils } from "./userUtils";
import { Utils } from "../../../helpers/utils";
import { SendEmail } from "../../../helpers/sendEmail";
import { SendPushNotification } from "../../../helpers/SendPushNotification";
import { banner_sponser1, match_schedule1 } from "./Data";
import jwt_decode from 'jwt-decode';

const xml2js = require("xml2js");
const jwt = require("jsonwebtoken");
const request = require('request')
// const node_local_storage = require("node-localstorage").LocalStorage;
const bcrypt = require("bcryptjs");
const banner_sponser = banner_sponser1;
const match_schedule = match_schedule1;
var fs = require('fs');

export class UserController {
  private userUtils: UserUtils = new UserUtils();
  private utils: Utils = new Utils();


  public signup = async (req: any, res: Response) => {
    const input = req.body;
    input.password = await Utils.encryptText(input.password);
    input.otp = this.utils.createRandomcode(4, true);
    const device_token = req.headers["device_token"];
    if (!device_token) {
      const response = ResponseBuilder.getErrorResponse(
        {},
        req.t("ADD_DIVICE_TOKEN")
      );
      res.status(Constants.NOT_FOUND).json(response);
    }
    const userExist = await this.userUtils.getUserByEmail(input);
    let response;
    if (!userExist.result.length) {
      const result = await this.userUtils.addUserDetails(input);
      const deviceData = {
        user_id: result.insertId,
        device_token: device_token,
      };
      const device = await this.userUtils.addUserDeviceToken(deviceData);
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
      response = ResponseBuilder.getSuccessResponse(
        data,
        req.t("SIGNUP_SUCCESS")
      );
    } else {
      response = ResponseBuilder.getSuccessResponse(
        {},
        req.t("USER_EXIST_SAME_EMAIL")
      );
    }
    res.status(200).json(response);
  };

  public login = async (req: any, res: Response) => {
    try {
      const { password } = req.body;
      const result: ResponseBuilder = await this.userUtils.getUserByEmail(
        req.body
      );
      const token = req.headers["device_token"];
      if (!token) {
        const response = ResponseBuilder.getErrorResponse(
          {},
          req.t("ADD_DIVICE_TOKEN")
        );
        res.status(Constants.NOT_FOUND).json(response);
      }
      if (result && result.result) {
        const userData = result.result;
        const verifyPassword = await Utils.compareEncryptedText(
          password,
          userData.password
        );
        if (verifyPassword) {
          const userDetails = userData;
          let obj = {
            id: userData.id,
          };
          userDetails.token = Jwt.getAuthToken(obj);

          const tokenresult = await this.userUtils.getTokenByuid(
            userData.id,
            token
          );
          if (tokenresult.result == null && !tokenresult.result) {
            const deviceData = {
              user_id: userData.id,
              device_token: token,
            };
            await this.userUtils.addUserDeviceToken(deviceData);
          }
          const data = {
            accessToken: "Bearer " + userDetails.token,
            user: userDetails,
            status: userDetails.status,
          };
          delete userDetails.usergroup;
          delete userDetails.token;
          const response = ResponseBuilder.getSuccessResponse(
            data,
            req.t("LOGIN_SUCCESS")
          );
          res.status(result.code).json(response);
        } else {
          const response = ResponseBuilder.getErrorResponse(
            {},
            req.t("INVALID_CREDENTIAL")
          );
          res.status(Constants.NOT_FOUND).json(response);
        }
      } else {
        const response = ResponseBuilder.getErrorResponse(
          {},
          req.t("INVALID_CREDENTIAL")
        );
        res.status(Constants.NOT_FOUND).json(response);
      }
    } catch (error) {
      const response = ResponseBuilder.getErrorResponse(
        {},
        req.t("INVALID_CREDENTIAL")
      );
      res.status(Constants.NOT_FOUND).json(response);
      return;
    }
  };

  public verifyOtp = async (req: any, res: Response) => {
    const result: ResponseBuilder = await this.userUtils.verifyOtp(req);
    if (result && result.result) {
      const response = ResponseBuilder.getSuccessResponse(
        result.result,
        "OTP verified Successfully"
      );
      res.status(result.code).json(response);
    } else {
      const response = ResponseBuilder.getSuccessResponse({}, result.message);
      res.status(result.code).json(response);
    }
  };

  public sendOTP = async (req: any, res: Response) => {
    const input = req.body;
    const items: ResponseBuilder = await this.userUtils.getUserByEmail(
      req.body
    );
    if (items.result) {
      const token = req.headers["device_token"];
      const tokenresult = await this.userUtils.getTokenByuid(
        items.result.id,
        token
      );
      if (tokenresult.result == null && !tokenresult.result) {
        const deviceData = {
          user_id: items.result.id,
          device_token: token,
        };
        await this.userUtils.addUserDeviceToken(deviceData);
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
      SendPushNotification.sendPushNotificationFirebase(sendToken, payloadFCM);
      const emailData = {
        username: items.result.first_name,
        one_time_password: otp,
      };
      SendEmail.sendRawMail(
        "otp",
        emailData,
        [items.result.email],
        `Please confirm your email account`,
        ""
      );
      const result: ResponseBuilder = await this.userUtils.updateUserDetails(
        { otp: otp },
        items.result.id
      );
      const response = ResponseBuilder.getSuccessResponse(
        {},
        req.t("EMAIL_SENT")
      );
      res.status(items.code).json(response);
    } else {
      const response = ResponseBuilder.getSuccessResponse(
        {},
        req.t("EMAIL_NOT_REGISTERED")
      );
      res.status(items.code).json(response);
    }
  };

  // Reset Password
  public resetPassword = async (req: any, res: Response) => {
    const result: ResponseBuilder = await this.userUtils.resetPassword(
      req,
      res
    );
    if (result.result) {
      const response = ResponseBuilder.getSuccessResponse(
        result.result,
        req.t("PASSWORD_RESETED")
      );
      res.status(result.code).json(response);
    } else {
      res.status(result.code).json(result);
    }
  };

  // update password
  public updatePassword = async (req: any, res: Response) => {
    const input = req.body;
    input.newPassword = await Utils.encryptText(input.newPassword);
    const result: ResponseBuilder = await this.userUtils.updatePassword(
      input.newPassword,
      req._user.id
    );
    const response = ResponseBuilder.getSuccessResponse(
      {},
      req.t("PASSWORD_UPDATED")
    );
    res.status(200).json(response);
  };

  public getProfile = async (req: any, res: Response) => {
    const result = await this.userUtils.getProfile(req.params.id);
    if (result) {
      const response = ResponseBuilder.getSuccessResponse(
        result.result,
        req.t("SUCCESS")
      );
      res.status(Constants.OK).json(response);
    } else {
      res
        .status(Constants.NOT_FOUND)
        .json(
          ResponseBuilder.getErrorResponse(
            {},
            req.t("NO_RECORD_FOUND"),
            Constants.NOT_FOUND
          )
        );
    }
  };
  public getMatchSchedule = async (req: any, res: Response) => {
    const response = ResponseBuilder.getSuccessResponse(
      match_schedule,
      req.t("SUCCESS")
    );
    res.status(Constants.OK).json(response);
  };
  public getBannerSponser = async (req: any, res: Response) => {
    const response = ResponseBuilder.getSuccessResponse(
      banner_sponser,
      req.t("SUCCESS")
    );
    res.status(Constants.OK).json(response);
  };

  public getAllNotification = async (req: any, res: Response) => {
    const result: ResponseBuilder = await this.userUtils.getAllTokenBy();
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
      SendPushNotification.sendPushNotificationFirebase(
        newToeknArr,
        payloadFCM
      );
    }
    const response = ResponseBuilder.getSuccessResponse(
      {},
      req.t("NOTIFICATION_SEND")
    );
    res.status(200).json(response);
  };

  public userVerification = async (req: any, res: Response) => {
    const result: ResponseBuilder = await this.userUtils.userVerification(req);
    if (result && result.result) {
      const response = ResponseBuilder.getSuccessResponse(
        result.result,
        "verified Successfully"
      );
      res.status(result.code).json(response);
    } else {
      const response = ResponseBuilder.getErrorResponse({}, result.message);
      res.status(result.code).json(response);
    }
  };

  public adfslogin = (req: any, res: any) => {
    xml2js.parseString(req.body.wresult, { mergeAttrs: true }, async (err: any, result: any) => {
      if (err) {
        res.status(Constants.INTERNAL_SERVER).json(ResponseBuilder.getErrorResponse({},
          req.t("ERR_INTERNAL_SERVER"), Constants.INTERNAL_SERVER));
      }
      const jsonString = JSON.stringify(result, null, 4);
      const json = JSON.parse(jsonString)
      var useremail = 'default'
      useremail =
        json["t:RequestSecurityTokenResponse"]["t:RequestedSecurityToken"][0]['saml:Assertion']
        [0]["saml:AttributeStatement"][0]["saml:Attribute"][0]["saml:AttributeValue"][0];
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
        }, async (error: any, response: any, body: any) => {
          if (error) {
            res.status(500).json({ errors: "something went wrong" });
          }
          if (response.statusCode == 200) {
            var Decodetoken: any = jwt_decode(body.token)
            fs.writeFile(`./localStorage/${Decodetoken.device_token.id}.txt`, body.menuToken, function (err) {
              if (err) throw err;
            });
            res.cookie("logintoken", body.token);
            res.cookie("loginuser", useremail);
            res.cookie("menutoken", `${Decodetoken.device_token.id}.txt`);
            res.redirect(`${process.env.NODE_REACT_REDIRECT_URL}`);
          } else {
            res.redirect(process.env.FRONT_ERROR_URL);
          }
        });
      } else {
        res.status(Constants.INTERNAL_SERVER).json(ResponseBuilder.getErrorResponse({},
          req.t("ERR_INTERNAL_SERVER"), Constants.INTERNAL_SERVER));
      }
    });
  }
  /* End New */

}
