"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
const constants_1 = require("../config/constants");
const moment = require("moment");
const dotenv = require("dotenv");
const Sql = require("jm-ez-mysql");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const mv = require("mv");
const headers = {
    name: "",
    mobile: 1,
    email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    _country: "",
    type: "",
    date: "",
};
dotenv.config();
const saltRounds = 10;
class Utils {
    constructor() {
        /** Creating 6 digit random code for otp as well as referral code */
        this.createRandomcode = (length, isOTP) => {
            let code = "";
            let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // for referral code generator
            if (isOTP) {
                characters = "123456789"; // for otp generator
            }
            const charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
                code += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return code;
        };
        this.slug = (title, fieldName, id = null, tableName) => __awaiter(this, void 0, void 0, function* () {
            const slug = title
                .toLowerCase()
                .replace(/ /g, "-")
                .replace(/[^\w-]+/g, "");
            const query = { status: 1 };
            let where = "";
            if (slug) {
                const likePatten = `LIKE '%${slug.replace(/'/g, "")}%'`;
                where += ` slug ${likePatten} AND status != 2 `;
            }
            const obj = { where: query };
            const templateData = yield Sql.query(`SELECT slug FROM ${tableName} WHERE  slug LIKE '%${slug}%' AND status != 2`);
            const originalSlug = slug;
            const latestSlug = this.recursiveSlug(templateData, originalSlug, slug, 0, id);
            return latestSlug;
        });
        this.recursiveSlug = (data, originalSlug, slug, number, id) => {
            if (id == null) {
                let flag = false;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].slug === slug || data[i].Slug === slug) {
                        flag = true;
                    }
                    if (flag && i == data.length - 1) {
                        number++;
                        slug = originalSlug + "-" + number;
                        return this.recursiveSlug(data, originalSlug, slug, number);
                    }
                }
                return slug;
            }
            else {
                let flag = false;
                for (let i = 0; i < data.length; i++) {
                    if ((data[i].slug == slug && (data[i].id != id || data[i].ID != id)) ||
                        (data[i].Slug == slug && (data[i].id != id || data[i].ID != id))) {
                        flag = true;
                    }
                    if (flag && i == data.length - 1) {
                        number++;
                        slug = originalSlug + "-" + number;
                        return this.recursiveSlug(data, originalSlug, slug, number);
                    }
                }
                return slug;
            }
        };
        // public slug = async(title?, fieldName?, id = null, dataModal?) => {
        //     const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        //     const query = { status: 1 };
        //     let where = '';
        //     if (slug) {
        //         const likePatten = `LIKE '%${slug.replace(/'/g, "")}%'`;
        //         where += ` slug ${likePatten} AND status != 2 `;
        //     }
        //     const obj = { where: query };
        //     const templateData = await Sql.query(`SELECT slug FROM menus WHERE slug LIKE '%${slug}%' AND status != 2`);
        //     const originalSlug = slug;
        //     const latestSlug = this.recursiveSlug(templateData, originalSlug, slug, 0, id);
        //     return latestSlug;
        // }
        // public recursiveSlug = (data?, originalSlug?, slug?, number?, id?) => {
        //     if (id == null) {
        //         let flag = false;
        //     for (let i = 0; i < data.length; i++) {
        //         if (data[i].slug === slug || data[i].Slug === slug) {
        //             flag = true;
        //         }
        //         if (flag && (i == (data.length - 1))) {
        //             number++;
        //             slug = originalSlug + '-' + number;
        //             return this.recursiveSlug(data, originalSlug, slug, number);
        //         }
        //     }
        //         return slug;
        //     } else {
        //         let flag = false;
        //         for (let i = 0; i < data.length; i++) {
        //             if (data[i].slug == slug && (data[i].id != id || data[i].ID != id) || data[i].Slug == slug && (data[i].id != id || data[i].ID != id)) {
        //                 flag = true;
        //             }
        //             if (flag && (i == (data.length - 1))) {
        //                 number++;
        //                 slug = originalSlug + '-' + number;
        //                 return this.recursiveSlug(data, originalSlug, slug, number);
        //             }
        //         }
        //         return slug;
        //     }
        // }
        this.upload = (files) => {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const imgArr = [];
                const publicDir = "public/upload/assets";
                if (!fs.existsSync(publicDir)) {
                    fs.mkdirSync(publicDir);
                }
                for (let i = 0; i < files.length; i++) {
                    const timeStampInMs = new Date().getTime();
                    const oldpath = files[i].path;
                    const filename = timeStampInMs + "_" + files[i].originalname;
                    const newpath = "public/upload/assets/" + timeStampInMs + "_" + files[i].originalname;
                    const imagePath = "https://kb.devitsandbox.com/node/upload/assets/" + timeStampInMs + "_" + files[i].originalname;
                    mv(oldpath, newpath, function (err) {
                        if (err) {
                            reject(err);
                        }
                        const obj = {
                            filename: filename,
                            originalname: files[i].originalname,
                            url: imagePath,
                            uploaded: 1
                        };
                        imgArr.push(obj);
                        if (i == files.length - 1) {
                            resolve(imgArr);
                        }
                    });
                }
            }));
        };
        this.bucketfileupload = (req, flag) => {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const imgArr = [];
                const publicDir = `public/upload/bucket_${req.body.bucket_id}`;
                if (!fs.existsSync(publicDir)) {
                    fs.mkdirSync(publicDir, { recursive: true });
                }
                for (let i = 0; i < req.files.length; i++) {
                    const timeStampInMs = new Date().getTime();
                    const oldpath = req.files[i].path;
                    const filename = flag
                        ? req.files[i].originalname
                        : timeStampInMs + "_" + req.files[i].originalname;
                    const newpath = flag
                        ? `public/upload/bucket_${req.body.bucket_id}/` +
                            req.files[i].originalname
                        : `public/upload/bucket_${req.body.bucket_id}/` +
                            timeStampInMs +
                            "_" +
                            req.files[i].originalname;
                    yield mv(oldpath, newpath, function (err) {
                        if (err) {
                            reject(err);
                        }
                        const obj = {
                            filename: filename,
                            originalname: req.files[i].originalname,
                            path: newpath,
                        };
                        imgArr.push(obj);
                        if (i == req.files.length - 1) {
                            resolve(imgArr);
                        }
                    });
                }
            }));
        };
    }
    static reverseString(str) {
        return str.split("").reverse().join("");
    }
    static delay(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => setTimeout(resolve, ms));
        });
    }
}
exports.Utils = Utils;
/** get regex for multiple names in sql (instead of LIKE) */
Utils.getRegex = (data, symbol = "|") => {
    return `REGEXP '${data
        .join(",")
        .replace(/'/g, "\\'")
        .replace(",", symbol)}'`;
};
/* convert returned string object from sql result to array of objects */
Utils.formatStringObjectsToArrayObjects = (result, type) => {
    if (result[type]) {
        result[type] = JSON.parse(result[type]);
    }
    else {
        result[type] = [];
    }
    return result[type];
};
/* Get image path for attachment */
Utils.getImagePath = (atchId, atchName) => {
    return `IF(${atchId} IS NULL, '', CONCAT('${process.env.IMAGE_PATH}', '/', ${atchName}))`;
};
/* Get Timestamop of date */
Utils.getTimeStamp = (date) => {
    return moment(date).unix();
};
/* Get round of 2 digit */
Utils.getRoundOfTwoDigit = (value) => {
    return +value.toFixed(2);
};
/** get skip and limit to avoid multiple code lines */
Utils.getSkipLimit = (page, recordsPerPage = null) => {
    let skip = 0;
    const limit = recordsPerPage ? recordsPerPage : constants_1.Constants.RECORDS_PER_PAGE; // for paginate records
    if (page) {
        skip = (page - 1) * limit;
    }
    return { limit, skip };
};
/** get time format */
Utils.getTimeFormat = () => {
    return moment().format(constants_1.Constants.TIME_FORMAT);
};
/** get date format with adding extra minutes */
Utils.getStandardDateFormatWithAddedMinutes = (value) => {
    return moment().add(value, "minutes").format(constants_1.Constants.DATE_FORMAT);
};
Utils.encryptText = (text) => {
    return bcrypt.hash(text, saltRounds);
};
Utils.compareEncryptedText = (text, hashText) => {
    return bcrypt.compare(text, hashText);
};
Utils.empty = (mixedVar) => {
    let i;
    let len;
    const emptyValues = [
        "undefined",
        null,
        "null",
        false,
        0,
        "",
        "0",
        undefined,
    ];
    for (i = 0, len = emptyValues.length; i < len; i += 1) {
        if (mixedVar === emptyValues[i]) {
            return true;
        }
    }
    if (typeof mixedVar === "object") {
        const keys = Object.keys(mixedVar);
        return keys.length === 0;
    }
    return false;
};
Utils.titleCase = (str) => {
    var splitStr = str.toLowerCase().split(" ");
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] =
            splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(" ");
};
//# sourceMappingURL=utils.js.map