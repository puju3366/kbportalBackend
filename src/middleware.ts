import * as l10n from "jm-ez-l10n";
import * as Sql from "jm-ez-mysql";
import * as _ from "lodash";
import { Jwt } from "./helpers/jwt";
import { Tables } from "./config/tables";
import { Request, Response } from "express";
import { User } from "./helpers/user";
import { ResponseBuilder } from "./helpers/responseBuilder";
import { Constants } from './config/constants';
export class Middleware {

  private user: User = new User();

  public getUserAuthorized = async (req: any, res: Response, next: () => void) => {
    const authorization = req.headers['authorization'];
    if (authorization && !_.isEmpty(authorization)) {
      try {
        let tokenInfo:any;
        if (authorization && (authorization.split(' ')[0] === 'JWT'
        || authorization.split(' ')[0] === 'Bearer')) {
          tokenInfo = Jwt.decodeAuthToken(authorization.split(' ')[1]);
        }else if (req.session && req.session.token) {
          tokenInfo = Jwt.decodeAuthToken(req.session.token);
        }
        if (tokenInfo) {
          //query
          const user = await Sql.first(Tables.USERS, ["id", "name", "last_name", "password", "email", "phone_number", "status"], "id = ?", [tokenInfo.userId]);
          // await Sql.query(`SELECT u.status, ur.isVerified, u.first_name, u.last_name, u.id, u.email, u.phone, ur.id as role_id FROM users AS u
          // LEFT JOIN users_roles_relation AS ur ON ur.user_id = u.id
          // WHERE u.id = ${tokenInfo.userId}
          // ORDER BY ur.created_at LIMIT 0, 1`)
          
          if (user.length > 0) {
            if (user[0].status == 0) {
              const response = ResponseBuilder.getErrorResponse({}, req.t("INACTIVE_USER"), Constants.UNAUTHORIZED);
              res.status(Constants.UNAUTHORIZED).json(response);
            }
            else if (user[0].isVerified === 1) {
              if (user[0].status == 1) {
                req._user = user[0];
                next();
              }else {
                const response = ResponseBuilder.getErrorResponse({}, req.t("ERR_UNAUTH"), Constants.UNAUTHORIZED);
                res.status(Constants.UNAUTHORIZED).json(response);
                return;
              }
            } else {
              const response = ResponseBuilder.getErrorResponse({}, req.t("USER_NOT_VERIFIED"), Constants.PRECONDITION_FAILED);
              res.status(Constants.PRECONDITION_FAILED).json(response);
              return;
            }
          } else {
            const response = ResponseBuilder.getErrorResponse({}, req.t("ERR_UNAUTH"), Constants.UNAUTHORIZED);
            res.status(Constants.UNAUTHORIZED).json(response);
            return;
          }
        } else {
          const response = ResponseBuilder.getErrorResponse({}, req.t("ERR_UNAUTH"), Constants.UNAUTHORIZED);
          res.status(Constants.UNAUTHORIZED).json(response);
          return;
        }
      } catch (error) {
        const response = ResponseBuilder.getErrorResponse({}, req.t("ERR_INTERNAL_SERVER"), Constants.INTERNAL_SERVER);
        res.status(Constants.INTERNAL_SERVER).json(response);
        return;
      }
    } else {
        const response = ResponseBuilder.getErrorResponse({}, req.t("ERR_UNAUTH"), Constants.UNAUTHORIZED);
        res.status(Constants.UNAUTHORIZED).json(response);
        return;
    }
  }
  public checktoken = async (req: any, res: Response, next: () => void) => {

    const {
      headers: { authorization },
    } = req;
    if (authorization && (authorization.split(' ')[0] === 'JWT'
      || authorization.split(' ')[0] === 'Bearer')) {
      const token = Jwt.decodeAuthToken(authorization.split(' ')[1]);
      req.payload = token;
      next();
    } else if (req.session && req.session.token) {
      const token = Jwt.decodeAuthToken(req.session.token);
      req.payload = token;
      next();
    } else {
      return res.status(401).json({ error: req.t("TOKEN_NOT_FOUND") });
    }
  }
}
