"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
const express = require("express");
const l10n = require("jm-ez-l10n");
const userRoute_1 = require("./v1/modules/user/userRoute");
const kbApproverRoute_1 = require("./v1/modules/KBApprover/kbApproverRoute");
const bodyParser = require("body-parser");
const kBRoutes_1 = require("./v1/modules/KB/kBRoutes");
const dashBoardRoutes_1 = require("./v1/modules/dashboard/dashBoardRoutes");
const userController_1 = require("./v1/modules/user/userController");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
class Routes {
    constructor(NODE_ENV) {
        this.userController = new userController_1.UserController();
        switch (NODE_ENV) {
            case "production":
                this.basePath = "/app/dist";
                break;
            case "development":
                this.basePath = "/app/tmp";
                break;
        }
    }
    defaultRoute(req, res) {
        res.json({
            message: "Hello !",
        });
    }
    path() {
        const router = express.Router();
        router.use("/user", userRoute_1.UserRoute);
        router.use("/kb", kBRoutes_1.KBRoute);
        router.use("/dashboard", dashBoardRoutes_1.DashBoardRoute);
        router.use("/kbapprover", kbApproverRoute_1.KbApproverRoute);
        router.get('/login', (req, res) => {
            res.sendFile(__dirname + '/index.html');
        });
        router.get('/notification/:token', (req, res) => {
            res.sendFile(__dirname + '/notification.html');
        });
        router.post('/sendnotification', urlencodedParser, this.userController.getAllNotification);
        router.all("/*", (req, res) => {
            return res.status(404).json({ message: l10n.t("ERR_URL_NOT_FOUND"), code: 404, status: false, result: null });
        });
        return router;
    }
}
exports.Routes = Routes;
//# sourceMappingURL=routes.js.map