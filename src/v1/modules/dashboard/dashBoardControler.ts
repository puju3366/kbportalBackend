import { Response } from "express";
import { Utils } from "../../../helpers/utils";
import { DashBoardUtils } from "./dashBoardUtils";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
const request = require('request');

export class DashBoardControler {
    private utils: Utils = new Utils();
    private dashboardUtils: DashBoardUtils = new DashBoardUtils();

    public getAllKBCount = async (req: any, res: Response) => {
        const result: any = await this.dashboardUtils.getAllCounts()
        if (result) {
            const response = await ResponseBuilder.respSuccess1({ result: result, msg: "Count fetched successfully" })
            res.status(200).json(response)
        }
        else {
            const response = await ResponseBuilder.respSuccess1({ msg: "Something went wrong" })
            res.status(404).json(response)
        }
    }
    public getKBByMonth = async (req: any, res: Response) => {
        const result: any = await this.dashboardUtils.getKBByMonth()
        if (result) {
            const response = await ResponseBuilder.respSuccess1({ result: result, msg: "Count fetched successfully" })
            res.status(200).json(response)
        }
        else {
            const response = await ResponseBuilder.respSuccess1({ msg: "Something went wrong" })
            res.status(404).json(response)
        }
    }
    public getKbPracticeCount = async (req: any, res: Response) => {
        const result: any = await this.dashboardUtils.getKbPracticeCounts()
        if (result) {
            const response = await ResponseBuilder.respSuccess1({ result: result, msg: "Kb Practice Count fetched successfully" })
            res.status(200).json(response)
        }
        else {
            const response = await ResponseBuilder.respSuccess1({ msg: "Something went wrong" })
            res.status(404).json(response)
        }
    }

    public getKbProjectCount = async (req: any, res: Response) => {
        const result: any = await this.dashboardUtils.getKbProjectCounts(req.body.practice)
        if (result) {
            const response = await ResponseBuilder.respSuccess1({ result: result, msg: "Kb Project Count fetched successfully" })
            res.status(200).json(response)
        }
        else {
            const response = await ResponseBuilder.respSuccess1({ msg: "Something went wrong" })
            res.status(404).json(response)
        }

    }
    public getUnreviewedKB = async (req: any, res: Response) => {
        const result: any = await this.dashboardUtils.getunreviewedKB()
        if (result) {
            const response = await ResponseBuilder.respSuccess1({ result: result, msg: "Unreviewed KB Count fetched successfully" })
            res.status(200).json(response)
        }
        else {
            const response = await ResponseBuilder.respSuccess1({ msg: "Something went wrong" })
            res.status(404).json(response)
        }
    }

    public getKBPerTechnology = async (req: any, res: Response) => {
        const result: any = await this.dashboardUtils.getKbPerTechnology()
        if (result) {
            const response = await ResponseBuilder.respSuccess1({ result: result, msg: "KB per technology Count fetched successfully" })
            res.status(200).json(response)
        }
        else {
            const response = await ResponseBuilder.respSuccess1({ msg: "Something went wrong" })
            res.status(404).json(response)
        }
    }

    public getKBPerResolvedIssue = async (req: any, res: Response) => {
        const result: any = await this.dashboardUtils.getKBPerResolvedIssues();
        if (result) {
            const response = await ResponseBuilder.respSuccess1({ result: result, msg: "KB per technology Count fetched successfully" })
            res.status(200).json(response)
        }
        else {
            const response = await ResponseBuilder.respSuccess1({ msg: "Something went wrong" })
            res.status(404).json(response)
        }
    }
    public getQuarterOneCount = async (req: any, res: Response) => {
        const result: any = await this.dashboardUtils.getQuarterOneCount(req.body.year, req.body.quarter)
        if (result) {
            const response = await ResponseBuilder.respSuccess1({ result: result, msg: "Kb Practice Count fetched successfully" })
            res.status(200).json(response)
        }
        else {
            const response = await ResponseBuilder.respSuccess1({ msg: "Something went wrong" })
            res.status(404).json(response)
        }
    }
}