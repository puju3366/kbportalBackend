import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import * as Sql from "jm-ez-mysql";
import { Tables } from "../../../config/tables";

@ValidatorConstraint({ async: true })
export class IsDataAlreadyExistConstraint implements ValidatorConstraintInterface {

    public async validate(title: string) {
      const user = await Sql.first(Tables.KBTABLE, ["title"],"title = ?", [title]);
      if (user) {
        return false;
      } else {
        return true;
      }
    }

    
  }