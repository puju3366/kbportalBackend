// Import only what we need from express
import { Router } from "express";
import { Validator } from "../../../validate";
import { UserController } from "./userController";
import { UserMiddleware } from "./userMiddleware";
import { SendPushNotification } from "../../../helpers/SendPushNotification";

import {
    UserModel, LoginModel,
    ForgotPasswordModel, ResetPasswordModel, ChangePasswordModel, sendOTPModel, VerifyOtpModel, VerifyUser

} from "./userModel";
import { Middleware } from "../../../middleware";

// Assign router to the express.Router() instance
const router: Router = Router();
const v: Validator = new Validator();
const userController = new UserController();
const userMiddleware = new UserMiddleware();
const middleware = new Middleware();

router.get("/test", (req,res) => {
    res.send("This is a test routing!");
});
router.post("/login", v.validate(LoginModel),userController.login);
router.post("/adfslogin",userController.adfslogin);
router.post("/sign-up", v.validate(UserModel), userMiddleware.checkEmailExists, userController.signup);
router.post("/verify-otp", v.validate(VerifyOtpModel), userController.verifyOtp);
router.post("/send-otp", v.validate(sendOTPModel), userController.sendOTP);
router.post("/reset-password", v.validate(ResetPasswordModel), userController.resetPassword);
router.post("/change-password", v.validate(ChangePasswordModel), middleware.getUserAuthorized, userMiddleware.verifyOldPassword, userController.updatePassword);
router.get("/get-profile/:id", userMiddleware.IsValidId, userController.getProfile);
router.get('/match-schedule', userController.getMatchSchedule);
router.get('/banner-sponser', userController.getBannerSponser);
router.post('/user-verification',v.validate(VerifyUser), userController.userVerification);


export const UserRoute: Router = router;