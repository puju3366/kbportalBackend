import * as Sql from "jm-ez-mysql";
import * as _ from "lodash";
import { Tables } from "../../../config/tables";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { Utils } from "../../../helpers/utils";
import { Constants } from "../../../config/constants";
import { Jwt } from "../../../helpers/jwt";

export class UserUtils {

  public async addUserDetails(details: Json) {
    try {
      return await Sql.insert(Tables.USERS, details);
    } catch (err) {
      throw ResponseBuilder.error(err);
    }
  }
  public async addUserDeviceToken(data: Json) {
    try {
      return await Sql.insert(Tables.USERSDEVICE, data);
    } catch (err) {
      throw ResponseBuilder.error(err);
    }
  }

  // get User by email
  public async getUserByEmail(data: any): Promise<ResponseBuilder> {
    try {
      let where = `email = '${data.email}'`;
      
      const user = await Sql.first(Tables.USERS, ["id","first_name","last_name","email","password","isVerified","status"], `status = 1 And deleted = 0 AND ${where}`);
      if (user) {
        return ResponseBuilder.data(user);
      } else {
        return ResponseBuilder.data({});
      }
    } catch (err) {
      throw ResponseBuilder.error(err);
    }
  }
  public async getTokenByuid(id: number,token:any): Promise<ResponseBuilder> {
    try {
      const user = await Sql.first(Tables.USERSDEVICE,["*"],"user_id = ? AND device_token = ?", [id,token]);
      if (user) {
        return ResponseBuilder.data(user);
      } else {
        return ResponseBuilder.notFound({});
      }
    } catch (err) {
      throw ResponseBuilder.error(err);
    }
  }
  public async getAllTokenBy(): Promise<ResponseBuilder> {
    try {
      const user = await Sql.findAll(Tables.USERSDEVICE, ["device_token"]);
      if (user) {
        return ResponseBuilder.data(user);
      } else {
        return ResponseBuilder.notFound({});
      }
    } catch (err) {
      throw ResponseBuilder.error(err);
    }
  }

  public async verifyOtp(req): Promise<ResponseBuilder> {
    const userDetail = await Sql.first(Tables.USERS, ["id", "otp", "otp_created_at", "email", "isVerified"], "email = ? OR phone_number = ? ", [req.body.email_or_phn,req.body.email_or_phn]);
    if (userDetail) {
      if (userDetail.otp == req.body.otp) {
        let ts1 = Math.floor(new Date(userDetail.otp_created_at).getTime());
        if ((Date.now() - ts1) / 1000 <= 300) {
          const updateRes = await Sql.update(`${Tables.USERS}`,{ isVerified: 1, otp_created_at: null, otp: null },"id = ? ",[userDetail.id]);
          if (updateRes !== null || updateRes !== undefined) {
            userDetail.message = "OTP Verified Successfully";
            let userData = {
              id: userDetail.id,
              email: userDetail.email
            };
            return ResponseBuilder.data(userData);
          } else {
            return ResponseBuilder.data({});
          }
        } else {
          return ResponseBuilder.errorMessage(req.t("TIME_OUT"));
        }
      } else {
        return ResponseBuilder.errorMessage(req.t("INVALID_OTP"));
      }
    } else {
      return ResponseBuilder.errorMessage(req.t("EMAIL_NOT_REGISTERED"));
    }
  }

  public async updateUserDetails(details: Json, id: number) {
    try {
      return await Sql.updateFirst(Tables.USERS, details, "id = ?", [id]);
    }
    catch (err) {
      throw ResponseBuilder.error(err);
    }
  }

  public async resetPassword(req,res:any): Promise<ResponseBuilder> {
    if (req.body.newPassword && req.body.email_or_phn) {
        if(req.body.newPassword !== req.body.confirmPassword){
          res.status(Constants.BAD_REQ).json(ResponseBuilder.getErrorResponse({}, req.t("CONFIRM_PASSWORD_NOT_MATCH"), Constants.BAD_REQ));
        }else{
          const hash = await Utils.encryptText(req.body.newPassword);
          req.body.newPassword = hash;
            let where = ` (email = '${req.body.email_or_phn}' OR phone_number = '${req.body.email_or_phn}' )`
          const user = await Sql.first(Tables.USERS, ["id","first_name","last_name","email","password","phone_number","isVerified","status"], `status = 1 And deleted = 0 AND ${where}`);
          if(user){
            req.body.updated_at = new Date();
            const data: any = await Sql.update(`${Tables.USERS}`, { password: hash, updated_at: req.body.updated_at }, "id= ?", [user.id]);
            const returnRes = {
              id: user.id,
              first_name : user.first_name,
              last_name : user.last_name,
              email : user.email,
              password: user.password,
              phone_number : user.phone_number,
              status : user.status,
              isVerified:user.isVerified,
            }
            return ResponseBuilder.data(returnRes);
          }else{
            return ResponseBuilder.errorMessage(req.t("EMAIL_NOT_REGISTERED"))
          }
        }
    }else{
      return ResponseBuilder.errorMessage(req.t("EMAIL_MOBILE"))
    }
  }

  public async updatePassword(password, userId) {
    const data = await Sql.update(Tables.USERS, { password }, "id = ?", [userId]);
    return ResponseBuilder.data({ data: data });
  }

  public async getProfile(id: number): Promise<ResponseBuilder> {
    const userProfile = await Sql.first(`${Tables.USERS}`, ["id","first_name", "last_name", "email","password", "status", "isVerified"], "id = ?", [id]);
    if (userProfile) {
      return ResponseBuilder.data(userProfile);
    } else {
      return ResponseBuilder.data({});
    }
  }

  public async userVerification(req): Promise<ResponseBuilder> {
    const userDetail = await Sql.first(Tables.USERS, ["id", "otp", "otp_created_at", "email", "isVerified"], "email = ? ", [req.body.email]);
    if (userDetail) {
          const updateRes = await Sql.update(`${Tables.USERS}`,{ isVerified: req.body.isVerified},"id = ? ",[userDetail.id]);
          if (updateRes !== null || updateRes !== undefined) {
            userDetail.message = "Verified Successfully";
            let userData = {
              email : userDetail.email,
              isVerified:req.body.isVerified,
            };
            return ResponseBuilder.data(userData);
          } else {
            return ResponseBuilder.data({});
          }      
    } else {
      return ResponseBuilder.errorMessage("User is not verified, Please verify your account from email");
    }
  }


}
