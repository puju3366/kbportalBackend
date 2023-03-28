"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sql = require("jm-ez-mysql");
const tables_1 = require("../config/tables");
const logger_1 = require("./logger");
class User {
    constructor() {
        this.logger = logger_1.Log.getLogger();
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // query
            return yield sql.first(tables_1.Tables.USERS, ["id", "email", "deviceId", "isBlock"], "id = ?", [id]);
        });
    }
}
exports.User = User;
//# sourceMappingURL=user.js.map