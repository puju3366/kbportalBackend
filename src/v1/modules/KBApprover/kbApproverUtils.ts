import * as Sql from "jm-ez-mysql";
import * as _ from "lodash";
import { Tables } from "../../../config/tables";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { Utils } from "../../../helpers/utils";
import { Constants } from "../../../config/constants";
import { Jwt } from "../../../helpers/jwt";

export class KbApprover {
    public async getApprover(approved_status: number, id: number): Promise<ResponseBuilder> {
        try {
            const result = await Sql.update(Tables.KBCOMMENTDETAILS, { is_comment_approved: approved_status }, "id = ?", [id]);
            if (result) {
                return ResponseBuilder.data(result);
            } else {
                return ResponseBuilder.data({});
            }
        } catch (err) {
            throw ResponseBuilder.error(err);
        }
    }

    public async getKbValidate(approved_status: number, id: number): Promise<ResponseBuilder> {
        try {
            const result = await Sql.update(Tables.KBDETAILS, { is_kb_approved: approved_status }, "id = ?", [id]);

            if (result) {
                return ResponseBuilder.data(result);
            } else {
                return ResponseBuilder.data({});
            }
        } catch (err) {
            throw ResponseBuilder.error(err);
        }
    }

    public async getKbReject(data: any, id: string | number): Promise<ResponseBuilder> {
        try {
            // const dataInsert: any = await Sql.insert(Tables.KBAPPROVEREJECTCOMMENTDETAIL, data);
            const query = await Sql.query(`INSERT INTO ${Tables.KBAPPROVEREJECTCOMMENTDETAIL} (kb_detail_id,is_approve,approve_reject_comment,is_active,created_by) VALUES (${id}, ${data.is_kb_approved},'${data.approve_reject_comment}',1,'${data.created_by}') 
        `);
            return query;
        } catch (err) {
            throw ResponseBuilder.error(err);
        }
    }


    //This is an extra api in which we need id of approver. list of all KBs that require approval 
    // public async getUserApprover(id: number): Promise<ResponseBuilder> {
    //     const userApprover = await Sql.first(`${Tables.KBDETAILS}`, ["id", "title", "tag", "body", "is_approved", "kb_assigner_date"], "id = ?", [id]);
    //     if (userApprover) {
    //         return ResponseBuilder.data(userApprover);
    //     } else {
    //         return ResponseBuilder.data({});
    //     }
    // }
}