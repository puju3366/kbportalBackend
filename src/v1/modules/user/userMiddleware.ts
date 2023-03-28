import { Response } from "express";
import * as Sql from "jm-ez-mysql";
import { Tables } from "../../../config/tables";
import { Utils } from "../../../helpers/utils";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { Constants } from '../../../config/constants';
export class UserMiddleware {
  public checkMobileNumberExists = async (req: any, res: Response, next: () => void) => {
    const user = await Sql.query(`SELECT count(u.id) as count FROM users AS u
    WHERE u.phone_number LIKE '%${req.body.phone_number}%' AND deleted = 0 AND status = 1`)
    if (user[0].count > 0) {
      res.status(Constants.BAD_REQ).json(ResponseBuilder.getErrorResponse({}, req.t("ERR_MOBILE_ALREADY_EXISTS"), Constants.BAD_REQ));
    } else {
      next();
      
    }
  }

  public checkEmailExists = async (req: any, res: Response, next: () => void) => {
    const email = req.body.email;
    const user = await Sql.query(`SELECT count(u.id) as count FROM users AS u
    WHERE u.email LIKE '${email}' AND deleted = 0 AND status = 1`)
    if (user[0].count > 0) {
      res.status(Constants.BAD_REQ).json(ResponseBuilder.getErrorResponse({}, req.t("ERR_EMAIL_ALREADY_EXISTS"), Constants.BAD_REQ));
    } else {
      next();
    }
  }

  public IsUserExists = async (req: any, res: Response, next: () => void) => {
    const customer = await Sql.first(Tables.USERS, ["*"], `email = ? and status != 2`, [req.body.email]);
    if (customer) {
      if (!customer.status) {
        res.status(Constants.UNAUTHORIZED).json(ResponseBuilder.getErrorResponse({}, req.t("INACTIVE_USER"), Constants.UNAUTHORIZED));
      } else {
        next();
      }
    } else {
      res.status(Constants.NOT_FOUND).json(ResponseBuilder.getErrorResponse({}, req.t("USER_NOT_EXISTS"), Constants.NOT_FOUND));
    }
  }
  public IsUserRegistered = async (req: any, res: Response, next: () => void) => {
    const customer:any = await Sql.query(`SELECT * FROM ${Tables.USERS} WHERE email = '${req.body.email}' and status= 1`);

    if (customer && customer.length > 0) {
      // if (!customer[0].email) {
        // res.status(401).json({ error: req.t("CONFIRM_EMAIL")});
      // } else {
        next();
      // }
    } else {
      res.status(404).json({ error: req.t("USER_NOT_EXISTS")});
    }
  }

  public IsUserInactive = async (req: any, res: Response, next: () => void) => {
    const customer:any = await Sql.query(`SELECT * FROM ${Tables.USERS} WHERE email = '${req.body.email}' and  status = 1`);
    if (customer && customer.length > 0) {
        next();
    } else {
      res.status(404).json({ error: req.t("INACTIVE_USER")});
    }
  }
  public IsUserExistsInSignUp = async (req: any, res: Response, next: () => void) => {
    if(req.body && req.body?.flag == true){
      next();
    }else{
      const customer = await Sql.first(Tables.USERS, ["*"], `email = ? and status != 2`, [req.body.email]);
      if (customer) {
        if (!customer.status) {
          res.status(Constants.UNAUTHORIZED).json(ResponseBuilder.getErrorResponse({}, req.t("INACTIVE_USER"), Constants.UNAUTHORIZED));
        } else{
          res.status(Constants.UNAUTHORIZED).json(ResponseBuilder.getErrorResponse({}, req.t("USER_EXIST_SAME_EMAIL"), Constants.UNAUTHORIZED));
        }
      } else {
        next()
      }
    }

  }

  public verifyOldPassword = async (req: any, res: Response, next: () => void) => {
    if (req.body.newPassword !== req.body.confirmPassword) {
      res.status(Constants.BAD_REQ).json(ResponseBuilder.getErrorResponse({}, req.t("CONFIRM_PASSWORD_NOT_MATCH"), Constants.BAD_REQ));
    } else {
      const result = await Sql.first(Tables.USERS, ["password"], "id = ?", [req._user.id]);
      const comparePassword = await Utils.compareEncryptedText(req.body.oldPassword, result.password);
      if (comparePassword) {
        next();
      } else {
        res.status(Constants.BAD_REQ).json(ResponseBuilder.getErrorResponse({}, req.t("OLD_PASSWORD_WRONG"), Constants.BAD_REQ));
      }
    }
  }


  //Below middleware is for checking if mobile no is registered or not
  public isMobileRegistered = async (req: any, res: Response, next: () => void) => {

    const user = await Sql.first(Tables.USERS, ["*"], `mobile = ?`, [req.body.mobile]);
    if (user && user.isBlock === 0) {
      next();
    } else if (user.isBlock === 1) {
        res.status(Constants.NOT_FOUND).json(ResponseBuilder.getErrorResponse({}, req.t("INACTIVE_USER"), Constants.NOT_FOUND));
    }
    else {
      res.status(Constants.NOT_FOUND).json(ResponseBuilder.getErrorResponse({}, req.t("MOBILE_NOT_REGISTERED"), Constants.NOT_FOUND));
    }
  }


  public isEmailRegistered = async (req: any, res: Response, next: () => void) => {
    const user = await Sql.first(Tables.USERS, ["*"], `email = ? and status != 2`, [req.body.email]);
    if (user && user.status === 1) {
      // User not verified yet
      if(user.isVerified === 1){
        next();
      }else{
        const response = ResponseBuilder.getErrorResponse({}, req.t("USER_NOT_VERIFIED"), Constants.FORBIDDEN);
        res.status(Constants.FORBIDDEN).json(response);
      }

    } else if (user.status === 0) {
      const response = ResponseBuilder.getErrorResponse({}, req.t("INACTIVE_USER"), Constants.FORBIDDEN);
      res.status(Constants.FORBIDDEN).json(response);
    }
    else {
      const response = ResponseBuilder.getErrorResponse({}, req.t("EMAIL_NOT_REGISTERED"), Constants.NOT_FOUND);
      res.status(Constants.NOT_FOUND).json(response);
    }
  }

  public isEmailReg = async (req: any, res: Response, next: () => void) => {
    const user = await Sql.first(Tables.USERS, ["*"], `email = ?`, [req.body.email]);
    if (!user) {
      next();
    }
    else {
      const response = ResponseBuilder.getErrorResponse({}, req.t("EMAIL_REGISTERED"));
      res.status(200).json(response);
    }
  }

  public IsValidId = async (req: any, res: Response, next: () => void) => {
    if (isNaN(req.params.id)) {
      res.status(Constants.BAD_REQ).json(ResponseBuilder.getErrorResponse({}, req.t("INVAILD_ID"), Constants.BAD_REQ));
    } else {
      next();
    }
  }
}