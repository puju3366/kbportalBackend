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
exports.KbApproverControler = void 0;
const constants_1 = require("../../../config/constants");
const responseBuilder_1 = require("../../../helpers/responseBuilder");
const kbApproverUtils_1 = require("./kbApproverUtils");
const utils_1 = require("../../../helpers/utils");
class KbApproverControler {
    constructor() {
        this.kbApprover = new kbApproverUtils_1.KbApprover();
        this.utils = new utils_1.Utils();
        //Validate Feedback Comment on KB
        this.kbfeedback = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.kbApprover.getApprover(req.body.is_comment_approved, req.params.id);
            if (result) {
                if (req.body.is_comment_approved == 1) {
                    const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ msg: "Comment Approved Successfully" });
                    res.status(constants_1.Constants.OK).json(response);
                }
                else {
                    const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ msg: "Comment Rejected Successfully" });
                    res.status(constants_1.Constants.OK).json(response);
                }
            }
            else {
                res
                    .status(constants_1.Constants.NOT_FOUND)
                    .json(responseBuilder_1.ResponseBuilder.getErrorResponse({}, req.t("NO_RECORD_FOUND"), constants_1.Constants.NOT_FOUND));
            }
        });
        this.kbvalidate = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.kbApprover.getKbValidate(req.body.is_kb_approved, req.params.id);
            if (result) {
                if (req.body.is_kb_approved == 1) {
                    const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ msg: "KB Approved Successfully" });
                    res.status(constants_1.Constants.OK).json(response);
                }
                else {
                    const result = yield this.kbApprover.getKbReject(req.body, req.params.id);
                    const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ msg: "KB Rejected Successfully" });
                    res.status(constants_1.Constants.OK).json(response);
                }
            }
            else {
                res
                    .status(constants_1.Constants.NOT_FOUND)
                    .json(responseBuilder_1.ResponseBuilder.getErrorResponse({}, req.t("NO_RECORD_FOUND"), constants_1.Constants.NOT_FOUND));
            }
        });
        //This is an extra api in which we need id of approver. list of all KBs that require approval 
        // public kbuserapprover = async(req:any, res:Response) => {
        //     const result = await this.kbApprover.getUserApprover(req.params.id);
        //     if(result){
        //         const response = ResponseBuilder.getSuccessResponse(
        //             result.result,
        //             req.t("Success")
        //         );
        //         res.status(Constants.OK).json(response);
        //     } else{
        //         res
        //         .status(Constants.NOT_FOUND)
        //         .json(
        //           ResponseBuilder.getErrorResponse(
        //             {},
        //             req.t("NO_RECORD_FOUND"),
        //             Constants.NOT_FOUND
        //           )
        //         );
        //     }
        // }
    }
}
exports.KbApproverControler = KbApproverControler;
//# sourceMappingURL=kbApproverController.js.map