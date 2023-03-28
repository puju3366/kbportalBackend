import {
    IsEmail, IsNotEmpty, Validate, MaxLength, IsOptional, IsInt
} from "class-validator";
import {
    IsDataAlreadyExistConstraint,
} from "./dashBoardValidator";
import { Model } from "../../../model";

export class DashBoardModel extends Model {
}
