import { Router } from "express";
import { Validator } from "../../../validate";
import { DashBoardControler } from "./dashBoardControler";
import { DashBoardMiddleware } from "./dashBoardMiddleware";

const router: Router = Router();
const dashboardControler = new DashBoardControler();
const v: Validator = new Validator()
const dashboardMiddleware = new DashBoardMiddleware()

//*
router.get("/getAllKbCount",dashboardControler.getAllKBCount)
router.get("/getkbbymonth", dashboardControler.getKBByMonth)
router.get("/getKbPracticeCount",dashboardControler.getKbPracticeCount)
router.post("/getKbProjectCount",dashboardControler.getKbProjectCount)
router.get("/getUnreviewedKbCount",dashboardControler.getUnreviewedKB)
router.get("/kbPerTechnology",dashboardControler.getKBPerTechnology)
router.get("/kbPerResolvedIssue",dashboardControler.getKBPerResolvedIssue)
//*

//Quarter on quarter kb count by practice
router.post("/getQuarterOneCount",dashboardControler.getQuarterOneCount)

export const DashBoardRoute: Router = router;
