import {
  IsEmail, IsNotEmpty, Validate, MaxLength, IsOptional, IsInt
} from "class-validator";
import {
  IsMediaSizeValidConstraint,
} from "./userValidator";
import { Model } from "../../../model";

export class UserModel extends Model {

  @IsNotEmpty()
  public first_name: string;

  @IsNotEmpty()
  public last_name: string;

  @IsEmail({}, { message: "EMAIL_INVALID" })
  @IsNotEmpty()
  public email: string;

  @IsNotEmpty()
  public password: string;


  @IsOptional()
  public status: number;

  @IsOptional()
  public profile_image: any;

  @IsOptional()
  public location: string;

  @IsOptional()
  public permissions: string;

  @IsOptional()
  public device_token: string;

  @IsOptional()
  public otp: string;

  @IsOptional()
  public otp_sent_time: string;

  @IsOptional()
  public user_name: string;
  constructor(body: any) {
    super();
    const {
      first_name,
      last_name,
      email,
      password,
      profile_image,
      device_token
    } = body;
    this.first_name = first_name;
    this.email = email;
    this.last_name = last_name;
    this.password = password;
    this.profile_image = profile_image;
    this.device_token = device_token;
  }

}

export class ForgotPasswordModel extends Model {

  @IsNotEmpty()
  public email: string;


  constructor(body: any) {
    super();
    const {
      email,
    } = body;

    this.email = email;
  }
}

export class sendOTPModel extends Model {

  @IsNotEmpty()
  public email_or_phn: string;


  constructor(body: any) {
    super();
    const {
      email_or_phn,
    } = body;

    this.email_or_phn = email_or_phn;
  }
}

export class LoginModel extends Model {
  @IsEmail({}, { message: "EMAIL_INVALID" })
  @IsNotEmpty()
  public email: string;

  @IsOptional()
  public password: string;

  @IsOptional()
  public deviceToken: any;

  // @IsOptional()
  // public deviceId: string;

  constructor(body: any) {
    super();
    const {
      email,
      password,
      // deviceId,
      deviceToken
    } = body;

    this.email = email;
    this.password = password;
    // this.deviceId = deviceId;
    this.deviceToken = deviceToken;
  }
}




export class ResetPasswordModel extends Model {
  @IsNotEmpty()
  public newPassword: number;

  @IsNotEmpty()
  public email_or_phn: string;

  constructor(body: any) {
    super();
    const {
      newPassword,
      email_or_phn,
    } = body;

    this.newPassword = newPassword;
    this.email_or_phn = email_or_phn;
  }
}

export class ChangePasswordModel extends Model {
  @IsNotEmpty()
  public newPassword: string;

  @IsNotEmpty()
  public oldPassword: string;

  @IsNotEmpty()
  public confirmPassword: string;

  constructor(body: any) {
    super();
    const {
      newPassword,
      oldPassword,
      confirmPassword
    } = body;

    this.newPassword = newPassword;
    this.oldPassword = oldPassword;
    this.confirmPassword = confirmPassword;
  }
}

export class VerifyOtpModel extends Model {
  @IsNotEmpty()
  public otp: string;

  @IsNotEmpty()
  public email_or_phn: string;

  constructor(body: any) {
    super();
    const {
      otp,email_or_phn
    } = body;

    this.otp = otp
    this.email_or_phn = email_or_phn
  }
}

export class VerifyUser extends Model {
  @IsNotEmpty()
  public isVerified: string;

  @IsEmail({}, { message: "EMAIL_INVALID" })
  @IsNotEmpty()
  public email: string;

  constructor(body: any) {
    super();
    const {
      isVerified,email
    } = body;

    this.isVerified = isVerified
    this.email = email
  }
}



