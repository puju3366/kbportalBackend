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
exports.KbApproverMiddleware = void 0;
const Sql = require("jm-ez-mysql");
const tables_1 = require("../../../config/tables");
const responseBuilder_1 = require("../../../helpers/responseBuilder");
const constants_1 = require("../../../config/constants");
class KbApproverMiddleware {
    constructor() {
        //Validate Feedback Comment on KB
        this.IsApproved = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const approved = yield Sql.query(`SELECT * FROM ${tables_1.Tables.KBCOMMENTDETAILS} WHERE id=${req.params.id} AND is_comment_approved = 1`);
            if (approved.length > 0) {
                res.status(constants_1.Constants.BAD_REQ).json(responseBuilder_1.ResponseBuilder.getErrorResponse({}, "IS ALREADY APPROVED", constants_1.Constants.BAD_REQ));
            }
            else {
                next();
            }
        });
        this.IsRejected = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const rejected = yield Sql.query(`SELECT * FROM ${tables_1.Tables.KBCOMMENTDETAILS} WHERE id=${req.params.id} AND is_comment_approved = 2`);
            if (rejected.length > 0) {
                res.status(constants_1.Constants.BAD_REQ).json(responseBuilder_1.ResponseBuilder.getErrorResponse({}, "IS ALREADY REJECTED", constants_1.Constants.BAD_REQ));
            }
            else {
                next();
            }
        });
        //   public KbValidate = async (req: any, res: Response, next: () => void) => {
        //     if (isNaN(req.params.id)) {
        //         res.status(Constants.BAD_REQ).json(ResponseBuilder.getErrorResponse({}, req.t("INVAILD_ID"), Constants.BAD_REQ));
        //       } else {
        //         next();
        //       }
        // const approved:any = await Sql.query(`SELECT * FROM ${Tables.KBDETAILS} WHERE id=${req.params.id} AND is_approved = null`);
        // if (approved.length>0) {
        //   res.status(Constants.BAD_REQ).json(ResponseBuilder.getErrorResponse({},"IS ALREADY APPROVED", Constants.BAD_REQ));
        // } else {
        //   next();
        // }
        //   }
        //This is an extra api in which we need id of approver. list of all KBs that require approval 
        // public IsUserAprrover = async (req: any, res: Response, next: () => void) =>{
        //     const userapprover:any = await Sql.query(`SELECT * FROM ${Tables.KBDETAILS} WHERE id=${req.params.id} AND is_approved = 0`);
        //     if(userapprover.length>0){
        //         next();
        //     } else{
        //       res.status(Constants.BAD_REQ).json(ResponseBuilder.getErrorResponse({},"IS ALREADY APPROVED", Constants.BAD_REQ));
        //     }
        // }
    }
}
exports.KbApproverMiddleware = KbApproverMiddleware;
//# sourceMappingURL=KbApproverMiddleware.js.map