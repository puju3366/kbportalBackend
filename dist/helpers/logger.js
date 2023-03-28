"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
const moment = require("moment-timezone");
const winston_1 = require("winston");
const constants_1 = require("../config/constants");
const { combine, timestamp, prettyPrint, colorize, } = winston_1.format;
class Log {
    static getLogger() {
        const timestampFormat = moment().format(constants_1.Constants.TIME_STAMP_FORMAT);
        return winston_1.createLogger({
            format: combine(timestamp({ format: timestampFormat }), prettyPrint(), colorize()),
            level: "debug",
            transports: [new winston_1.transports.Console()],
        });
    }
}
exports.Log = Log;
//# sourceMappingURL=logger.js.map