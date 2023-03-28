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
exports.KBMiddleware = void 0;
const Sql = require("jm-ez-mysql");
const tables_1 = require("../../../config/tables");
const responseBuilder_1 = require("../../../helpers/responseBuilder");
const constants_1 = require("../../../config/constants");
class KBMiddleware {
    constructor() {
        this.IsTitleAlreadyExist = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // const getPracticeData: any = await Sql.query(`SELECT id,practice_name FROM ${Tables.PRACTICES} WHERE FIND_IN_SET(practice_name, "${req.body.practice_id}")`)
            const title = yield Sql.query(`SELECT COUNT(id) AS Count FROM ${tables_1.Tables.KBTABLE}  WHERE title="${req.body.title}" AND 
    category_id=${req.body.category_id} AND project_id=${req.body.project_id} AND team="${req.body.team}"
    `);
            if (title[0].Count > 0) {
                const response = yield responseBuilder_1.ResponseBuilder.getErrorResponse({ error: "KB Already Exist" });
                res.json(responseBuilder_1.ResponseBuilder.getErrorResponse(title, "KB ALREADY Exists", constants_1.Constants.BAD_REQ));
            }
            else {
                next();
            }
        });
        this.IsKBAlreadyDeleted = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const data = yield Sql.first(tables_1.Tables.KBTABLE, ["*"], "id = ?", [req.params.id]);
            const dataToShow = {
                title: data.title,
                tag: data.title,
                body: data.body
            };
            if (data.is_deleted === 1) {
                res.status(constants_1.Constants.BAD_REQ).json(responseBuilder_1.ResponseBuilder.getErrorResponse(dataToShow, "ERR_DATA_ALREADY_DELETED", constants_1.Constants.BAD_REQ));
            }
            else {
                next();
            }
        });
    }
    validatePracticeName(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Sql.first(tables_1.Tables.PRACTICES, ["title"], "title = ?", [req.body.Value]);
            if (result) {
                res.status(constants_1.Constants.BAD_REQ).json(responseBuilder_1.ResponseBuilder.getErrorResponse(result, "ERR_TITLE_ALREADY_EXISTS", constants_1.Constants.BAD_REQ));
            }
            else {
                next();
            }
        });
    }
    isKbActiveToComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield Sql.query(`SELECT * FROM ${tables_1.Tables.KBTABLE} WHERE id=${req.body.kb_detail_id}`);
            if (query.length > 0) {
                if (query[0].is_active == 0 || query[0].is_deleted == 1) {
                    res.status(constants_1.Constants.BAD_REQ).json(responseBuilder_1.ResponseBuilder.getErrorResponse(query, "ERR_KB_IS_NOT_ACTIVE", constants_1.Constants.BAD_REQ));
                }
                else {
                    next();
                }
            }
            else {
                next();
            }
        });
    }
    kbAlreadyCommented(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield Sql.query(`SELECT * FROM ${tables_1.Tables.COMMENTSTABLE} WHERE user_id=${req.body.user_id} AND kb_detail_id = ${req.body.kb_detail_id} AND is_active=1 AND is_deleted=0`);
            if (query.length > 0) {
                res.status(constants_1.Constants.BAD_REQ).json(responseBuilder_1.ResponseBuilder.getErrorResponse(query, "ERR_KB_ALREADY_COMMENTED", constants_1.Constants.BAD_REQ));
            }
            else {
                next();
            }
        });
    }
    isKBAlreadyRated(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield Sql.query(`SELECT id,kb_detail_id,rating,created_by 
    FROM kb_rating_details 
    WHERE kb_rating_details.kb_detail_id="${req.body.kb_detail_id}" AND kb_rating_details.created_by="${req.body.created_by}"  AND is_active=1 AND is_deleted=0`);
            if (query.length > 0) {
                // const updateRating: any = await Sql.update(Tables.USERRATING, { rating: req.body.rating, modified_by: req.body.created_by }, "id = ?", [query[0].id]);
                // return res.status(200).json(ResponseBuilder.getSuccessResponse(updateRating, "Rating updated successfully"));
                return res.status(200).json(responseBuilder_1.ResponseBuilder.getSuccessResponse(query, "You Already Rated This KB"));
            }
            else {
                next();
            }
        });
    }
    isKBAlreadyLiked(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield Sql.query(`SELECT id,kb_detail_id,is_like,created_by 
    FROM ${tables_1.Tables.USERACTION} 
    WHERE ${tables_1.Tables.USERACTION}.kb_detail_id="${req.body.kb_detail_id}" AND
     ${tables_1.Tables.USERACTION}.created_by="${req.body.create_by}" AND is_like = 1 AND is_active=1 AND is_deleted=0 `);
            if (query.length > 0) {
                // const updateRating:any = await Sql.update(Tables.USERACTION, {rating:req.body.rating,modified_by:req.body.created_by}, "id = ?", [query[0].id]);
                return res.status(200).json(responseBuilder_1.ResponseBuilder.getSuccessResponse(query, "You Already Liked This KB"));
            }
            else {
                next();
            }
        });
    }
}
exports.KBMiddleware = KBMiddleware;
//# sourceMappingURL=kBMiddleware.js.map