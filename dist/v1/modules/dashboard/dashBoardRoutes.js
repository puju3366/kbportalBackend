"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashBoardRoute = void 0;
const express_1 = require("express");
const validate_1 = require("../../../validate");
const dashBoardControler_1 = require("./dashBoardControler");
const dashBoardMiddleware_1 = require("./dashBoardMiddleware");
const router = express_1.Router();
const dashboardControler = new dashBoardControler_1.DashBoardControler();
const v = new validate_1.Validator();
const dashboardMiddleware = new dashBoardMiddleware_1.DashBoardMiddleware();
//*
router.get("/getAllKbCount", dashboardControler.getAllKBCount);
router.get("/getkbbymonth", dashboardControler.getKBByMonth);
router.get("/getKbPracticeCount", dashboardControler.getKbPracticeCount);
router.post("/getKbProjectCount", dashboardControler.getKbProjectCount);
router.get("/getUnreviewedKbCount", dashboardControler.getUnreviewedKB);
router.get("/kbPerTechnology", dashboardControler.getKBPerTechnology);
router.get("/kbPerResolvedIssue", dashboardControler.getKBPerResolvedIssue);
//*
//Quarter on quarter kb count by practice
router.post("/getQuarterOneCount", dashboardControler.getQuarterOneCount);
exports.DashBoardRoute = router;
//# sourceMappingURL=dashBoardRoutes.js.map