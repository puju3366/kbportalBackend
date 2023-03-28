import * as moment from "moment-timezone";
import { createLogger, format, transports } from "winston";
import { Constants } from "../config/constants";
const {
  combine, timestamp, prettyPrint, colorize,
} = format;

export class Log {

  public static getLogger() {
    const timestampFormat: string = moment().format(Constants.TIME_STAMP_FORMAT);
    return createLogger({
      format: combine(
        timestamp({ format: timestampFormat }),
        prettyPrint(),
        colorize()
      ),
      level: "debug",
      transports: [new transports.Console()],
    });
  }
}
