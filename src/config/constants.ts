
export class Constants {
    public static readonly TIME_STAMP_FORMAT = "YYYY-MM-DD HH:mm:ss";
    public static readonly SUCCESS = "Success";
    public static readonly FAIL = "Fail";
    public static readonly FAIL_CODE = 400;
    public static readonly BAD_DATA = "BAD_DATA";
    public static readonly CODE = "CODE";
    public static readonly UPLOAD_SIZES = { PROFILE_PICTURE: 2000000 };
    public static readonly RECORDS_PER_PAGE = 20;
    public static readonly RANDOM_CODE_STR_LENGTH = 6;
    public static readonly DATE_FORMAT = "YYYY-MM-DD HH:mm";
    public static readonly SES_API_VERSION = "";
    public static readonly SNS_API_VERSION = "2010-03-31";
    public static readonly DEVICE_TYPES = {
        IOS: "ios",
    };
    public static readonly ROLES = {
        Admin: 1,
        SubAdmin: 2,
        User: 3
    };
    public static readonly UPLOAD_TYPES = { PROFILE_PICTURE: "PROFILE_PICTURE", AUDIO_FILE: "AUDIO_FILE" };
    public static readonly TIME_FORMAT = "HH:mm:ss";
    public static readonly EXPIRY_MINUTES = 5;
    public static readonly INTERNAL_SERVER = 500;
    public static readonly INVALID_CREDENTIAL = 401;
    public static readonly NOT_FOUND = 404;
    public static readonly OK = 200;
    public static readonly CREATED = 201; 
    public static readonly BAD_REQ = 400;
    public static readonly UNAUTHORIZED = 401;
    public static readonly FORBIDDEN = 403;
    public static readonly PRECONDITION_FAILED = 412;   
    public static readonly SIGNUP_CODE = 420;   

}
