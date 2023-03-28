import { Response } from "express";
import * as Sql from "jm-ez-mysql";
import { Tables } from "../../../config/tables";
import { Utils } from "../../../helpers/utils";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { Constants } from '../../../config/constants';

export class KbApproverMiddleware {

    //Validate Feedback Comment on KB
    public IsApproved = async (req: any, res: Response, next: () => void) => {
        const approved:any = await Sql.query(`SELECT * FROM ${Tables.KBCOMMENTDETAILS} WHERE id=${req.params.id} AND is_comment_approved = 1`);
        if (approved.length>0) {
          res.status(Constants.BAD_REQ).json(ResponseBuilder.getErrorResponse({},"IS ALREADY APPROVED", Constants.BAD_REQ));
        } else {
          next();
        }
      }

      public IsRejected = async (req: any, res: Response, next: () => void) => {
        const rejected:any = await Sql.query(`SELECT * FROM ${Tables.KBCOMMENTDETAILS} WHERE id=${req.params.id} AND is_comment_approved = 2`);
        if (rejected.length>0) {
          res.status(Constants.BAD_REQ).json(ResponseBuilder.getErrorResponse({},"IS ALREADY REJECTED", Constants.BAD_REQ));
        } else {
          next();
        }
      }

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
