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
exports.DashBoardControler = void 0;
const utils_1 = require("../../../helpers/utils");
const dashBoardUtils_1 = require("./dashBoardUtils");
const responseBuilder_1 = require("../../../helpers/responseBuilder");
const request = require('request');
class DashBoardControler {
    constructor() {
        this.utils = new utils_1.Utils();
        this.dashboardUtils = new dashBoardUtils_1.DashBoardUtils();
        this.getAllKBCount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.dashboardUtils.getAllCounts();
            if (result) {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: result, msg: "Count fetched successfully" });
                res.status(200).json(response);
            }
            else {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ msg: "Something went wrong" });
                res.status(404).json(response);
            }
        });
        this.getKBByMonth = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.dashboardUtils.getKBByMonth();
            if (result) {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: result, msg: "Count fetched successfully" });
                res.status(200).json(response);
            }
            else {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ msg: "Something went wrong" });
                res.status(404).json(response);
            }
        });
        this.getKbPracticeCount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.dashboardUtils.getKbPracticeCounts();
            if (result) {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: result, msg: "Kb Practice Count fetched successfully" });
                res.status(200).json(response);
            }
            else {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ msg: "Something went wrong" });
                res.status(404).json(response);
            }
        });
        this.getKbProjectCount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.dashboardUtils.getKbProjectCounts(req.body.practice);
            if (result) {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: result, msg: "Kb Project Count fetched successfully" });
                res.status(200).json(response);
            }
            else {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ msg: "Something went wrong" });
                res.status(404).json(response);
            }
        });
        this.getUnreviewedKB = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.dashboardUtils.getunreviewedKB();
            if (result) {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: result, msg: "Unreviewed KB Count fetched successfully" });
                res.status(200).json(response);
            }
            else {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ msg: "Something went wrong" });
                res.status(404).json(response);
            }
        });
        this.getKBPerTechnology = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.dashboardUtils.getKbPerTechnology();
            if (result) {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: result, msg: "KB per technology Count fetched successfully" });
                res.status(200).json(response);
            }
            else {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ msg: "Something went wrong" });
                res.status(404).json(response);
            }
        });
        this.getKBPerResolvedIssue = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.dashboardUtils.getKBPerResolvedIssues();
            if (result) {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: result, msg: "KB per technology Count fetched successfully" });
                res.status(200).json(response);
            }
            else {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ msg: "Something went wrong" });
                res.status(404).json(response);
            }
        });
        this.getQuarterOneCount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.dashboardUtils.getQuarterOneCount(req.body.year, req.body.quarter);
            if (result) {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ result: result, msg: "Kb Practice Count fetched successfully" });
                res.status(200).json(response);
            }
            else {
                const response = yield responseBuilder_1.ResponseBuilder.respSuccess1({ msg: "Something went wrong" });
                res.status(404).json(response);
            }
        });
    }
}
exports.DashBoardControler = DashBoardControler;
//# sourceMappingURL=dashBoardControler.js.map