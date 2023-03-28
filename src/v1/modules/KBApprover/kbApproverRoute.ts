import { Router } from "express";
import { Validator } from "../../../validate";
import { KbApproverControler } from "./kbApproverController";
import { KbApproverMiddleware } from "./KbApproverMiddleware";
import { Middleware } from "../../../middleware";
import { SendPushNotification } from "../../../helpers/SendPushNotification";


const router: Router = Router();
const v: Validator = new Validator();
const kbApproverControler = new KbApproverControler();
const kbApproverMiddleware = new KbApproverMiddleware();
const middleware = new Middleware();


router.get("/test", (req,res) => {
    res.send("This is a test routing!");
});

router.post("/kbfeedback/:id", kbApproverControler.kbfeedback);
router.post("/kbvalidate/:id", kbApproverControler.kbvalidate)
// router.get("/kbuserapprover/:id", kbApproverMiddleware.IsUserAprrover,kbApproverControler.kbuserapprover);


export const KbApproverRoute: Router = router;