import { Response } from "express";
import * as _ from "lodash";
import { Constants } from "../../../config/constants";
import { Jwt } from "../../../helpers/jwt";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { KbApprover } from "./kbApproverUtils";
import { Utils } from "../../../helpers/utils";
import { SendEmail } from "../../../helpers/sendEmail";
import * as l10n from "jm-ez-l10n";
import { MessageModule } from "../../../helpers/commonMessage";
import { SendPushNotification } from "../../../helpers/SendPushNotification";

export class KbApproverControler {

    private kbApprover: KbApprover = new KbApprover();
    private utils: Utils = new Utils();

    //Validate Feedback Comment on KB
    public kbfeedback = async (req: any, res: Response) => {
        const result = await this.kbApprover.getApprover(req.body.is_comment_approved, req.params.id);
        if (result) {
            if(req.body.is_comment_approved == 1){
                const response = await ResponseBuilder.respSuccess1({ msg: "Comment Approved Successfully" })
                res.status(Constants.OK).json(response);
            }
           else{
            const response = await ResponseBuilder.respSuccess1({ msg: "Comment Rejected Successfully" })
            res.status(Constants.OK).json(response);
           }
        } else {
            res
                .status(Constants.NOT_FOUND)
                .json(
                    ResponseBuilder.getErrorResponse(
                        {},
                        req.t("NO_RECORD_FOUND"),
                        Constants.NOT_FOUND
                    )
                );
        }
    };

    public kbvalidate = async (req: any, res: Response) => {
        const result = await this.kbApprover.getKbValidate(req.body.is_kb_approved, req.params.id);
        if (result) {
            if (req.body.is_kb_approved == 1) {
                const response = await ResponseBuilder.respSuccess1({ msg: "KB Approved Successfully" })
                res.status(Constants.OK).json(response);
            } else {
                const result = await this.kbApprover.getKbReject(req.body,req.params.id);
                const response = await ResponseBuilder.respSuccess1({ msg: "KB Rejected Successfully" })
                res.status(Constants.OK).json(response);
            }

        } else {
            res
            .status(Constants.NOT_FOUND)
            .json(
              ResponseBuilder.getErrorResponse(
                {},
                req.t("NO_RECORD_FOUND"),
                Constants.NOT_FOUND
              )
            );
        }
    }

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