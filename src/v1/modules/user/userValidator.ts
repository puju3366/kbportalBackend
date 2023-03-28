import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import * as Sql from "jm-ez-mysql";
import { Constants } from "../../../config/constants";
import { Tables } from "../../../config/tables";

@ValidatorConstraint({ async: true })
export class IsEmailAlreadyExistConstraint implements ValidatorConstraintInterface {

  public async validate(email: string, args: ValidationArguments) {
    const user = await Sql.first(Tables.USERS, ["id"], "email = ?", [email]);
    if (user) {
      return false;
    } else {
      return true;
    }
  }
}

export class IsMobileAlreadyExistConstraint implements ValidatorConstraintInterface {

  public async validate(mobile: string, args: ValidationArguments) {
    const user = await Sql.first(Tables.USERS, ["id"], "mobile = ?", [mobile]);
    if (user) {
      return false;
    } else {
      return true;
    }
  }
}

@ValidatorConstraint({ async: false })
export class IsMediaSizeValidConstraint implements ValidatorConstraintInterface {
  public validate(file: any, args: ValidationArguments) {
    return file.size < Constants.UPLOAD_SIZES.PROFILE_PICTURE;
  }
}