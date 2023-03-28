import express = require("express");
import * as l10n from "jm-ez-l10n";
import { UserRoute } from "./v1/modules/user/userRoute";
import { KbApproverRoute } from "./v1/modules/KBApprover/kbApproverRoute";
import * as bodyParser from "body-parser";
import { KBRoute } from "./v1/modules/KB/kBRoutes";
import { DashBoardRoute } from "./v1/modules/dashboard/dashBoardRoutes";
import { UserController } from "./v1/modules/user/userController";

var urlencodedParser = bodyParser.urlencoded({ extended: false })
export class Routes {
  protected basePath: string;
  public userController = new UserController();
  
  constructor(NODE_ENV: string) {
    switch (NODE_ENV) {
      case "production":
        this.basePath = "/app/dist";
        break;
      case "development":
        this.basePath = "/app/tmp";
        break;
    }
  }

  public defaultRoute(req: express.Request, res: express.Response) {
    res.json({
      message: "Hello !",
    });
  }

  public path() {
    const router = express.Router();
    router.use("/user", UserRoute);
    router.use("/kb", KBRoute);
    router.use("/dashboard",DashBoardRoute);
    router.use("/kbapprover", KbApproverRoute);
    router.get('/login', (req, res) => {
      res.sendFile(__dirname + '/index.html');
  });
    router.get('/notification/:token', (req, res) => {
        res.sendFile(__dirname + '/notification.html');
    });
    router.post('/sendnotification', urlencodedParser, this.userController.getAllNotification)
    router.all("/*", (req, res) => {
      return res.status(404).json({ message: l10n.t("ERR_URL_NOT_FOUND"), code: 404, status: false, result : null });
    });
    return router;
  }
}