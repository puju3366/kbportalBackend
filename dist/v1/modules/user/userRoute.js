"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoute = void 0;
// Import only what we need from express
const express_1 = require("express");
const validate_1 = require("../../../validate");
const userController_1 = require("./userController");
const userMiddleware_1 = require("./userMiddleware");
const userModel_1 = require("./userModel");
const middleware_1 = require("../../../middleware");
// Assign router to the express.Router() instance
const router = express_1.Router();
const v = new validate_1.Validator();
const userController = new userController_1.UserController();
const userMiddleware = new userMiddleware_1.UserMiddleware();
const middleware = new middleware_1.Middleware();
router.get("/test", (req, res) => {
    res.send("This is a test routing!");
});
router.post("/login", v.validate(userModel_1.LoginModel), userController.login);
router.post("/adfslogin", userController.adfslogin);
router.post("/sign-up", v.validate(userModel_1.UserModel), userMiddleware.checkEmailExists, userController.signup);
router.post("/verify-otp", v.validate(userModel_1.VerifyOtpModel), userController.verifyOtp);
router.post("/send-otp", v.validate(userModel_1.sendOTPModel), userController.sendOTP);
router.post("/reset-password", v.validate(userModel_1.ResetPasswordModel), userController.resetPassword);
router.post("/change-password", v.validate(userModel_1.ChangePasswordModel), middleware.getUserAuthorized, userMiddleware.verifyOldPassword, userController.updatePassword);
router.get("/get-profile/:id", userMiddleware.IsValidId, userController.getProfile);
router.get('/match-schedule', userController.getMatchSchedule);
router.get('/banner-sponser', userController.getBannerSponser);
router.post('/user-verification', v.validate(userModel_1.VerifyUser), userController.userVerification);
exports.UserRoute = router;
//# sourceMappingURL=userRoute.js.map