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
exports.KbApprover = void 0;
const Sql = require("jm-ez-mysql");
const tables_1 = require("../../../config/tables");
const responseBuilder_1 = require("../../../helpers/responseBuilder");
class KbApprover {
    getApprover(approved_status, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield Sql.update(tables_1.Tables.KBCOMMENTDETAILS, { is_comment_approved: approved_status }, "id = ?", [id]);
                if (result) {
                    return responseBuilder_1.ResponseBuilder.data(result);
                }
                else {
                    return responseBuilder_1.ResponseBuilder.data({});
                }
            }
            catch (err) {
                throw responseBuilder_1.ResponseBuilder.error(err);
            }
        });
    }
    getKbValidate(approved_status, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield Sql.update(tables_1.Tables.KBDETAILS, { is_kb_approved: approved_status }, "id = ?", [id]);
                if (result) {
                    return responseBuilder_1.ResponseBuilder.data(result);
                }
                else {
                    return responseBuilder_1.ResponseBuilder.data({});
                }
            }
            catch (err) {
                throw responseBuilder_1.ResponseBuilder.error(err);
            }
        });
    }
    getKbReject(data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const dataInsert: any = await Sql.insert(Tables.KBAPPROVEREJECTCOMMENTDETAIL, data);
                const query = yield Sql.query(`INSERT INTO ${tables_1.Tables.KBAPPROVEREJECTCOMMENTDETAIL} (kb_detail_id,is_approve,approve_reject_comment,is_active,created_by) VALUES (${id}, ${data.is_kb_approved},'${data.approve_reject_comment}',1,'${data.created_by}') 
        `);
                return query;
            }
            catch (err) {
                throw responseBuilder_1.ResponseBuilder.error(err);
            }
        });
    }
}
exports.KbApprover = KbApprover;
//# sourceMappingURL=kbApproverUtils.js.map