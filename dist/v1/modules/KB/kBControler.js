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
exports.KBController = void 0;
const utils_1 = require("../../../helpers/utils");
const kBUtils_1 = require("./kBUtils");
const responseBuilder_1 = require("../../../helpers/responseBuilder");
const lodash_1 = require("lodash");
const sendEmail_1 = require("../../../helpers/sendEmail");
const tables_1 = require("../../../config/tables");
const Sql = require("jm-ez-mysql");
const moment = require("moment");
const request = require('request');
var fs = require('fs');
class KBController {
    constructor() {
        this.utils = new utils_1.Utils();
        this.kBUtils = new kBUtils_1.KBUtils();
        this.createKB = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const approver = {
                "approver": req.body.kb_approved_by
            };
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
                }, (err, response, body) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        if (response) {
                            emailForApprover = body.email;
                            yield this.test(req, res, emailForApprover);
                        }
                    }
                    catch (_a) {
                        if (err) {
                            console.log("Data not found");
                        }
                    }
                }));
            }
        });
        this.test = (req, res, emailForApprover) => __awaiter(this, void 0, void 0, function* () {
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
            };
            const result = yield this.kBUtils.insertKB(data);
            let practiceArr = req.body.practice_id.split(",");
            for (var i = 0; i < practiceArr.length; i++) {
                const practice_id = yield this.kBUtils.supportingQuery(practiceArr[i]);
                const practiceData = {
                    practice_id: practice_id[0].id,
                    created_by: req.body.created_by,
                    kb_detail_id: result.lastKbId.insertId,
                };
                const query = yield Sql.insert(tables_1.Tables.KBPRACTICEDETAILS, practiceData);
            }
            if (result) {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: result, msg: "KB Created Successfully" });
                const approver = emailForApprover.split("@");
                const ap1 = approver[0].split(".");
                const a11 = req.body.created_by.split("@");
                const a1 = a11[0].split(".");
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
                };
                res.status(200).json(response);
                sendEmail_1.SendEmail.sendRawMail("kbAprover", emailData, [req.body.kb_assigner], `KB for Approval`, "");
                res.status(200).json(response);
            }
            else {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: result, msg: "Something went wrong" });
                res.status(200).json(response);
            }
        });
        this.getallcomment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.kBUtils.getAllComments();
            if (result) {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: result, msg: "Data fetched successfully" });
                res.status(200).json(response);
            }
            else {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ msg: "Something went wrong" });
                res.status(404).json(response);
            }
        });
        this.getCategories = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.kBUtils.getCategories();
            if (result) {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: result, msg: "Data fetched successfully" });
                res.status(200).json(response);
            }
            else {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ msg: "Something went wrong" });
                res.status(404).json(response);
            }
        });
        this.getProjectData = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.kBUtils.getProjectData();
            if (result) {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: result, msg: "Data fetched successfully" });
                res.status(200).json(response);
            }
            else {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ msg: "Something went wrong" });
                res.status(404).json(response);
            }
        });
        this.getPracticesData = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.kBUtils.getPracticesData();
            if (result) {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: result, msg: "Data fetched successfully" });
                res.status(200).json(response);
            }
            else {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ msg: "Something went wrong" });
                res.status(404).json(response);
            }
        });
        this.getTeamsData = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.kBUtils.getTeamsData();
            if (result) {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: result, msg: "Data fetched successfully" });
                res.status(200).json(response);
            }
            else {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ msg: "Something went wrong" });
                res.status(404).json(response);
            }
        });
        this.getUnapprovedKb = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.kBUtils.getUnapprovedKb();
            if (result) {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: result, msg: req.t("Success") });
                res.status(200).json(response);
            }
            else {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ error: req.t("went_wrong") });
                res.status(404).json(response);
            }
        });
        this.getallKB = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.kBUtils.getAllKBByPract(req.body.practice);
            if (result) {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: result, msg: req.t('Success') });
                res.status(200).json(response);
            }
            else {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: result, msg: "Something went wrong" });
                res.status(200).json(response);
            }
        });
        this.getallKBByCat = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.kBUtils.getAllKBByCat(req.body.category);
            if (result) {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: result, msg: req.t('Success') });
                res.status(200).json(response);
            }
            else {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: result, msg: "Something went wrong" });
                res.status(200).json(response);
            }
        });
        this.kbRejected = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = {
                kb_detail_id: req.body.kb_detail_id,
                approve_reject_comment: req.body.approve_reject_comment,
                is_approve: req.body.is_approve,
                created_by: req.body.created_by,
            };
            const result = yield this.kBUtils.kbRejected(data);
            if (result) {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: result, msg: req.t('Success') });
                res.status(200).json(response);
            }
            else {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: result, msg: "Something went wrong" });
                res.status(200).json(response);
            }
        });
        this.updateKB = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.kBUtils.updateKB(req.body, req.params.id);
            const deletePreviousPractice = yield Sql.query(`DELETE FROM ${tables_1.Tables.KBPRACTICEDETAILS} WHERE kb_detail_id = ${req.params.id};`);
            let practiceArr = req.body.practice_id.split(",");
            for (var i = 0; i < practiceArr.length; i++) {
                const practice_id = yield this.kBUtils.supportingQuery(practiceArr[i]);
                const practiceData = {
                    practice_id: practice_id[0].id,
                    created_by: req.body.created_by,
                    kb_detail_id: req.params.id,
                };
                const query = yield Sql.insert(tables_1.Tables.KBPRACTICEDETAILS, practiceData);
            }
            const practice_id = yield this.kBUtils.supportingQuery(req.body);
            if (result) {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: result, msg: "KB Updated Successfully" });
                res.status(200).json(response);
            }
            else {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: result, msg: "Something went wrong" });
                res.status(200).json(response);
            }
        });
        this.getKBDetails = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.kBUtils.getKbDetails(req.params.id);
            if (result) {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: result, msg: "successfully hitting api" });
                res.status(200).json(response);
            }
            else {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: result, msg: "Something went wrong" });
                res.status(400).json(response);
            }
        });
        this.getPracticeDetails = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.kBUtils.getPracticeDetails(req.params.id);
            if (result) {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: result, msg: "successfully hitting api" });
                res.status(200).json(response);
            }
            else {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: result, msg: "Something went wrong" });
                res.status(400).json(response);
            }
        });
        this.getRelatedKB = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.kBUtils.getRelatedKbPost(req.body.tag, req.body.id);
            if (result) {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: result, msg: "successfully hitting api" });
                res.status(200).json(response);
            }
            else {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: result, msg: "Something went wrong" });
                res.status(400).json(response);
            }
        });
        this.getUserRating = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.kBUtils.getUserRating(req.body);
            if (result) {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: result[0], msg: "successfully hitting api" });
                res.status(200).json(response);
            }
            else {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: result, msg: "Something went wrong" });
                res.status(400).json(response);
            }
        });
        //Image upload API
        this.getImageUpload = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.utils.upload(req.files);
            if (result) {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: result[0], msg: "successfully hitting api" });
                res.status(200).json(result[0]);
            }
            else {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: result, msg: "Something went wrong" });
                res.status(400).json(response);
            }
        });
        this.deleteKB = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.kBUtils.singleDeleteKB(req.params.id);
            if (result) {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: result, msg: "successfully hitting api" });
                res.status(200).json(response);
            }
            else {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: result, msg: "Something went wrong" });
                res.status(200).json(response);
            }
        });
        this.toggleStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.kBUtils.toggleStatusKB(req.params.id, req.body.status);
            if (result) {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: result, msg: "successfully hitting api" });
                res.status(200).json(response);
            }
            else {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: result, msg: "Something went wrong" });
                res.status(200).json(response);
            }
        });
        this.getPractices = (req, res) => __awaiter(this, void 0, void 0, function* () {
            request.get({
                url: "http://skillmgmt.corpnet.co.in/api/api/v1/Practices/GetPractices",
            }, (err, response, body) => __awaiter(this, void 0, void 0, function* () {
                const data = JSON.parse(body);
                try {
                    if (response.statusCode == 200) {
                        const practice = data.Data;
                        practice.forEach((element) => __awaiter(this, void 0, void 0, function* () {
                            const check = yield this.kBUtils.dataCheckOfPractice(element.Value);
                            if (check == false) {
                                const data = {
                                    practice_name: element.Value,
                                    is_active: element.IsActive ? 1 : 0,
                                    is_deleted: element.IsDeleted ? 1 : 0,
                                };
                                return yield this.kBUtils.dataEntryOfPractice(data);
                            }
                            else {
                                if (check.practice_name != element.Value || check.is_active != element.Value || check.is_deleted != element.Value) {
                                    const data = {
                                        practice_name: element.Value,
                                        is_active: element.IsActive ? 1 : 0,
                                        is_deleted: element.IsDeleted ? 1 : 0,
                                    };
                                    return yield this.kBUtils.updateEntryOfPractice(data, check.id);
                                }
                            }
                        }));
                        const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: practice, msg: "successfully hitting api" });
                        return res.status(200).json(response);
                    }
                }
                catch (err) {
                    return res.status(400).json({ msg: "opps some thing went wrong" });
                }
            }));
        });
        this.getProject = (req, res) => __awaiter(this, void 0, void 0, function* () {
            request.get({
                url: "https://skillmgmt.corpnet.co.in/api/api/v1/Project/GetProjects",
            }, (err, response, body) => __awaiter(this, void 0, void 0, function* () {
                const data = JSON.parse(body);
                if (data.Data.data) {
                    const project = data.Data.data;
                    project.forEach((element) => __awaiter(this, void 0, void 0, function* () {
                        const check = yield this.kBUtils.dataCheckofProject(element.Value);
                        if (check == false) {
                            const data = {
                                project_name: element.ProjectName,
                                is_active: element.IsActive ? 0 : 1,
                                is_deleted: element.IsDeleted ? 1 : 0,
                            };
                            return yield this.kBUtils.dataEntryOfProject(data);
                        }
                    }));
                    const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: project, msg: "successfully hitting api" });
                    return res.status(200).json(response);
                }
            }));
        });
        this.getTeams = (req, res) => __awaiter(this, void 0, void 0, function* () {
            request.post({
                url: "https://adsyncapi.corpnet.co.in/api/V2/ADService/Teams",
                headers: {
                    "private-key": "F8C5D756-C56C-431C-A76D-A04DF802BA52"
                }
            }, (err, response, body) => __awaiter(this, void 0, void 0, function* () {
                const data = JSON.parse(body);
                try {
                    if (data) {
                        data.forEach((element) => __awaiter(this, void 0, void 0, function* () {
                            const check = yield this.kBUtils.dataCheckOfTeams(element.Name);
                            if (check == false) {
                                const data = {
                                    team_name: element.Name,
                                    is_active: 1,
                                    is_deleted: 0,
                                };
                                return yield this.kBUtils.dataEntryOfTeams(data);
                            }
                            else {
                                if (check.team_name != element.Name) {
                                    const data = {
                                        team_name: element.Name,
                                    };
                                    return yield this.kBUtils.updateEntryOfTeams(data, check.id);
                                }
                            }
                        }));
                        const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: data, msg: "successfully hitting api" });
                        return res.status(200).json(response);
                    }
                }
                catch (err) {
                    return res.status(400).json({ msg: "opps some thing went wrong" });
                }
            }));
        });
        this.searchKB = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // var result: ResponseBuilder = await this.kBUtils.SearchKB(req.body);
            if (req.body.type == "title") {
                var result = yield this.kBUtils.SearchKB(req.body);
            }
            else if (req.body.type == "all") {
                var result = yield this.kBUtils.SearchByAll(req.body);
            }
            else if (req.body.type == "cat") {
                var result = yield this.kBUtils.SearchByCategory(req.body);
            }
            else if (req.body.type == "pract") {
                var result = yield this.kBUtils.SearchByPractice(req.body);
            }
            else if (req.body.type == "project") {
                var result = yield this.kBUtils.SearchByProject(req.body);
            }
            else if (req.body.type == "client") {
                var result = yield this.kBUtils.SearchByClient(req.body);
            }
            else if (req.body.type == "tag") {
                var result = yield this.kBUtils.SearchByTag(req.body);
            }
            if (result) {
                const response = responseBuilder_1.ResponseBuilder.getSuccessResponse(result.result, "KB Searched Successfully.");
                res.status(200).json(response);
            }
            else {
                const response = responseBuilder_1.ResponseBuilder.getSuccessResponse({}, "Error");
                res.status(500).json(response);
            }
        });
        this.getMenu = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let filename = req.body.menutoken;
            let data = yield fs.readFile("./localStorage/" + filename, 'utf8', function (err, data) {
                if (err)
                    throw err;
                res.status(200).send({
                    msg: "get token",
                    item: data
                });
                return data;
            });
        });
        this.kbComments = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const approver = {
                "approver": req.body.approver_name
            };
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
                }, (err, response, body) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        if (response) {
                            emailForApprover = body.email;
                            yield this.commentEmail(req, res, emailForApprover);
                        }
                    }
                    catch (_b) {
                        if (err) {
                            console.log("Data not found");
                        }
                    }
                }));
            }
        });
        this.commentEmail = (req, res, emailForApprover) => __awaiter(this, void 0, void 0, function* () {
            let comment = {
                comment: req.body.comment,
                kb_detail_id: req.body.kb_detail_id,
                is_comment_approved: req.body.is_comment_approved,
                created_by: req.body.created_by,
            };
            comment.created_by = comment.created_by;
            const result = yield this.kBUtils.commentKB(comment);
            if (result) {
                const response = responseBuilder_1.ResponseBuilder.getSuccessResponse(result.result, "Your Comment is Submitted Successfully. Wait for your comment to be Approved !");
                const a11 = req.body.created_by.split("@");
                const a1 = a11[0].split(".");
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
                };
                res.status(200).json(response);
                sendEmail_1.SendEmail.sendRawMail("kbComment", emailData, [req.body.created_by], `Comment for Approval`, "");
                res.status(200).json(response);
            }
            else {
                const response = responseBuilder_1.ResponseBuilder.getSuccessResponse({}, 'Something went Wrong !');
                res.status(result.code).json(response);
            }
        });
        this.getKBComment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.kBUtils.getKbComments(req.params.id);
            if (result) {
                if (!lodash_1.isEmpty(result)) {
                    const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: result, msg: "successfully hitting api" });
                    res.status(200).json(response);
                }
                else {
                    const response = yield responseBuilder_1.ResponseBuilder.errorMessage({ msg: "Not geting any data" });
                    res.status(200).json(response);
                }
            }
            else {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: result, msg: "Something went wrong" });
                res.status(400).json(response);
            }
        });
        this.kbProblemResolved = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.kBUtils.problemResolved(req.body);
            if (result) {
                const response = responseBuilder_1.ResponseBuilder.getSuccessResponse(result.result, "Action Performed Successfully.");
                res.status(200).json(response);
            }
            else {
                const response = responseBuilder_1.ResponseBuilder.getSuccessResponse({}, result.message);
                res.status(result.code).json(response);
            }
        });
        this.myKB = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.kBUtils.mykbList(req.body);
            if (result) {
                const response = responseBuilder_1.ResponseBuilder.getSuccessResponse(result.result, "Action Performed Successfully.");
                res.status(200).json(response);
            }
            else {
                const response = responseBuilder_1.ResponseBuilder.getSuccessResponse({}, result.message);
                res.status(result.code).json(response);
            }
        });
        //FOR SPECIFIC KB
        this.getRating = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.kBUtils.getRatingsOnKB(req.params.id);
            if (result) {
                const response = responseBuilder_1.ResponseBuilder.getSuccessResponse(result[0], "Maximum Rating.");
                res.status(200).json(response);
            }
            else {
                const response = responseBuilder_1.ResponseBuilder.getSuccessResponse({}, result.message);
                res.status(result.code).json(response);
            }
        });
        this.postRating = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const rating = req.body;
            const result = yield this.kBUtils.postRatingsOnKB(rating);
            if (result) {
                const response = responseBuilder_1.ResponseBuilder.getSuccessResponse(result.result, "Rating is Given Successfully.");
                res.status(200).json(response);
            }
            else {
                const response = responseBuilder_1.ResponseBuilder.getSuccessResponse({}, result.message);
                res.status(result.code).json(response);
            }
        });
        this.postKbLike = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const likes = req.body;
            const result = yield this.kBUtils.postLikesOnKB(likes);
            if (result) {
                const response = responseBuilder_1.ResponseBuilder.getSuccessResponse(result.result, "KB Liked Successfully.");
                res.status(200).json(response);
            }
            else {
                const response = responseBuilder_1.ResponseBuilder.getSuccessResponse({}, result.message);
                res.status(result.code).json(response);
            }
        });
        this.getKbViewCount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.kBUtils.KBViewed({
                kb_detail_id: req.params.id,
            });
            if (result) {
                const response = responseBuilder_1.ResponseBuilder.getSuccessResponse(result[0], "Kb Viewed Count.");
                res.status(200).json(response);
            }
            else {
                const response = responseBuilder_1.ResponseBuilder.notFound("Data not found");
                res.status(200).json(response);
            }
        });
        this.checkingKBViews = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.kBUtils.checkIfKBisViewed({
                kb_detail_id: req.body.kb_detail_id,
                created_by: req.body.create_by,
            });
            if (!lodash_1.isEmpty(result)) {
                const response = responseBuilder_1.ResponseBuilder.getSuccessResponse(result[0], "Kb is Already Viewed.");
                res.status(200).json(response);
            }
            else {
                const response = responseBuilder_1.ResponseBuilder.notFound("Data not found");
                res.status(200).json(response);
            }
        });
        this.enterViewedKBPost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.kBUtils.kbPostViewed({
                kb_detail_id: req.body.kb_detail_id,
                created_by: req.body.create_by,
                is_view: req.body.is_view
            });
            if (!lodash_1.isEmpty(result)) {
                const response = responseBuilder_1.ResponseBuilder.getSuccessResponse(result[0], "Kb is Viewed Successfully.");
                res.status(200).json(response);
            }
            else {
                const response = responseBuilder_1.ResponseBuilder.errorMessage("Data not found");
                res.status(200).json(response);
            }
        });
        this.isUseFul = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.kBUtils.KbIsUseful(req.body);
            if (!lodash_1.isEmpty(result)) {
                const response = responseBuilder_1.ResponseBuilder.getSuccessResponse(result[0], "Feedback Submitted Successfully");
                res.status(200).json(response);
            }
            else {
                const response = responseBuilder_1.ResponseBuilder.notFound("Data not found");
                res.status(200).json(response);
            }
        });
        this.getUserDetails = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = {
                "email": req.body.email
            };
            request.post({
                url: "https://rbac.devitsandbox.com/node/api/v1/user/user-details",
                headers: {
                    "content-type": "application/json",
                },
                body: data,
                json: true
            }, (err, response, body) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (response) {
                        res.cookie("token", body.token);
                        return res.status(200).json({ msg: "Userdata list fetch successfully", data: body });
                    }
                    else {
                        return res.status(400).json({ msg: "Userdata not found" });
                    }
                }
                catch (_c) {
                    if (err) {
                        res.status(500).json({ errors: "something went wrong", err: err });
                    }
                }
            }));
        });
        this.getUserEmail = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const approver = {
                "approver": req.body.email
            };
            var emailForApprover;
            request.post({
                url: `https://rbac.devitsandbox.com/node/api/v1/user/kb_email_approver`,
                headers: {
                    "content-type": "application/json",
                    "origin": "https://kb.devitsandbox.com"
                },
                body: approver,
                json: true
            }, (err, response, body) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (response) {
                        res.cookie("token", body.email);
                        return res.status(200).json({ msg: "Userdata list fetch successfully", data: body });
                    }
                    else {
                        return res.status(400).json({ msg: "Userdata not found" });
                    }
                }
                catch (_d) {
                    if (err) {
                        res.status(500).json({ errors: "something went wrong", err: err });
                    }
                }
            }));
        });
        this.updateCategoryColor = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.kBUtils.addCategoryColor(req.body);
            if (result) {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: result, msg: "Category Color Added Successfully" });
                res.status(200).json(response);
            }
            else {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: result, msg: "Something went wrong" });
                res.status(400).json(response);
            }
        });
    }
}
exports.KBController = KBController;
//# sourceMappingURL=kBControler.js.map