import { Constants } from "../config/constants";
import * as moment from "moment";
import * as dotenv from "dotenv";
import * as Sql from "jm-ez-mysql";
const bcrypt = require("bcryptjs");
import * as fs from "fs";
import * as mv from "mv";

const headers = {
  name: "", // any string
  mobile: 1, // any number
  email:
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, // RegExp
  _country: "", // add '_' as first character of the key to indicate as optional
  type: "",
  date: "",
};
dotenv.config();

const saltRounds = 10;
export class Utils {
  /** Creating 6 digit random code for otp as well as referral code */
  public createRandomcode = (length: number, isOTP: boolean) => {
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

  /** get regex for multiple names in sql (instead of LIKE) */
  public static getRegex = (data: string[], symbol: string = "|") => {
    return `REGEXP '${data
      .join(",")
      .replace(/'/g, "\\'")
      .replace(",", symbol)}'`;
  };

  /* convert returned string object from sql result to array of objects */
  public static formatStringObjectsToArrayObjects = (
    result: any,
    type: string
  ) => {
    if (result[type]) {
      result[type] = JSON.parse(result[type]);
    } else {
      result[type] = [];
    }
    return result[type];
  };

  /* Get image path for attachment */
  public static getImagePath = (atchId: string, atchName: string) => {
    return `IF(${atchId} IS NULL, '', CONCAT('${process.env.IMAGE_PATH}', '/', ${atchName}))`;
  };

  /* Get Timestamop of date */
  public static getTimeStamp = (date: string) => {
    return moment(date).unix();
  };
  public static reverseString(str: any) {
    return str.split("").reverse().join("");
  }
  /* Get round of 2 digit */
  public static getRoundOfTwoDigit = (value: number) => {
    return +value.toFixed(2);
  };

  public static async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /** get skip and limit to avoid multiple code lines */
  public static getSkipLimit = (
    page: number,
    recordsPerPage: number = null
  ) => {
    let skip = 0;
    const limit = recordsPerPage ? recordsPerPage : Constants.RECORDS_PER_PAGE; // for paginate records
    if (page) {
      skip = (page - 1) * limit;
    }
    return { limit, skip };
  };

  /** get time format */
  public static getTimeFormat = () => {
    return moment().format(Constants.TIME_FORMAT);
  };

  /** get date format with adding extra minutes */
  public static getStandardDateFormatWithAddedMinutes = (value: number) => {
    return moment().add(value, "minutes").format(Constants.DATE_FORMAT);
  };

  public static encryptText = (text) => {
    return bcrypt.hash(text, saltRounds);
  };

  public static compareEncryptedText = (text, hashText) => {
    return bcrypt.compare(text, hashText);
  };

  public static empty = (mixedVar) => {
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

  public static titleCase = (str) => {
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

  public slug = async (title?, fieldName?, id = null, tableName?) => {
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
    const templateData = await Sql.query(
      `SELECT slug FROM ${tableName} WHERE  slug LIKE '%${slug}%' AND status != 2`
    );
    const originalSlug = slug;
    const latestSlug = this.recursiveSlug(
      templateData,
      originalSlug,
      slug,
      0,
      id
    );
    return latestSlug;
  };

  public recursiveSlug = (data?, originalSlug?, slug?, number?, id?) => {
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
    } else {
      let flag = false;
      for (let i = 0; i < data.length; i++) {
        if (
          (data[i].slug == slug && (data[i].id != id || data[i].ID != id)) ||
          (data[i].Slug == slug && (data[i].id != id || data[i].ID != id))
        ) {
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
  public upload = (files) => {
    return new Promise(async (resolve, reject) => {
      const imgArr = [];
      const publicDir = "public/upload/assets";
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir);
      }
      for (let i = 0; i < files.length; i++) {
        const timeStampInMs = new Date().getTime();
        const oldpath = files[i].path;
        const filename = timeStampInMs + "_" + files[i].originalname;
        const newpath =
          "public/upload/assets/" + timeStampInMs + "_" + files[i].originalname;
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
      
    });
  };
  public bucketfileupload = (req, flag?: boolean) => {
    return new Promise(async (resolve, reject) => {
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
        await mv(oldpath, newpath, function (err) {
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
    });
  };
}
