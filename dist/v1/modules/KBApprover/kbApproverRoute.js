"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KbApproverRoute = void 0;
const express_1 = require("express");
const validate_1 = require("../../../validate");
const kbApproverController_1 = require("./kbApproverController");
const KbApproverMiddleware_1 = require("./KbApproverMiddleware");
const middleware_1 = require("../../../middleware");
const router = express_1.Router();
const v = new validate_1.Validator();
const kbApproverControler = new kbApproverController_1.KbApproverControler();
const kbApproverMiddleware = new KbApproverMiddleware_1.KbApproverMiddleware();
const middleware = new middleware_1.Middleware();
router.get("/test", (req, res) => {
    res.send("This is a test routing!");
});
router.post("/kbfeedback/:id", kbApproverControler.kbfeedback);
router.post("/kbvalidate/:id", kbApproverControler.kbvalidate);
// router.get("/kbuserapprover/:id", kbApproverMiddleware.IsUserAprrover,kbApproverControler.kbuserapprover);
exports.KbApproverRoute = router;
//# sourceMappingURL=kbApproverRoute.js.map