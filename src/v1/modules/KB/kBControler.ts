import { Response } from "express";
import { Utils } from "../../../helpers/utils";
import { KBUtils } from "./kBUtils";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { isEmpty } from "lodash";
import { SendEmail } from "../../../helpers/sendEmail";
import { Tables } from "../../../config/tables";
import * as Sql from "jm-ez-mysql";
import * as moment from "moment";
const request = require('request');

var fs = require('fs')
export class KBController {
    private utils: Utils = new Utils();
    private kBUtils: KBUtils = new KBUtils();


    public createKB = async (req: any, res: Response) => {
        const approver = {
            "approver": req.body.kb_approved_by
        }
        var emailForApprover;
        if (approver) {
            request.post({
                url: `https://rbac.devitsandbox.com/node/api/v1/user/kb_email_approver`,
                headers: {
                    "content-type": "application/json",
                    "origin": "https://kb.devitsandbox.com"
                },
                body: approver,
                json: true
            }
                , async (err, response: any, body: any) => {
                    try {
                        if (response) {
                            emailForApprover = body.email
                            await this.test(req, res, emailForApprover);

                        }
                    } catch {
                        if (err) {
                            console.log("Data not found")
                        }
                    }
                }
            );
        }
    }

    public test = async (req: any, res: Response, emailForApprover: any) => {
        let data = {
            category_id: req.body.category_id,
            team: req.body.team,
            title: req.body.title,
            tag: req.body.tag,
            project_id: req.body.project_id,
            body: req.body.body,
            is_kb_draft: req.body.is_kb_draft,
            created_by: req.body.created_by,
            kb_assigner: req.body.kb_assigner,
            kb_approved_by: emailForApprover,
            // kb_expiry_date: req.body.kb_expiry_date,
        };
        const result: any = await this.kBUtils.insertKB(data)
        let practiceArr = req.body.practice_id.split(",");
        for (var i = 0; i < practiceArr.length; i++) {
            const practice_id: any = await this.kBUtils.supportingQuery(practiceArr[i]);
            const practiceData = {
                practice_id: practice_id[0].id,
                created_by: req.body.created_by,
                kb_detail_id: result.lastKbId.insertId,
            }
            const query = await Sql.insert(Tables.KBPRACTICEDETAILS, practiceData)
        }
        if (result) {
            const response = await ResponseBuilder.respSuccess1({ result: result, msg: "KB Created Successfully" })
            const approver = emailForApprover.split("@")
            const ap1 = approver[0].split(".")
            const a11 = req.body.created_by.split("@")
            const a1 = a11[0].split(".")
            const emailData = {
                "first_name": ap1[0].charAt(0).toUpperCase() + ap1[0].slice(1),
                "last_name": ap1[1].charAt(0).toUpperCase() + ap1[1].slice(1),
                "first_name1": a1[0].charAt(0).toUpperCase() + a1[0].slice(1),
                "last_name1": a1[1].charAt(0).toUpperCase() + a1[1].slice(1),
                "Kb_title": req.body.title.charAt(0).toUpperCase() + req.body.title.slice(1),
                "content": req.body.body,
                "team": req.body.team,
                "practice": req.body.practice_id.charAt(0).toUpperCase() + req.body.practice_id.slice(1),
                "created_on": result.category[0].created_on,
                "category_name": result.category[0].category_name,
                "kb_approved_by": emailForApprover,
                "required_url": process.env.NODE_GETAPPROVE_URL
            }

            res.status(200).json(response);
            SendEmail.sendRawMail("kbAprover", emailData, [req.body.kb_assigner],
                `KB for Approval`, "");
            res.status(200).json(response)
        }
        else {
            const response = await ResponseBuilder.respSuccess1({ result: result, msg: "Something went wrong" })
            res.status(200).json(response)
        }

    }

    public getallcomment = async (req: any, res: Response) => {
        const result: any = await this.kBUtils.getAllComments()
        if (result) {
            const response = await ResponseBuilder.respSuccess1({ result: result, msg: "Data fetched successfully" })
            res.status(200).json(response)
        }
        else {
            const response = await ResponseBuilder.respSuccess1({ msg: "Something went wrong" })
            res.status(404).json(response)
        }
    }


    public getCategories = async (req: any, res: Response) => {
        const result: any = await this.kBUtils.getCategories()
        if (result) {
            const response = await ResponseBuilder.respSuccess1({ result: result, msg: "Data fetched successfully" })
            res.status(200).json(response)
        }
        else {
            const response = await ResponseBuilder.respSuccess1({ msg: "Something went wrong" })
            res.status(404).json(response)
        }
    }
    public getProjectData = async (req: any, res: Response) => {
        const result: any = await this.kBUtils.getProjectData()
        if (result) {
            const response = await ResponseBuilder.respSuccess1({ result: result, msg: "Data fetched successfully" })
            res.status(200).json(response)
        }
        else {
            const response = await ResponseBuilder.respSuccess1({ msg: "Something went wrong" })
            res.status(404).json(response)
        }
    }

    public getPracticesData = async (req: any, res: Response) => {
        const result: any = await this.kBUtils.getPracticesData()
        if (result) {
            const response = await ResponseBuilder.respSuccess1({ result: result, msg: "Data fetched successfully" })
            res.status(200).json(response)
        }
        else {
            const response = await ResponseBuilder.respSuccess1({ msg: "Something went wrong" })
            res.status(404).json(response)
        }
    }

    public getTeamsData = async (req: any, res: Response) => {
        const result: any = await this.kBUtils.getTeamsData()
        if (result) {
            const response = await ResponseBuilder.respSuccess1({ result: result, msg: "Data fetched successfully" })
            res.status(200).json(response)
        }
        else {
            const response = await ResponseBuilder.respSuccess1({ msg: "Something went wrong" })
            res.status(404).json(response)
        }
    }


    public getUnapprovedKb = async (req: any, res: Response) => {
        const result: any = await this.kBUtils.getUnapprovedKb()
        if (result) {
            const response = await ResponseBuilder.respSuccess1({ result: result, msg: req.t("Success") })
            res.status(200).json(response)
        }
        else {
            const response = await ResponseBuilder.respSuccess1({ error: req.t("went_wrong") })
            res.status(404).json(response)
        }
    }

    public getallKB = async (req: any, res: Response) => {
        const result: any = await this.kBUtils.getAllKBByPract(req.body.practice)
        if (result) {
            const response = await ResponseBuilder.respSuccess1({ result: result, msg: req.t('Success') })
            res.status(200).json(response)
        }
        else {
            const response = await ResponseBuilder.respSuccess1({ result: result, msg: "Something went wrong" })
            res.status(200).json(response)
        }
    }
    public getallKBByCat = async (req: any, res: Response) => {
        const result: any = await this.kBUtils.getAllKBByCat(req.body.category)
        if (result) {
            const response = await ResponseBuilder.respSuccess1({ result: result, msg: req.t('Success') })
            res.status(200).json(response)
        }
        else {
            const response = await ResponseBuilder.respSuccess1({ result: result, msg: "Something went wrong" })
            res.status(200).json(response)
        }
    }
    public kbRejected = async (req: any, res: Response) => {
        let data = {
            kb_detail_id: req.body.kb_detail_id,
            approve_reject_comment: req.body.approve_reject_comment,
            is_approve: req.body.is_approve,
            created_by: req.body.created_by,
        };
        const result: any = await this.kBUtils.kbRejected(data)
        if (result) {
            const response = await ResponseBuilder.respSuccess1({ result: result, msg: req.t('Success') })
            res.status(200).json(response)
        }
        else {
            const response = await ResponseBuilder.respSuccess1({ result: result, msg: "Something went wrong" })
            res.status(200).json(response)
        }
    }
    public updateKB = async (req: any, res: Response) => {
        const result: any = await this.kBUtils.updateKB(req.body, req.params.id)
        const deletePreviousPractice = await Sql.query(`DELETE FROM ${Tables.KBPRACTICEDETAILS} WHERE kb_detail_id = ${req.params.id};`)
        let practiceArr = req.body.practice_id.split(",");
        for (var i = 0; i < practiceArr.length; i++) {
            const practice_id: any = await this.kBUtils.supportingQuery(practiceArr[i]);
            const practiceData = {
                practice_id: practice_id[0].id,
                created_by: req.body.created_by,
                kb_detail_id: req.params.id,
            }
            const query = await Sql.insert(Tables.KBPRACTICEDETAILS, practiceData)
        }
        const practice_id: any = await this.kBUtils.supportingQuery(req.body)
        if (result) {
            const response = await ResponseBuilder.respSuccess1({ result: result, msg: "KB Updated Successfully" })
            res.status(200).json(response)
        }
        else {
            const response = await ResponseBuilder.respSuccess1({ result: result, msg: "Something went wrong" })
            res.status(200).json(response)
        }
    }
    public getKBDetails = async (req: any, res: Response) => {
        const result: any = await this.kBUtils.getKbDetails(req.params.id)
        if (result) {
            const response = await ResponseBuilder.respSuccess1({ result: result, msg: "successfully hitting api" })
            res.status(200).json(response)
        }
        else {
            const response = await ResponseBuilder.respSuccess1({ result: result, msg: "Something went wrong" })
            res.status(400).json(response)
        }
    }
    public getPracticeDetails = async (req: any, res: Response) => {
        const result: any = await this.kBUtils.getPracticeDetails(req.params.id)
        if (result) {
            const response = await ResponseBuilder.respSuccess1({ result: result, msg: "successfully hitting api" })
            res.status(200).json(response)
        }
        else {
            const response = await ResponseBuilder.respSuccess1({ result: result, msg: "Something went wrong" })
            res.status(400).json(response)
        }
    }


    public getRelatedKB = async (req: any, res: Response) => {
        const result: any = await this.kBUtils.getRelatedKbPost(req.body.tag, req.body.id);
        if (result) {
            const response = await ResponseBuilder.respSuccess1({ result: result, msg: "successfully hitting api" })
            res.status(200).json(response)
        }
        else {
            const response = await ResponseBuilder.respSuccess1({ result: result, msg: "Something went wrong" })
            res.status(400).json(response)
        }
    }

    public getUserRating = async (req: any, res: Response) => {

        const result: any = await this.kBUtils.getUserRating(req.body);
        if (result) {
            const response = await ResponseBuilder.respSuccess1({ result: result[0], msg: "successfully hitting api" })
            res.status(200).json(response)
        }
        else {
            const response = await ResponseBuilder.respSuccess1({ result: result, msg: "Something went wrong" })
            res.status(400).json(response)
        }
    }

    //Image upload API
    public getImageUpload = async (req: any, res: Response) => {
        const result: any = await this.utils.upload(req.files);
        if (result) {
            const response = await ResponseBuilder.respSuccess1({ result: result[0], msg: "successfully hitting api" })
            res.status(200).json(result[0])
        }
        else {
            const response = await ResponseBuilder.respSuccess1({ result: result, msg: "Something went wrong" })
            res.status(400).json(response)
        }
    }

    public deleteKB = async (req: any, res: Response) => {
        const result: any = await this.kBUtils.singleDeleteKB(req.params.id)
        if (result) {
            const response = await ResponseBuilder.respSuccess1({ result: result, msg: "successfully hitting api" })
            res.status(200).json(response)
        }
        else {
            const response = await ResponseBuilder.respSuccess1({ result: result, msg: "Something went wrong" })
            res.status(200).json(response)
        }
    }
    public toggleStatus = async (req: any, res: Response) => {
        const result: any = await this.kBUtils.toggleStatusKB(req.params.id, req.body.status)
        if (result) {
            const response = await ResponseBuilder.respSuccess1({ result: result, msg: "successfully hitting api" })
            res.status(200).json(response)
        }
        else {
            const response = await ResponseBuilder.respSuccess1({ result: result, msg: "Something went wrong" })
            res.status(200).json(response)
        }
    }

    public getPractices = async (req: any, res: Response) => {
        request.get({
            url: "http://skillmgmt.corpnet.co.in/api/api/v1/Practices/GetPractices",
        },
            async (err, response, body) => {
                const data = JSON.parse(body);
                try {
                    if (response.statusCode == 200) {
                        const practice = data.Data;
                        practice.forEach(async element => {
                            const check = await this.kBUtils.dataCheckOfPractice(element.Value)
                            if (check == false) {
                                const data = {
                                    practice_name: element.Value,
                                    is_active: element.IsActive ? 1 : 0,
                                    is_deleted: element.IsDeleted ? 1 : 0,
                                }
                                return await this.kBUtils.dataEntryOfPractice(data)
                            }
                            else {
                                if (check.practice_name != element.Value || check.is_active != element.Value || check.is_deleted != element.Value) {
                                    const data = {
                                        practice_name: element.Value,
                                        is_active: element.IsActive ? 1 : 0,
                                        is_deleted: element.IsDeleted ? 1 : 0,
                                    }
                                    return await this.kBUtils.updateEntryOfPractice(data, check.id)
                                }
                            }
                        });
                        const response = await ResponseBuilder.respSuccess1({ result: practice, msg: "successfully hitting api" })
                        return res.status(200).json(response)
                    }
                }
                catch (err) {
                    return res.status(400).json({ msg: "opps some thing went wrong" })
                }
            });
    }
    public getProject = async (req: any, res: Response) => {
        request.get({
            url: "https://skillmgmt.corpnet.co.in/api/api/v1/Project/GetProjects",
        },
            async (err, response, body) => {
                const data = JSON.parse(body);
                if (data.Data.data) {
                    const project = data.Data.data;
                    project.forEach(async element => {
                        const check = await this.kBUtils.dataCheckofProject(element.Value)
                        if (check == false) {
                            const data = {
                                project_name: element.ProjectName,
                                is_active: element.IsActive ? 0 : 1,
                                is_deleted: element.IsDeleted ? 1 : 0,
                            }
                            return await this.kBUtils.dataEntryOfProject(data)
                        }
                    });
                    const response = await ResponseBuilder.respSuccess1({ result: project, msg: "successfully hitting api" })
                    return res.status(200).json(response)
                }
            });
    }
    public getTeams = async (req: any, res: Response) => {
        request.post({
            url: "https://adsyncapi.corpnet.co.in/api/V2/ADService/Teams",
            headers: {
                "private-key": "F8C5D756-C56C-431C-A76D-A04DF802BA52"
            }
        },
            async (err, response, body) => {
                const data = JSON.parse(body);
                try {
                    if (data) {
                        data.forEach(async element => {
                            const check = await this.kBUtils.dataCheckOfTeams(element.Name)
                            if (check == false) {
                                const data = {
                                    team_name: element.Name,
                                    is_active: 1,
                                    is_deleted: 0,
                                }
                                return await this.kBUtils.dataEntryOfTeams(data)
                            }
                            else {
                                if (check.team_name != element.Name) {
                                    const data = {
                                        team_name: element.Name,
                                    }
                                    return await this.kBUtils.updateEntryOfTeams(data, check.id)
                                }
                            }
                        });
                        const response = await ResponseBuilder.respSuccess1({ result: data, msg: "successfully hitting api" })
                        return res.status(200).json(response)
                    }
                }
                catch (err) {
                    return res.status(400).json({ msg: "opps some thing went wrong" })
                }
            });
    }

    public searchKB = async (req: any, res: Response) => {
        // var result: ResponseBuilder = await this.kBUtils.SearchKB(req.body);
        if (req.body.type == "title") {
            var result: ResponseBuilder = await this.kBUtils.SearchKB(req.body);
        }
        else if (req.body.type == "all") {
            var result: ResponseBuilder = await this.kBUtils.SearchByAll(req.body);
        }
        else if (req.body.type == "cat") {
            var result: ResponseBuilder = await this.kBUtils.SearchByCategory(req.body);
        }
        else if (req.body.type == "pract") {
            var result: ResponseBuilder = await this.kBUtils.SearchByPractice(req.body);
        }
        else if (req.body.type == "project") {
            var result: ResponseBuilder = await this.kBUtils.SearchByProject(req.body);
        }
        else if (req.body.type == "client") {
            var result: ResponseBuilder = await this.kBUtils.SearchByClient(req.body);
        }
        else if (req.body.type == "tag") {
            var result: ResponseBuilder = await this.kBUtils.SearchByTag(req.body);
        }

        if (result) {
            const response = ResponseBuilder.getSuccessResponse(
                result.result,
                "KB Searched Successfully."
            );
            res.status(200).json(response)
        }
        else {
            const response = ResponseBuilder.getSuccessResponse({}, "Error");
            res.status(500).json(response);
        }
    }

    public getMenu = async (req: any, res: Response) => {
        let filename = req.body.menutoken;
        let data = await fs.readFile("./localStorage/" + filename, 'utf8', function (err, data) {
            if (err) throw err;
            res.status(200).send({
                msg:"get token",
                item:data
            })
            return data;
        }
        );
    }

    public kbComments = async (req: any, res: Response) => {
        const approver = {
            "approver": req.body.approver_name
        }
        var emailForApprover;
        if (approver) {
            request.post({
                url: `https://rbac.devitsandbox.com/node/api/v1/user/kb_email_approver`,
                headers: {
                    "content-type": "application/json",
                    "origin": "https://kb.devitsandbox.com"
                },
                body: approver,
                json: true
            }
                , async (err, response: any, body: any) => {
                    try {
                        if (response) {
                            emailForApprover = body.email
                            await this.commentEmail(req, res, emailForApprover);

                        }
                    } catch {
                        if (err) {
                            console.log("Data not found")
                        }
                    }
                }
            );
        }
    }

        public commentEmail = async (req: any, res: Response, emailForApprover: any) => {

        let comment = {
            comment: req.body.comment,
            kb_detail_id: req.body.kb_detail_id,
            is_comment_approved: req.body.is_comment_approved,
            created_by: req.body.created_by,
        };

        comment.created_by = comment.created_by;
        const result: ResponseBuilder = await this.kBUtils.commentKB(comment);
        if (result) {
            const response = ResponseBuilder.getSuccessResponse(
                result.result,
                "Your Comment is Submitted Successfully. Wait for your comment to be Approved !"
            );

            const a11 = req.body.created_by.split("@")
            const a1 = a11[0].split(".")

            const emailData = {
                "fullname": req.body.approver_name,
                "first_name1": a1[0].charAt(0).toUpperCase() + a1[0].slice(1),
                "last_name1": a1[1].charAt(0).toUpperCase() + a1[1].slice(1),
                "Comment_posted": req.body.comment,
                "Kb_title": req.body.title,
                "created_on": moment().format("YYYY-MM-DD HH:mm:ss"),
                "team": req.body.team,
                "practice": req.body.practice,
                "kb_approved_by": emailForApprover,
                "required_url": process.env.NODE_COMMENTAPPROVE_URL
            }

            res.status(200).json(response);
            SendEmail.sendRawMail("kbComment", emailData, [req.body.created_by],
                `Comment for Approval`, "");
            res.status(200).json(response)
        }
        else {
            const response = ResponseBuilder.getSuccessResponse({}, 'Something went Wrong !');
            res.status(result.code).json(response);
        }
    }


    public getKBComment = async (req: any, res: Response) => {
        const result: any = await this.kBUtils.getKbComments(req.params.id)
        if (result) {
            if (!isEmpty(result)) {
                const response = await ResponseBuilder.respSuccess1({ result: result, msg: "successfully hitting api" })
                res.status(200).json(response)
            } else {
                const response = await ResponseBuilder.errorMessage({ msg: "Not geting any data" })
                res.status(200).json(response)
            }

        }
        else {
            const response = await ResponseBuilder.respSuccess1({ result: result, msg: "Something went wrong" })
            res.status(400).json(response)
        }
    }

    public kbProblemResolved = async (req: any, res: Response) => {
        const result: ResponseBuilder = await this.kBUtils.problemResolved(req.body);
        if (result) {
            const response = ResponseBuilder.getSuccessResponse(
                result.result,
                "Action Performed Successfully."
            );
            res.status(200).json(response)
        }
        else {
            const response = ResponseBuilder.getSuccessResponse({}, result.message);
            res.status(result.code).json(response);
        }
    }

    public myKB = async (req: any, res: Response) => {
        const result: ResponseBuilder = await this.kBUtils.mykbList(req.body);
        if (result) {
            const response = ResponseBuilder.getSuccessResponse(
                result.result,
                "Action Performed Successfully."
            );
            res.status(200).json(response)
        }
        else {
            const response = ResponseBuilder.getSuccessResponse({}, result.message);
            res.status(result.code).json(response);
        }
    }

    //FOR SPECIFIC KB
    public getRating = async (req: any, res: Response) => {
        const result: ResponseBuilder = await this.kBUtils.getRatingsOnKB(req.params.id)
        if (result) {
            const response = ResponseBuilder.getSuccessResponse(
                result[0],
                "Maximum Rating."
            );
            res.status(200).json(response)
        }
        else {
            const response = ResponseBuilder.getSuccessResponse({}, result.message);
            res.status(result.code).json(response);
        }
    }
    public postRating = async (req: any, res: Response) => {
        const rating = req.body
        const result: ResponseBuilder = await this.kBUtils.postRatingsOnKB(rating)
        if (result) {
            const response = ResponseBuilder.getSuccessResponse(
                result.result,
                "Rating is Given Successfully."
            );
            res.status(200).json(response)
        }
        else {
            const response = ResponseBuilder.getSuccessResponse({}, result.message);
            res.status(result.code).json(response);
        }
    }
    public postKbLike = async (req: any, res: Response) => {
        const likes = req.body
        const result: ResponseBuilder = await this.kBUtils.postLikesOnKB(likes)
        if (result) {
            const response = ResponseBuilder.getSuccessResponse(
                result.result,
                "KB Liked Successfully."
            );
            res.status(200).json(response)
        }
        else {
            const response = ResponseBuilder.getSuccessResponse({}, result.message);
            res.status(result.code).json(response);
        }
    }

    public getKbViewCount = async (req: any, res: Response) => {
        const result: ResponseBuilder = await this.kBUtils.KBViewed({
            kb_detail_id: req.params.id,
            // created_by: req.body.create_by,
        })
        if (result) {
            const response = ResponseBuilder.getSuccessResponse(
                result[0],
                "Kb Viewed Count."
            );
            res.status(200).json(response)
        }
        else {
            const response = ResponseBuilder.notFound("Data not found");
            res.status(200).json(response);
        }
    }
    public checkingKBViews = async (req: any, res: Response) => {
        const result: ResponseBuilder = await this.kBUtils.checkIfKBisViewed({
            kb_detail_id: req.body.kb_detail_id,
            created_by: req.body.create_by,
        })
        if (!isEmpty(result)) {
            const response = ResponseBuilder.getSuccessResponse(
                result[0],
                "Kb is Already Viewed."
            );
            res.status(200).json(response)
        }
        else {
            const response = ResponseBuilder.notFound("Data not found");
            res.status(200).json(response);
        }
    }
    public enterViewedKBPost = async (req: any, res: Response) => {
        const result: ResponseBuilder = await this.kBUtils.kbPostViewed({
            kb_detail_id: req.body.kb_detail_id,
            created_by: req.body.create_by,
            is_view: req.body.is_view
        })
        if (!isEmpty(result)) {
            const response = ResponseBuilder.getSuccessResponse(
                result[0],
                "Kb is Viewed Successfully."
            );
            res.status(200).json(response)
        }
        else {
            const response = ResponseBuilder.errorMessage("Data not found");
            res.status(200).json(response);
        }
    }

    public isUseFul = async (req: any, res: Response) => {
        const result: ResponseBuilder = await this.kBUtils.KbIsUseful(req.body)
        if (!isEmpty(result)) {
            const response = ResponseBuilder.getSuccessResponse(
                result[0],
                "Feedback Submitted Successfully"
            );
            res.status(200).json(response)
        }
        else {
            const response = ResponseBuilder.notFound("Data not found");
            res.status(200).json(response);
        }
    }

    public getUserDetails = async (req: any, res: Response) => {
        const data = {
            "email": req.body.email
        }
        request.post({
            url: "https://rbac.devitsandbox.com/node/api/v1/user/user-details",
            headers: {
                "content-type": "application/json",
            },
            body: data,
            json: true
        },
            async (err, response, body) => {
                try {
                    if (response) {

                        res.cookie("token", body.token);
                        return res.status(200).json({ msg: "Userdata list fetch successfully", data: body });
                    } else {
                        return res.status(400).json({ msg: "Userdata not found" });
                    }
                } catch {
                    if (err) {
                        res.status(500).json({ errors: "something went wrong", err: err });
                    }
                }
            })
    }

    public getUserEmail = async (req: any, res: Response) => {
        const approver = {
            "approver": req.body.email
        }
        var emailForApprover;
        request.post({
            url: `https://rbac.devitsandbox.com/node/api/v1/user/kb_email_approver`,
                headers: {
                    "content-type": "application/json",
                    "origin": "https://kb.devitsandbox.com"
                },
                body: approver,
                json: true
        },
            async (err, response, body) => {
                try {
                    if (response) {
                        res.cookie("token", body.email);
                        return res.status(200).json({ msg: "Userdata list fetch successfully", data: body });
                    } else {
                        return res.status(400).json({ msg: "Userdata not found" });
                    }
                } catch {
                    if (err) {
                        res.status(500).json({ errors: "something went wrong", err: err });
                    }
                }
            })
    }

    public updateCategoryColor = async (req: any, res: Response) => {
        const result: any = await this.kBUtils.addCategoryColor(req.body);
        if (result) {
            const response = await ResponseBuilder.respSuccess1({ result: result, msg: "Category Color Added Successfully" })
            res.status(200).json(response)
        }
        else {
            const response = await ResponseBuilder.respSuccess1({ result: result, msg: "Something went wrong" })
            res.status(400).json(response)
        }
    }

}