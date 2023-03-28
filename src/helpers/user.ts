
import * as sql from "jm-ez-mysql";
import { Tables } from "../config/tables";
import { Log } from "./logger";

export class User {
  private logger: any = Log.getLogger();

  public async getUserById(id) {
    // query
    return await sql.first(Tables.USERS,
      ["id", "email", "deviceId", "isBlock"],
      "id = ?", [id]);
  }
}
