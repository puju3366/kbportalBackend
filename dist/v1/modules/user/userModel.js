"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyUser = exports.VerifyOtpModel = exports.ChangePasswordModel = exports.ResetPasswordModel = exports.LoginModel = exports.sendOTPModel = exports.ForgotPasswordModel = exports.UserModel = void 0;
const class_validator_1 = require("class-validator");
const model_1 = require("../../../model");
class UserModel extends model_1.Model {
    constructor(body) {
        super();
        const { first_name, last_name, email, password, profile_image, device_token } = body;
        this.first_name = first_name;
        this.email = email;
        this.last_name = last_name;
        this.password = password;
        this.profile_image = profile_image;
        this.device_token = device_token;
    }
}
__decorate([
    class_validator_1.IsNotEmpty()
], UserModel.prototype, "first_name", void 0);
__decorate([
    class_validator_1.IsNotEmpty()
], UserModel.prototype, "last_name", void 0);
__decorate([
    class_validator_1.IsEmail({}, { message: "EMAIL_INVALID" }),
    class_validator_1.IsNotEmpty()
], UserModel.prototype, "email", void 0);
__decorate([
    class_validator_1.IsNotEmpty()
], UserModel.prototype, "password", void 0);
__decorate([
    class_validator_1.IsOptional()
], UserModel.prototype, "status", void 0);
__decorate([
    class_validator_1.IsOptional()
], UserModel.prototype, "profile_image", void 0);
__decorate([
    class_validator_1.IsOptional()
], UserModel.prototype, "location", void 0);
__decorate([
    class_validator_1.IsOptional()
], UserModel.prototype, "permissions", void 0);
__decorate([
    class_validator_1.IsOptional()
], UserModel.prototype, "device_token", void 0);
__decorate([
    class_validator_1.IsOptional()
], UserModel.prototype, "otp", void 0);
__decorate([
    class_validator_1.IsOptional()
], UserModel.prototype, "otp_sent_time", void 0);
__decorate([
    class_validator_1.IsOptional()
], UserModel.prototype, "user_name", void 0);
exports.UserModel = UserModel;
class ForgotPasswordModel extends model_1.Model {
    constructor(body) {
        super();
        const { email, } = body;
        this.email = email;
    }
}
__decorate([
    class_validator_1.IsNotEmpty()
], ForgotPasswordModel.prototype, "email", void 0);
exports.ForgotPasswordModel = ForgotPasswordModel;
class sendOTPModel extends model_1.Model {
    constructor(body) {
        super();
        const { email_or_phn, } = body;
        this.email_or_phn = email_or_phn;
    }
}
__decorate([
    class_validator_1.IsNotEmpty()
], sendOTPModel.prototype, "email_or_phn", void 0);
exports.sendOTPModel = sendOTPModel;
class LoginModel extends model_1.Model {
    // @IsOptional()
    // public deviceId: string;
    constructor(body) {
        super();
        const { email, password, 
        // deviceId,
        deviceToken } = body;
        this.email = email;
        this.password = password;
        // this.deviceId = deviceId;
        this.deviceToken = deviceToken;
    }
}
__decorate([
    class_validator_1.IsEmail({}, { message: "EMAIL_INVALID" }),
    class_validator_1.IsNotEmpty()
], LoginModel.prototype, "email", void 0);
__decorate([
    class_validator_1.IsOptional()
], LoginModel.prototype, "password", void 0);
__decorate([
    class_validator_1.IsOptional()
], LoginModel.prototype, "deviceToken", void 0);
exports.LoginModel = LoginModel;
class ResetPasswordModel extends model_1.Model {
    constructor(body) {
        super();
        const { newPassword, email_or_phn, } = body;
        this.newPassword = newPassword;
        this.email_or_phn = email_or_phn;
    }
}
__decorate([
    class_validator_1.IsNotEmpty()
], ResetPasswordModel.prototype, "newPassword", void 0);
__decorate([
    class_validator_1.IsNotEmpty()
], ResetPasswordModel.prototype, "email_or_phn", void 0);
exports.ResetPasswordModel = ResetPasswordModel;
class ChangePasswordModel extends model_1.Model {
    constructor(body) {
        super();
        const { newPassword, oldPassword, confirmPassword } = body;
        this.newPassword = newPassword;
        this.oldPassword = oldPassword;
        this.confirmPassword = confirmPassword;
    }
}
__decorate([
    class_validator_1.IsNotEmpty()
], ChangePasswordModel.prototype, "newPassword", void 0);
__decorate([
    class_validator_1.IsNotEmpty()
], ChangePasswordModel.prototype, "oldPassword", void 0);
__decorate([
    class_validator_1.IsNotEmpty()
], ChangePasswordModel.prototype, "confirmPassword", void 0);
exports.ChangePasswordModel = ChangePasswordModel;
class VerifyOtpModel extends model_1.Model {
    constructor(body) {
        super();
        const { otp, email_or_phn } = body;
        this.otp = otp;
        this.email_or_phn = email_or_phn;
    }
}
__decorate([
    class_validator_1.IsNotEmpty()
], VerifyOtpModel.prototype, "otp", void 0);
__decorate([
    class_validator_1.IsNotEmpty()
], VerifyOtpModel.prototype, "email_or_phn", void 0);
exports.VerifyOtpModel = VerifyOtpModel;
class VerifyUser extends model_1.Model {
    constructor(body) {
        super();
        const { isVerified, email } = body;
        this.isVerified = isVerified;
        this.email = email;
    }
}
__decorate([
    class_validator_1.IsNotEmpty()
], VerifyUser.prototype, "isVerified", void 0);
__decorate([
    class_validator_1.IsEmail({}, { message: "EMAIL_INVALID" }),
    class_validator_1.IsNotEmpty()
], VerifyUser.prototype, "email", void 0);
exports.VerifyUser = VerifyUser;
//# sourceMappingURL=userModel.js.map