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
exports.KBUtils = void 0;
const Sql = require("jm-ez-mysql");
const tables_1 = require("../../../config/tables");
const responseBuilder_1 = require("../../../helpers/responseBuilder");
const utils_1 = require("../../../helpers/utils");
class KBUtils {
    constructor() {
        this.utils = new utils_1.Utils();
    }
    // SELECT id,title,category_id,practice_id,project_id,tag,body,created_on,created_by FROM ${Tables.KBTABLE} WHERE practice_id=${practice} AND is_deleted=0
    getAllKBByPract(practice) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield Sql.query(`SELECT COUNT(${tables_1.Tables.KBCOMMENTDETAILS}.comment) AS kb_comments,
        COUNT(${tables_1.Tables.USERACTION}.is_like) AS kb_likes,
        AVG(${tables_1.Tables.USERRATING}.rating) AS avg_rate,
        ${tables_1.Tables.KBTABLE}.id,${tables_1.Tables.KBTABLE}.title,${tables_1.Tables.KBTABLE}.tag,${tables_1.Tables.KBTABLE}.body,categories.category_name,categories.bg_color,projects.project_name,
        practices.practice_name,${tables_1.Tables.KBTABLE}.created_by,${tables_1.Tables.KBTABLE}.is_kb_approved,
        ${tables_1.Tables.KBTABLE}.created_on
                FROM ${tables_1.Tables.KBTABLE}
                       LEFT JOIN categories 
                       ON ${tables_1.Tables.KBTABLE}.category_id=categories.id
                       LEFT JOIN projects
                       ON ${tables_1.Tables.KBTABLE}.project_id = projects.id
                       LEFT JOIN kb_practice_details
                       ON ${tables_1.Tables.KBTABLE}.id=kb_practice_details.kb_detail_id
                       LEFT JOIN practices
                       ON ${tables_1.Tables.KBPRACTICEDETAILS}.practice_id=practices.id
                       LEFT JOIN ${tables_1.Tables.USERRATING}
                       ON ${tables_1.Tables.KBTABLE}.id = ${tables_1.Tables.USERRATING}.kb_detail_id
                       LEFT JOIN ${tables_1.Tables.USERACTION}
                       ON ${tables_1.Tables.KBTABLE}.id = ${tables_1.Tables.USERACTION}.kb_detail_id
                       LEFT JOIN ${tables_1.Tables.KBCOMMENTDETAILS}
                       ON ${tables_1.Tables.KBTABLE}.id = ${tables_1.Tables.KBCOMMENTDETAILS}.kb_detail_id AND  ${tables_1.Tables.KBCOMMENTDETAILS}.is_comment_approved = 1
                       WHERE practices.practice_code = "${practice}" AND ${tables_1.Tables.KBTABLE}.is_kb_active=1 AND ${tables_1.Tables.KBTABLE}.is_kb_deleted=0 AND ${tables_1.Tables.KBTABLE}.is_kb_approved=1 
                       GROUP BY ${tables_1.Tables.KBTABLE}.id
                       ORDER BY id DESC
                       
        `);
            return data;
        });
    }
    getAllKBByCat(category) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield Sql.query(`SELECT COUNT(${tables_1.Tables.KBCOMMENTDETAILS}.comment) AS kb_comments,
        COUNT(${tables_1.Tables.USERACTION}.is_like) AS kb_likes,
        AVG(${tables_1.Tables.USERRATING}.rating) AS avg_rate,
        ${tables_1.Tables.KBTABLE}.id,${tables_1.Tables.KBTABLE}.title,${tables_1.Tables.KBTABLE}.tag,${tables_1.Tables.KBTABLE}.body,categories.category_name,categories.bg_color,projects.project_name,
        GROUP_CONCAT(DISTINCT practices.practice_name) AS practice_name,${tables_1.Tables.KBTABLE}.created_by,${tables_1.Tables.KBTABLE}.is_kb_approved,
        ${tables_1.Tables.KBTABLE}.created_on
                FROM ${tables_1.Tables.KBTABLE}
                       LEFT JOIN categories 
                       ON ${tables_1.Tables.KBTABLE}.category_id=categories.id
                       LEFT JOIN projects
                       ON ${tables_1.Tables.KBTABLE}.project_id = projects.id
                       LEFT JOIN kb_practice_details
                       ON ${tables_1.Tables.KBTABLE}.id=kb_practice_details.kb_detail_id
                       LEFT JOIN practices
                       ON kb_practice_details.practice_id=practices.id
                       LEFT JOIN ${tables_1.Tables.USERRATING}
                       ON ${tables_1.Tables.KBTABLE}.id = ${tables_1.Tables.USERRATING}.kb_detail_id
                       LEFT JOIN ${tables_1.Tables.USERACTION}
                       ON ${tables_1.Tables.KBTABLE}.id = ${tables_1.Tables.USERACTION}.kb_detail_id
                       LEFT JOIN ${tables_1.Tables.KBCOMMENTDETAILS}
                       ON ${tables_1.Tables.KBTABLE}.id = ${tables_1.Tables.KBCOMMENTDETAILS}.kb_detail_id AND  ${tables_1.Tables.KBCOMMENTDETAILS}.is_comment_approved = 1
                       WHERE categories.category_code = "${category}" AND ${tables_1.Tables.KBTABLE}.is_kb_active=1 AND ${tables_1.Tables.KBTABLE}.is_kb_deleted=0 AND ${tables_1.Tables.KBTABLE}.is_kb_approved=1 
                       GROUP BY ${tables_1.Tables.KBTABLE}.id
                       ORDER BY id DESC 
                       
        `);
            return data;
        });
    }
    getAllComments() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Sql.query(`SELECT kcd.id, kcd.comment, 
        kcd.is_comment_approved, kd.title, kcd.created_by, kcd.created_on
        FROM ${tables_1.Tables.KBCOMMENTDETAILS} as kcd
                INNER JOIN kb_details as kd
                ON kcd.kb_detail_id = kd.id
                WHERE kcd.is_comment_approved=0 ORDER by kcd.id DESC
        `);
            // const result = await Sql.query(`SELECT * FROM ${Tables.KBCOMMENTDETAILS} WHERE is_comment_approved=0`)
            return result;
        });
    }
    getCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Sql.query(`SELECT id, category_name FROM ${tables_1.Tables.CATEGORIES} ORDER BY category_code ASC `);
            return result;
        });
    }
    getProjectData() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Sql.query(`SELECT id, project_name FROM ${tables_1.Tables.PROJECT} ORDER BY project_name ASC`);
            return result;
        });
    }
    getPracticesData() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Sql.query(`SELECT id, practice_name FROM ${tables_1.Tables.PRACTICES} where is_active = 1 And is_deleted = 0 ORDER BY practice_name ASC`);
            return result;
        });
    }
    getTeamsData() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Sql.query(`SELECT id, team_name FROM ${tables_1.Tables.TEAMS} where is_active = 1 And is_deleted = 0 ORDER BY team_name ASC`);
            return result;
        });
    }
    kbRejected(details) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataInsert = yield Sql.insert(tables_1.Tables.KBAPPROVEREJECTCOMMENTDETAIL, details);
            return yield dataInsert;
        });
    }
    getUnapprovedKb() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Sql.query(`SELECT kd.id,kd.title,c.category_name, GROUP_CONCAT(pc.practice_name) AS practice_name,kd.created_by,kd.created_on, kd.team,kd.kb_expiry_date
        FROM ${tables_1.Tables.KBTABLE} as kd
            INNER JOIN categories AS c
            ON kd.category_id = c.id
            INNER JOIN kb_practice_details AS kpd
            ON kd.id = kpd.kb_detail_id
            INNER JOIN practices AS pc
            ON kpd.practice_id= pc.id
                WHERE kd.is_kb_deleted=0 AND kd.is_kb_approved=0 
                GROUP BY kd.id
                ORDER by kd.id DESC
        `);
            return result;
        });
    }
    insertKB(details) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataInsert = yield Sql.insert(tables_1.Tables.KBTABLE, details);
            const query = yield Sql.query(`SELECT ${tables_1.Tables.KBDETAILS}.id, ${tables_1.Tables.KBDETAILS}.created_on, ${tables_1.Tables.CATEGORIES}.id,${tables_1.Tables.CATEGORIES}.category_name
        FROM ${tables_1.Tables.KBDETAILS}
                RIGHT JOIN ${tables_1.Tables.CATEGORIES}
                ON ${tables_1.Tables.KBDETAILS}.category_id = ${tables_1.Tables.CATEGORIES}.id
        WHERE ${tables_1.Tables.KBDETAILS}.id = "${dataInsert.insertId}"  AND categories.id = "${details.category_id}"
        `);
            const finaldata = {
                lastKbId: dataInsert,
                category: query,
            };
            // const imageData = {
            //     kb_detail_id: dataInsert.insertId,
            //     attachment_type:"image/png",
            //     attachment_path:"http://localhost:3001/upload/assets/1672986779539_Capture.PNG",
            //     created_by:details.created_by,
            // }
            // const result = await Sql.insert(Tables.KBATTACHMENTDETAILS, imageData);
            return yield finaldata;
        });
    }
    insertImage(imageData) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Sql.insert(tables_1.Tables.PRACTICES, imageData);
            return result;
        });
    }
    updateKB(details, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Sql.update(tables_1.Tables.KBTABLE, {
                title: details.title,
                tag: details.tag,
                team: details.team,
                body: details.body,
                category_id: details.category_id,
                // kb_expiry_date: details.kb_expiry_date,
                created_by: details.created_by,
                // practice_id: practice_id,
                project_id: details.project_id,
                kb_published_by: details.kb_published_by,
                kb_assigner: details.kb_assigner,
                is_kb_approved: 0,
            }, "id = ?", [id]);
            return result;
        });
    }
    getKbDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Sql.query(`SELECT GROUP_CONCAT(DISTINCT ${tables_1.Tables.PRACTICES}.practice_name) AS practice, COUNT(DISTINCT ${tables_1.Tables.KBCOMMENTDETAILS}.id) AS kb_comments,
        COUNT(DISTINCT CASE WHEN ${tables_1.Tables.USERACTION}.is_like = 1 THEN ${tables_1.Tables.USERACTION}.id END) AS kb_likes,
        AVG(${tables_1.Tables.USERRATING}.rating) AS avg_rate,
        ${tables_1.Tables.KBTABLE}.id,${tables_1.Tables.KBTABLE}.title,${tables_1.Tables.KBTABLE}.category_id,${tables_1.Tables.KBTABLE}.tag,${tables_1.Tables.KBTABLE}.team,
        ${tables_1.Tables.KBTABLE}.project_id,${tables_1.Tables.KBTABLE}.tag,${tables_1.Tables.KBTABLE}.body,categories.category_name,categories.bg_color,
        projects.project_name,${tables_1.Tables.KBTABLE}.created_by,${tables_1.Tables.KBTABLE}.is_kb_approved,${tables_1.Tables.KBTABLE}.kb_approved_by,${tables_1.Tables.KBTABLE}.created_on
                FROM ${tables_1.Tables.KBTABLE}
                       LEFT JOIN categories 
                       ON ${tables_1.Tables.KBTABLE}.category_id=categories.id
                       LEFT JOIN projects
                       ON ${tables_1.Tables.KBTABLE}.project_id = projects.id
                       LEFT JOIN kb_practice_details 
                       ON ${tables_1.Tables.KBTABLE}.id = ${tables_1.Tables.KBPRACTICEDETAILS}.kb_detail_id
                       LEFT JOIN practices
                       ON ${tables_1.Tables.KBPRACTICEDETAILS}.practice_id=practices.id
                       LEFT JOIN ${tables_1.Tables.USERRATING}
                       ON ${tables_1.Tables.KBTABLE}.id = ${tables_1.Tables.USERRATING}.kb_detail_id
                       LEFT JOIN ${tables_1.Tables.USERACTION}
                       ON ${tables_1.Tables.KBTABLE}.id = ${tables_1.Tables.USERACTION}.kb_detail_id
                       LEFT JOIN ${tables_1.Tables.KBCOMMENTDETAILS}
                       ON ${tables_1.Tables.KBTABLE}.id = ${tables_1.Tables.KBCOMMENTDETAILS}.kb_detail_id AND ${tables_1.Tables.KBCOMMENTDETAILS}.is_comment_approved = 1
                       WHERE ${tables_1.Tables.KBTABLE}.id="${id}" AND ${tables_1.Tables.KBTABLE}.is_kb_active=1
                       GROUP BY ${tables_1.Tables.KBTABLE}.id
                       ORDER BY ${tables_1.Tables.KBTABLE}.is_kb_approved
                        `);
            return result;
        });
    }
    getPracticeDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Sql.query(` SELECT kb_detail_id, practice_id FROM ${tables_1.Tables.KBPRACTICEDETAILS} WHERE kb_detail_id = ${id}
        `);
        });
    }
    getRelatedKbPost(tag, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const myArray = tag.split(",");
            const result = yield Sql.query(`SELECT kd.id,kd.title, kd.created_on, GROUP_CONCAT(DISTINCT tags.tag_name) AS tag_name,kd.created_by 
        FROM ${tables_1.Tables.KBTABLE} as kd
            INNER JOIN ${tables_1.Tables.KBTAGDETAILS}
            ON kd.id = kb_tag_details.kb_detail_id
            INNER JOIN ${tables_1.Tables.TAGS}
            ON kb_tag_details.tag_id=tags.id
        WHERE (tags.tag_name LIKE "%${myArray[0]}%" OR tags.tag_name LIKE "%${myArray[1]}%" OR tags.tag_name LIKE "%${myArray[2]}%" OR tags.tag_name LIKE "%${myArray[3]}%") AND  kd.id != "${id}"
         AND kd.is_kb_active=1 AND kd.is_kb_deleted=0  AND kd.is_kb_approved=1 GROUP BY kd.id,kd.title, kd.created_on,kd.created_by  ORDER BY tags.tag_name`);
            return result;
        });
    }
    getUserRating(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // const cat = categories.toString()
            const result = yield Sql.query(`SELECT ${tables_1.Tables.USERRATING}.id,${tables_1.Tables.USERRATING}.kb_detail_id, ${tables_1.Tables.USERRATING}.rating,${tables_1.Tables.USERRATING}.created_by
        FROM ${tables_1.Tables.USERRATING}
                WHERE ${tables_1.Tables.USERRATING}.created_by="${data.detail.rated_by}" AND ${tables_1.Tables.USERRATING}.kb_detail_id = "${data.detail.id}" ORDER BY id DESC`);
            return result;
        });
    }
    getKbComments(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Sql.query(`SELECT kcd.id,kcd.comment,kcd.created_by,
        kcd.created_on,kcd.kb_detail_id, kd.title
        FROM ${tables_1.Tables.KBCOMMENTDETAILS} as kcd
        LEFT JOIN ${tables_1.Tables.KBTABLE} as kd
        ON kcd.kb_detail_id = kd.id
       WHERE kcd.kb_detail_id =${id} AND kcd.is_comment_approved=1 ORDER BY id DESC`);
            if (result) {
                return result;
            }
            else {
                return [];
            }
        });
    }
    // not needed for now.
    singleDeleteKB(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Sql.update(tables_1.Tables.KBTABLE, { is_deleted: 1 }, "id = ?", [id]);
            return result;
        });
    }
    toggleStatusKB(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Sql.update(tables_1.Tables.KBTABLE, { is_active: status }, "id = ?", [id]);
            return result;
        });
    }
    // 
    // Practice data entries
    dataEntryOfPractice(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Sql.insert(tables_1.Tables.PRACTICES, data);
            return result;
        });
    }
    updateEntryOfPractice(data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Sql.update(tables_1.Tables.PRACTICES, data, "id = ?", [id]);
            return result;
        });
    }
    dataCheckOfPractice(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Sql.first(tables_1.Tables.PRACTICES, ["*"], "practice_name = ?", [data]);
            return result;
        });
    }
    // Teams data entries
    dataCheckOfTeams(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Sql.first(tables_1.Tables.TEAMS, ["*"], "team_name = ?", [data]);
            return result;
        });
    }
    dataEntryOfTeams(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Sql.insert(tables_1.Tables.TEAMS, data);
            return result;
        });
    }
    updateEntryOfTeams(data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Sql.update(tables_1.Tables.TEAMS, data, "id = ?", [id]);
            return result;
        });
    }
    //Project Data entries
    dataCheckofProject(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Sql.first(tables_1.Tables.PROJECT, ["*"], "project_name = ?", [data]);
            return result;
        });
    }
    dataEntryOfProject(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Sql.insert(tables_1.Tables.PROJECT, data);
            return result;
        });
    }
    updateEntryOfProject(data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Sql.update(tables_1.Tables.PROJECT, data, "id = ?", [id]);
            return result;
        });
    }
    /*Search*/
    SearchKB(kb) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield Sql.query(`SELECT ${tables_1.Tables.KBDETAILS}.id,${tables_1.Tables.KBDETAILS}.title,${tables_1.Tables.KBDETAILS}.tag,
        ${tables_1.Tables.KBDETAILS}.body,${tables_1.Tables.KBDETAILS}.created_by,${tables_1.Tables.KBDETAILS}.created_on,${tables_1.Tables.KBDETAILS}.kb_assigner 
        FROM ${tables_1.Tables.KBDETAILS}
        WHERE ${tables_1.Tables.KBDETAILS}.title LIKE "%${kb.kbName}%"  AND is_kb_active= 1 AND ${tables_1.Tables.KBDETAILS}.is_kb_approved=1 AND ${tables_1.Tables.KBDETAILS}.is_kb_deleted=0 `);
            if (query.length <= 0) {
                return responseBuilder_1.ResponseBuilder.notFound("DATA_NOT_FOUND");
            }
            else {
                return responseBuilder_1.ResponseBuilder.data(query);
                ;
            }
        });
    }
    SearchByCategory(kb) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield Sql.query(`SELECT ${tables_1.Tables.KBDETAILS}.id,${tables_1.Tables.KBDETAILS}.title,${tables_1.Tables.KBDETAILS}.tag,
        ${tables_1.Tables.KBDETAILS}.body,${tables_1.Tables.CATEGORIES}.category_name,${tables_1.Tables.KBDETAILS}.created_by,${tables_1.Tables.KBDETAILS}.created_on,${tables_1.Tables.KBDETAILS}.kb_assigner 
        FROM ${tables_1.Tables.KBDETAILS}
        RIGHT JOIN ${tables_1.Tables.CATEGORIES}
        ON ${tables_1.Tables.KBDETAILS}.category_id = categories.id
        WHERE ${tables_1.Tables.CATEGORIES}.category_name LIKE "%${kb.kbName}%"  AND is_kb_active= 1 AND ${tables_1.Tables.KBDETAILS}.is_kb_approved=1 AND ${tables_1.Tables.KBDETAILS}.is_kb_deleted=0`);
            if (query.length <= 0) {
                return responseBuilder_1.ResponseBuilder.notFound("DATA_NOT_FOUND");
            }
            else {
                return responseBuilder_1.ResponseBuilder.data(query);
                ;
            }
        });
    }
    SearchByAll(kb) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield Sql.query(`SELECT ${tables_1.Tables.KBDETAILS}.id,${tables_1.Tables.KBDETAILS}.title,${tables_1.Tables.KBDETAILS}.tag,
        ${tables_1.Tables.KBDETAILS}.body,${tables_1.Tables.KBDETAILS}.created_by,${tables_1.Tables.KBDETAILS}.created_on,${tables_1.Tables.KBDETAILS}.kb_assigner,
        ${tables_1.Tables.CATEGORIES}.category_name, ${tables_1.Tables.PRACTICES}.practice_name, ${tables_1.Tables.PROJECT}.project_name
        FROM ${tables_1.Tables.KBDETAILS}
        LEFT JOIN ${tables_1.Tables.CATEGORIES}
        ON ${tables_1.Tables.KBDETAILS}.category_id = categories.id
        LEFT JOIN ${tables_1.Tables.PRACTICES}
        ON ${tables_1.Tables.KBDETAILS}.practice_id = practices.id
        LEFT JOIN ${tables_1.Tables.PROJECT}
        ON ${tables_1.Tables.KBDETAILS}.project_id = projects.id
        WHERE ${tables_1.Tables.CATEGORIES}.category_name LIKE "%${kb.kbName}%" OR ${tables_1.Tables.KBDETAILS}.title LIKE "%${kb.kbName}%" OR
        ${tables_1.Tables.PRACTICES}.practice_name LIKE "%${kb.kbName}%" OR ${tables_1.Tables.PROJECT}.project_name LIKE "%${kb.kbName}%" OR 
        ${tables_1.Tables.KBDETAILS}.tag LIKE "%${kb.kbName}%" OR ${tables_1.Tables.KBDETAILS}.created_by LIKE "%${kb.kbName}%" AND ${tables_1.Tables.KBDETAILS}.is_kb_active= 1 AND ${tables_1.Tables.KBDETAILS}.is_kb_approved=1 AND ${tables_1.Tables.KBDETAILS}.is_kb_deleted=0 `);
            if (query.length <= 0) {
                return responseBuilder_1.ResponseBuilder.notFound("DATA_NOT_FOUND");
            }
            else {
                return responseBuilder_1.ResponseBuilder.data(query);
                ;
            }
        });
    }
    SearchByPractice(kb) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield Sql.query(`SELECT ${tables_1.Tables.KBDETAILS}.id,${tables_1.Tables.KBDETAILS}.title,${tables_1.Tables.KBDETAILS}.tag,
        ${tables_1.Tables.KBDETAILS}.body,${tables_1.Tables.PRACTICES}.practice_name,${tables_1.Tables.KBDETAILS}.created_by,${tables_1.Tables.KBDETAILS}.created_on,${tables_1.Tables.KBDETAILS}.kb_assigner 
        FROM ${tables_1.Tables.KBDETAILS}
        RIGHT JOIN ${tables_1.Tables.PRACTICES}
        ON ${tables_1.Tables.KBDETAILS}.practice_id = practices.id
        WHERE ${tables_1.Tables.PRACTICES}.practice_name LIKE "%${kb.kbName}%"  AND is_kb_active= 1 AND ${tables_1.Tables.KBDETAILS}.is_kb_approved=1 AND ${tables_1.Tables.KBDETAILS}.is_kb_deleted=0`);
            if (query.length <= 0) {
                return responseBuilder_1.ResponseBuilder.notFound("DATA_NOT_FOUND");
            }
            else {
                return responseBuilder_1.ResponseBuilder.data(query);
                ;
            }
        });
    }
    SearchByProject(kb) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield Sql.query(`SELECT ${tables_1.Tables.KBDETAILS}.id,${tables_1.Tables.KBDETAILS}.title,${tables_1.Tables.KBDETAILS}.tag,
        ${tables_1.Tables.KBDETAILS}.body,${tables_1.Tables.PROJECT}.project_name,${tables_1.Tables.KBDETAILS}.created_by,${tables_1.Tables.KBDETAILS}.created_on,${tables_1.Tables.KBDETAILS}.kb_assigner 
        FROM ${tables_1.Tables.KBDETAILS}
        RIGHT JOIN ${tables_1.Tables.PROJECT}
        ON ${tables_1.Tables.KBDETAILS}.project_id = projects.id
        WHERE ${tables_1.Tables.PROJECT}.project_name LIKE "%${kb.kbName}%"  AND is_kb_active= 1 AND ${tables_1.Tables.KBDETAILS}.is_kb_approved=1 AND ${tables_1.Tables.KBDETAILS}.is_kb_deleted=0`);
            if (query.length <= 0) {
                return responseBuilder_1.ResponseBuilder.notFound("DATA_NOT_FOUND");
            }
            else {
                return responseBuilder_1.ResponseBuilder.data(query);
                ;
            }
        });
    }
    SearchByTag(kb) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield Sql.query(`SELECT ${tables_1.Tables.KBDETAILS}.id,${tables_1.Tables.KBDETAILS}.title,${tables_1.Tables.KBDETAILS}.tag,
        ${tables_1.Tables.KBDETAILS}.body,${tables_1.Tables.KBDETAILS}.created_by,${tables_1.Tables.KBDETAILS}.created_on,${tables_1.Tables.KBDETAILS}.kb_assigner 
        FROM ${tables_1.Tables.KBDETAILS}
        WHERE ${tables_1.Tables.KBDETAILS}.tag LIKE "%${kb.kbName}%"  AND is_kb_active= 1 AND ${tables_1.Tables.KBDETAILS}.is_kb_approved=1 AND ${tables_1.Tables.KBDETAILS}.is_kb_deleted=0`);
            if (query.length <= 0) {
                return responseBuilder_1.ResponseBuilder.notFound("DATA_NOT_FOUND");
            }
            else {
                return responseBuilder_1.ResponseBuilder.data(query);
                ;
            }
        });
    }
    SearchByClient(kb) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield Sql.query(`SELECT ${tables_1.Tables.KBDETAILS}.id,${tables_1.Tables.KBDETAILS}.title,${tables_1.Tables.KBDETAILS}.tag,
        ${tables_1.Tables.KBDETAILS}.body,${tables_1.Tables.KBDETAILS}.created_by,${tables_1.Tables.KBDETAILS}.created_on,${tables_1.Tables.KBDETAILS}.kb_assigner 
        FROM ${tables_1.Tables.KBDETAILS}
        WHERE ${tables_1.Tables.KBDETAILS}.created_by LIKE "%${kb.kbName}%"  AND is_kb_active= 1 AND ${tables_1.Tables.KBDETAILS}.is_kb_approved=1 AND ${tables_1.Tables.KBDETAILS}.is_kb_deleted=0`);
            if (query.length <= 0) {
                return responseBuilder_1.ResponseBuilder.notFound("DATA_NOT_FOUND");
            }
            else {
                return responseBuilder_1.ResponseBuilder.data(query);
                ;
            }
        });
    }
    commentKB(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield Sql.insert(tables_1.Tables.COMMENTSTABLE, data);
            if (query.length <= 0) {
                return responseBuilder_1.ResponseBuilder.notFound("DATA_NOT_FOUND");
            }
            else {
                return responseBuilder_1.ResponseBuilder.data(query);
                ;
            }
        });
    }
    problemResolved(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield Sql.insert(tables_1.Tables.USERACTION, data);
            if (query) {
                return responseBuilder_1.ResponseBuilder.notFound("Data can't insert");
            }
            else {
                return responseBuilder_1.ResponseBuilder.data(query);
                ;
            }
        });
    }
    // ${Tables.KBTABLE}.is_kb_active=1 AND ${Tables.KBTABLE}.is_kb_deleted=0 AND ${Tables.KBTABLE}.is_kb_approved=1  //    ORDER BY ${Tables.KBTABLE}.is_kb_approved
    mykbList(employeeDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield Sql.query(`SELECT ${tables_1.Tables.KBTABLE}.id,${tables_1.Tables.KBTABLE}.title,categories.category_name,${tables_1.Tables.KBTABLE}.is_kb_approved,
        ${tables_1.Tables.KBAPPROVEREJECTCOMMENTDETAIL}.approve_reject_comment,${tables_1.Tables.KBTABLE}.created_on
                FROM ${tables_1.Tables.KBTABLE}
                       INNER JOIN categories 
                       ON ${tables_1.Tables.KBTABLE}.category_id=categories.id
                       LEFT JOIN kb_approve_reject_comment_details
                       ON kb_details.id=${tables_1.Tables.KBAPPROVEREJECTCOMMENTDETAIL}.kb_detail_id
                       WHERE ${tables_1.Tables.KBTABLE}.created_by="${employeeDetails.email}" AND ${tables_1.Tables.KBTABLE}.is_kb_active=1 AND ${tables_1.Tables.KBTABLE}.is_kb_deleted=0
                       GROUP BY ${tables_1.Tables.KBTABLE}.id
                       ORDER BY id DESC`);
            if (!query) {
                return responseBuilder_1.ResponseBuilder.notFound("Cannot found data");
            }
            else {
                return responseBuilder_1.ResponseBuilder.data(query);
                ;
            }
        });
    }
    getRatingsOnKB(rating) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield Sql.query(`SELECT id,kb_detail_id,rating
            FROM ${tables_1.Tables.USERRATING} 
            WHERE ${tables_1.Tables.USERRATING}.kb_detail_id=${rating} 
            AND is_active=1 AND is_deleted=0
            ORDER BY rating DESC LIMIT 0,1`);
            return query;
        });
    }
    postRatingsOnKB(rating) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield Sql.insert(tables_1.Tables.USERRATING, rating);
            return query;
        });
    }
    postLikesOnKB(likes) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield Sql.update(tables_1.Tables.USERACTION, {
                is_like: likes.is_like,
            }, "kb_detail_id = ? AND created_by=?", [likes.kb_detail_id, likes.create_by]);
            return query;
        });
    }
    KBViewed(viewDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield Sql.query(`SELECT COUNT(*) AS kb_view_count FROM kb_user_action_details
        WHERE kb_user_action_details.kb_detail_id="${viewDetails.kb_detail_id}"`);
            return query;
        });
    }
    checkIfKBisViewed(viewDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield Sql.query(`SELECT kb_user_action_details.kb_detail_id, kb_user_action_details.created_by,kb_user_action_details.is_view,kb_user_action_details.is_active,kb_user_action_details.is_deleted
        from ${tables_1.Tables.USERACTION}
        WHERE kb_user_action_details.kb_detail_id=${viewDetails.kb_detail_id} AND kb_user_action_details.created_by="${viewDetails.created_by}"`);
            return query;
        });
    }
    kbPostViewed(viewData) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield Sql.insert(tables_1.Tables.USERACTION, viewData);
            return query;
        });
    }
    KbIsUseful(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield Sql.update(tables_1.Tables.USERACTION, {
                is_useful: data.is_useful,
                description: data.description,
                useful_reason_type: data.useful_reason_type
            }, "kb_detail_id = ? AND created_by=?", [data.kb_detail_id, data.created_by]);
            return query;
        });
    }
    findKbForMail(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield Sql.query(`SELECT ${tables_1.Tables.KBDETAILS}.title,${tables_1.Tables.KBDETAILS}.id,${tables_1.Tables.KBDETAILS}.category_id,${tables_1.Tables.KBDETAILS}.practice_id,${tables_1.Tables.KBDETAILS}.project_id,${tables_1.Tables.KBDETAILS}.tag,${tables_1.Tables.KBDETAILS}.team,${tables_1.Tables.KBDETAILS}.body,${tables_1.Tables.KBDETAILS}.is_kb_draft
        FROM ${tables_1.Tables.KBDETAILS} 
        RIGHT JOIN ${tables_1.Tables.CATEGORIES}
        ON ${tables_1.Tables.KBDETAILS}.category_id=categories.id
        RIGHT JOIN ${tables_1.Tables.PRACTICES}
        ON ${tables_1.Tables.KBDETAILS}.practice_id=practices.id
        RIGHT JOIN ${tables_1.Tables.PROJECT}
        ON ${tables_1.Tables.KBDETAILS}.project_id=projects.id
        WHERE ${tables_1.Tables.KBDETAILS}.title="${data.title}" AND ${tables_1.Tables.KBDETAILS}.category_id=${data.category_id} AND	practices.practice_name="${data.practice}" AND ${tables_1.Tables.KBDETAILS}.project_id=${data.project_id} AND ${tables_1.Tables.KBDETAILS}.is_kb_approved=0 AND ${tables_1.Tables.KBDETAILS}.is_kb_draft=0`);
            return query;
        });
    }
    addCategoryColor(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield Sql.query(`UPDATE ${tables_1.Tables.CATEGORIES} SET bg_color='${data.bg_color}' WHERE category_code LIKE '%${data.category_name}%' OR category_name LIKE '%${data.category_name}%'`);
            return query;
        });
    }
    supportingQuery(details) {
        return __awaiter(this, void 0, void 0, function* () {
            const getPracticeData = yield Sql.query(`SELECT id,practice_name FROM ${tables_1.Tables.PRACTICES} WHERE practice_name="${details}"`);
            return yield getPracticeData;
        });
    }
}
exports.KBUtils = KBUtils;
//# sourceMappingURL=kBUtils.js.map