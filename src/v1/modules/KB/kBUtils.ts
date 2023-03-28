import * as Sql from "jm-ez-mysql";
import * as _ from "lodash";
import { Tables } from "../../../config/tables";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { Utils } from "../../../helpers/utils";




export class KBUtils {
    private utils: Utils = new Utils();

    // SELECT id,title,category_id,practice_id,project_id,tag,body,created_on,created_by FROM ${Tables.KBTABLE} WHERE practice_id=${practice} AND is_deleted=0
    public async getAllKBByPract(practice: any) {
        const data: any = await Sql.query(`SELECT COUNT(${Tables.KBCOMMENTDETAILS}.comment) AS kb_comments,
        COUNT(${Tables.USERACTION}.is_like) AS kb_likes,
        AVG(${Tables.USERRATING}.rating) AS avg_rate,
        ${Tables.KBTABLE}.id,${Tables.KBTABLE}.title,${Tables.KBTABLE}.tag,${Tables.KBTABLE}.body,categories.category_name,categories.bg_color,projects.project_name,
        practices.practice_name,${Tables.KBTABLE}.created_by,${Tables.KBTABLE}.is_kb_approved,
        ${Tables.KBTABLE}.created_on
                FROM ${Tables.KBTABLE}
                       LEFT JOIN categories 
                       ON ${Tables.KBTABLE}.category_id=categories.id
                       LEFT JOIN projects
                       ON ${Tables.KBTABLE}.project_id = projects.id
                       LEFT JOIN kb_practice_details
                       ON ${Tables.KBTABLE}.id=kb_practice_details.kb_detail_id
                       LEFT JOIN practices
                       ON ${Tables.KBPRACTICEDETAILS}.practice_id=practices.id
                       LEFT JOIN ${Tables.USERRATING}
                       ON ${Tables.KBTABLE}.id = ${Tables.USERRATING}.kb_detail_id
                       LEFT JOIN ${Tables.USERACTION}
                       ON ${Tables.KBTABLE}.id = ${Tables.USERACTION}.kb_detail_id
                       LEFT JOIN ${Tables.KBCOMMENTDETAILS}
                       ON ${Tables.KBTABLE}.id = ${Tables.KBCOMMENTDETAILS}.kb_detail_id AND  ${Tables.KBCOMMENTDETAILS}.is_comment_approved = 1
                       WHERE practices.practice_code = "${practice}" AND ${Tables.KBTABLE}.is_kb_active=1 AND ${Tables.KBTABLE}.is_kb_deleted=0 AND ${Tables.KBTABLE}.is_kb_approved=1 
                       GROUP BY ${Tables.KBTABLE}.id
                       ORDER BY id DESC
                       
        `);
        return data;
    }
    public async getAllKBByCat(category: any) {
        const data: any = await Sql.query(`SELECT COUNT(${Tables.KBCOMMENTDETAILS}.comment) AS kb_comments,
        COUNT(${Tables.USERACTION}.is_like) AS kb_likes,
        AVG(${Tables.USERRATING}.rating) AS avg_rate,
        ${Tables.KBTABLE}.id,${Tables.KBTABLE}.title,${Tables.KBTABLE}.tag,${Tables.KBTABLE}.body,categories.category_name,categories.bg_color,projects.project_name,
        GROUP_CONCAT(DISTINCT practices.practice_name) AS practice_name,${Tables.KBTABLE}.created_by,${Tables.KBTABLE}.is_kb_approved,
        ${Tables.KBTABLE}.created_on
                FROM ${Tables.KBTABLE}
                       LEFT JOIN categories 
                       ON ${Tables.KBTABLE}.category_id=categories.id
                       LEFT JOIN projects
                       ON ${Tables.KBTABLE}.project_id = projects.id
                       LEFT JOIN kb_practice_details
                       ON ${Tables.KBTABLE}.id=kb_practice_details.kb_detail_id
                       LEFT JOIN practices
                       ON kb_practice_details.practice_id=practices.id
                       LEFT JOIN ${Tables.USERRATING}
                       ON ${Tables.KBTABLE}.id = ${Tables.USERRATING}.kb_detail_id
                       LEFT JOIN ${Tables.USERACTION}
                       ON ${Tables.KBTABLE}.id = ${Tables.USERACTION}.kb_detail_id
                       LEFT JOIN ${Tables.KBCOMMENTDETAILS}
                       ON ${Tables.KBTABLE}.id = ${Tables.KBCOMMENTDETAILS}.kb_detail_id AND  ${Tables.KBCOMMENTDETAILS}.is_comment_approved = 1
                       WHERE categories.category_code = "${category}" AND ${Tables.KBTABLE}.is_kb_active=1 AND ${Tables.KBTABLE}.is_kb_deleted=0 AND ${Tables.KBTABLE}.is_kb_approved=1 
                       GROUP BY ${Tables.KBTABLE}.id
                       ORDER BY id DESC 
                       
        `);
        return data;
    }

    public async getAllComments() {
        const result: any = await Sql.query(`SELECT kcd.id, kcd.comment, 
        kcd.is_comment_approved, kd.title, kcd.created_by, kcd.created_on
        FROM ${Tables.KBCOMMENTDETAILS} as kcd
                INNER JOIN kb_details as kd
                ON kcd.kb_detail_id = kd.id
                WHERE kcd.is_comment_approved=0 ORDER by kcd.id DESC
        `);
        // const result = await Sql.query(`SELECT * FROM ${Tables.KBCOMMENTDETAILS} WHERE is_comment_approved=0`)
        return result;
    }

    public async getCategories() {
        const result = await Sql.query(`SELECT id, category_name FROM ${Tables.CATEGORIES} ORDER BY category_code ASC `);
        return result;
    }
    public async getProjectData() {
        const result = await Sql.query(`SELECT id, project_name FROM ${Tables.PROJECT} ORDER BY project_name ASC`);
        return result;
    }
    public async getPracticesData() {
        const result = await Sql.query(`SELECT id, practice_name FROM ${Tables.PRACTICES} where is_active = 1 And is_deleted = 0 ORDER BY practice_name ASC`);
        return result;
    }
    public async getTeamsData() {
        const result = await Sql.query(`SELECT id, team_name FROM ${Tables.TEAMS} where is_active = 1 And is_deleted = 0 ORDER BY team_name ASC`);
        return result;
    }

    public async kbRejected(details: Json) {
        const dataInsert: any = await Sql.insert(Tables.KBAPPROVEREJECTCOMMENTDETAIL, details)
        return await dataInsert;
    }


    public async getUnapprovedKb() {
        const result: any = await Sql.query(`SELECT kd.id,kd.title,c.category_name, GROUP_CONCAT(pc.practice_name) AS practice_name,kd.created_by,kd.created_on, kd.team,kd.kb_expiry_date
        FROM ${Tables.KBTABLE} as kd
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
    }

    public async insertKB(details: Json) {
        const dataInsert: any = await Sql.insert(Tables.KBTABLE, details);
        const query = await Sql.query(`SELECT ${Tables.KBDETAILS}.id, ${Tables.KBDETAILS}.created_on, ${Tables.CATEGORIES}.id,${Tables.CATEGORIES}.category_name
        FROM ${Tables.KBDETAILS}
                RIGHT JOIN ${Tables.CATEGORIES}
                ON ${Tables.KBDETAILS}.category_id = ${Tables.CATEGORIES}.id
        WHERE ${Tables.KBDETAILS}.id = "${dataInsert.insertId}"  AND categories.id = "${details.category_id}"
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
        return await finaldata;
    }
    public async insertImage(imageData: any) {
        const result = await Sql.insert(Tables.PRACTICES, imageData);
        return result;
    }

    public async updateKB(details: Json, id: Number) {
        const result: any = await Sql.update(Tables.KBTABLE, {
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

    }

    public async getKbDetails(id: Number) {
        const result = await Sql.query(`SELECT GROUP_CONCAT(DISTINCT ${Tables.PRACTICES}.practice_name) AS practice, COUNT(DISTINCT ${Tables.KBCOMMENTDETAILS}.id) AS kb_comments,
        COUNT(DISTINCT CASE WHEN ${Tables.USERACTION}.is_like = 1 THEN ${Tables.USERACTION}.id END) AS kb_likes,
        AVG(${Tables.USERRATING}.rating) AS avg_rate,
        ${Tables.KBTABLE}.id,${Tables.KBTABLE}.title,${Tables.KBTABLE}.category_id,${Tables.KBTABLE}.tag,${Tables.KBTABLE}.team,
        ${Tables.KBTABLE}.project_id,${Tables.KBTABLE}.tag,${Tables.KBTABLE}.body,categories.category_name,categories.bg_color,
        projects.project_name,${Tables.KBTABLE}.created_by,${Tables.KBTABLE}.is_kb_approved,${Tables.KBTABLE}.kb_approved_by,${Tables.KBTABLE}.created_on
                FROM ${Tables.KBTABLE}
                       LEFT JOIN categories 
                       ON ${Tables.KBTABLE}.category_id=categories.id
                       LEFT JOIN projects
                       ON ${Tables.KBTABLE}.project_id = projects.id
                       LEFT JOIN kb_practice_details 
                       ON ${Tables.KBTABLE}.id = ${Tables.KBPRACTICEDETAILS}.kb_detail_id
                       LEFT JOIN practices
                       ON ${Tables.KBPRACTICEDETAILS}.practice_id=practices.id
                       LEFT JOIN ${Tables.USERRATING}
                       ON ${Tables.KBTABLE}.id = ${Tables.USERRATING}.kb_detail_id
                       LEFT JOIN ${Tables.USERACTION}
                       ON ${Tables.KBTABLE}.id = ${Tables.USERACTION}.kb_detail_id
                       LEFT JOIN ${Tables.KBCOMMENTDETAILS}
                       ON ${Tables.KBTABLE}.id = ${Tables.KBCOMMENTDETAILS}.kb_detail_id AND ${Tables.KBCOMMENTDETAILS}.is_comment_approved = 1
                       WHERE ${Tables.KBTABLE}.id="${id}" AND ${Tables.KBTABLE}.is_kb_active=1
                       GROUP BY ${Tables.KBTABLE}.id
                       ORDER BY ${Tables.KBTABLE}.is_kb_approved
                        `);
        return result;
    }
    public async getPracticeDetails(id: Number) {
        const result = await Sql.query(` SELECT kb_detail_id, practice_id FROM ${Tables.KBPRACTICEDETAILS} WHERE kb_detail_id = ${id}
        `);
    }
    public async getRelatedKbPost(tag: string, id: number) {
        const myArray = tag.split(",");
        const result = await Sql.query(`SELECT kd.id,kd.title, kd.created_on, GROUP_CONCAT(DISTINCT tags.tag_name) AS tag_name,kd.created_by 
        FROM ${Tables.KBTABLE} as kd
            INNER JOIN ${Tables.KBTAGDETAILS}
            ON kd.id = kb_tag_details.kb_detail_id
            INNER JOIN ${Tables.TAGS}
            ON kb_tag_details.tag_id=tags.id
        WHERE (tags.tag_name LIKE "%${myArray[0]}%" OR tags.tag_name LIKE "%${myArray[1]}%" OR tags.tag_name LIKE "%${myArray[2]}%" OR tags.tag_name LIKE "%${myArray[3]}%") AND  kd.id != "${id}"
         AND kd.is_kb_active=1 AND kd.is_kb_deleted=0  AND kd.is_kb_approved=1 GROUP BY kd.id,kd.title, kd.created_on,kd.created_by  ORDER BY tags.tag_name`);
        return result;
    }

    public async getUserRating(data: any) {
        // const cat = categories.toString()
        const result = await Sql.query(`SELECT ${Tables.USERRATING}.id,${Tables.USERRATING}.kb_detail_id, ${Tables.USERRATING}.rating,${Tables.USERRATING}.created_by
        FROM ${Tables.USERRATING}
                WHERE ${Tables.USERRATING}.created_by="${data.detail.rated_by}" AND ${Tables.USERRATING}.kb_detail_id = "${data.detail.id}" ORDER BY id DESC`);
        return result;
    }


    public async getKbComments(id: Number) {
        const result = await Sql.query(`SELECT kcd.id,kcd.comment,kcd.created_by,
        kcd.created_on,kcd.kb_detail_id, kd.title
        FROM ${Tables.KBCOMMENTDETAILS} as kcd
        LEFT JOIN ${Tables.KBTABLE} as kd
        ON kcd.kb_detail_id = kd.id
       WHERE kcd.kb_detail_id =${id} AND kcd.is_comment_approved=1 ORDER BY id DESC`
        );
        if (result) {
            return result;
        } else {
            return [];
        }
    }

    // not needed for now.
    public async singleDeleteKB(id) {
        const result: any = await Sql.update(Tables.KBTABLE, { is_deleted: 1 }, "id = ?", [id]);
        return result;
    }
    public async toggleStatusKB(id, status: number) {
        const result: any = await Sql.update(Tables.KBTABLE, { is_active: status }, "id = ?", [id]);
        return result;
    }
    // 

    // Practice data entries
    public async dataEntryOfPractice(data: any) {
        const result = await Sql.insert(Tables.PRACTICES, data);
        return result;
    }
    public async updateEntryOfPractice(data: any, id: number) {
        const result: any = await Sql.update(Tables.PRACTICES, data, "id = ?", [id]);
        return result;
    }

    public async dataCheckOfPractice(data: string) {
        const result = await Sql.first(Tables.PRACTICES, ["*"], "practice_name = ?", [data]);
        return result;
    }

    // Teams data entries
    public async dataCheckOfTeams(data: string) {
        const result = await Sql.first(Tables.TEAMS, ["*"], "team_name = ?", [data]);
        return result;
    }
    public async dataEntryOfTeams(data: any) {
        const result = await Sql.insert(Tables.TEAMS, data);
        return result;
    }
    public async updateEntryOfTeams(data: any, id: number) {
        const result: any = await Sql.update(Tables.TEAMS, data, "id = ?", [id]);
        return result;
    }

    //Project Data entries
    public async dataCheckofProject(data: string) {
        const result = await Sql.first(Tables.PROJECT, ["*"], "project_name = ?", [data]);
        return result;
    }
    public async dataEntryOfProject(data: any) {
        const result = await Sql.insert(Tables.PROJECT, data);
        return result;
    }
    public async updateEntryOfProject(data: any, id: number) {
        const result: any = await Sql.update(Tables.PROJECT, data, "id = ?", [id]);
        return result;
    }

    /*Search*/
    public async SearchKB(kb: any) {
        const query: any = await Sql.query(`SELECT ${Tables.KBDETAILS}.id,${Tables.KBDETAILS}.title,${Tables.KBDETAILS}.tag,
        ${Tables.KBDETAILS}.body,${Tables.KBDETAILS}.created_by,${Tables.KBDETAILS}.created_on,${Tables.KBDETAILS}.kb_assigner 
        FROM ${Tables.KBDETAILS}
        WHERE ${Tables.KBDETAILS}.title LIKE "%${kb.kbName}%"  AND is_kb_active= 1 AND ${Tables.KBDETAILS}.is_kb_approved=1 AND ${Tables.KBDETAILS}.is_kb_deleted=0 `);

        if (query.length <= 0) {
            return ResponseBuilder.notFound("DATA_NOT_FOUND");
        } else {
            return ResponseBuilder.data(query);
            ;
        }
    }

    public async SearchByCategory(kb: any) {
        const query: any = await Sql.query(`SELECT ${Tables.KBDETAILS}.id,${Tables.KBDETAILS}.title,${Tables.KBDETAILS}.tag,
        ${Tables.KBDETAILS}.body,${Tables.CATEGORIES}.category_name,${Tables.KBDETAILS}.created_by,${Tables.KBDETAILS}.created_on,${Tables.KBDETAILS}.kb_assigner 
        FROM ${Tables.KBDETAILS}
        RIGHT JOIN ${Tables.CATEGORIES}
        ON ${Tables.KBDETAILS}.category_id = categories.id
        WHERE ${Tables.CATEGORIES}.category_name LIKE "%${kb.kbName}%"  AND is_kb_active= 1 AND ${Tables.KBDETAILS}.is_kb_approved=1 AND ${Tables.KBDETAILS}.is_kb_deleted=0`);

        if (query.length <= 0) {
            return ResponseBuilder.notFound("DATA_NOT_FOUND");
        } else {
            return ResponseBuilder.data(query);
            ;
        }
    }

    public async SearchByAll(kb: any) {
        const query: any = await Sql.query(`SELECT ${Tables.KBDETAILS}.id,${Tables.KBDETAILS}.title,${Tables.KBDETAILS}.tag,
        ${Tables.KBDETAILS}.body,${Tables.KBDETAILS}.created_by,${Tables.KBDETAILS}.created_on,${Tables.KBDETAILS}.kb_assigner,
        ${Tables.CATEGORIES}.category_name, ${Tables.PRACTICES}.practice_name, ${Tables.PROJECT}.project_name
        FROM ${Tables.KBDETAILS}
        LEFT JOIN ${Tables.CATEGORIES}
        ON ${Tables.KBDETAILS}.category_id = categories.id
        LEFT JOIN ${Tables.PRACTICES}
        ON ${Tables.KBDETAILS}.practice_id = practices.id
        LEFT JOIN ${Tables.PROJECT}
        ON ${Tables.KBDETAILS}.project_id = projects.id
        WHERE ${Tables.CATEGORIES}.category_name LIKE "%${kb.kbName}%" OR ${Tables.KBDETAILS}.title LIKE "%${kb.kbName}%" OR
        ${Tables.PRACTICES}.practice_name LIKE "%${kb.kbName}%" OR ${Tables.PROJECT}.project_name LIKE "%${kb.kbName}%" OR 
        ${Tables.KBDETAILS}.tag LIKE "%${kb.kbName}%" OR ${Tables.KBDETAILS}.created_by LIKE "%${kb.kbName}%" AND ${Tables.KBDETAILS}.is_kb_active= 1 AND ${Tables.KBDETAILS}.is_kb_approved=1 AND ${Tables.KBDETAILS}.is_kb_deleted=0 `);

        if (query.length <= 0) {
            return ResponseBuilder.notFound("DATA_NOT_FOUND");
        } else {
            return ResponseBuilder.data(query);
            ;
        }
    }

    public async SearchByPractice(kb: any) {
        const query: any = await Sql.query(`SELECT ${Tables.KBDETAILS}.id,${Tables.KBDETAILS}.title,${Tables.KBDETAILS}.tag,
        ${Tables.KBDETAILS}.body,${Tables.PRACTICES}.practice_name,${Tables.KBDETAILS}.created_by,${Tables.KBDETAILS}.created_on,${Tables.KBDETAILS}.kb_assigner 
        FROM ${Tables.KBDETAILS}
        RIGHT JOIN ${Tables.PRACTICES}
        ON ${Tables.KBDETAILS}.practice_id = practices.id
        WHERE ${Tables.PRACTICES}.practice_name LIKE "%${kb.kbName}%"  AND is_kb_active= 1 AND ${Tables.KBDETAILS}.is_kb_approved=1 AND ${Tables.KBDETAILS}.is_kb_deleted=0`);

        if (query.length <= 0) {
            return ResponseBuilder.notFound("DATA_NOT_FOUND");
        } else {
            return ResponseBuilder.data(query);
            ;
        }
    }

    public async SearchByProject(kb: any) {
        const query: any = await Sql.query(`SELECT ${Tables.KBDETAILS}.id,${Tables.KBDETAILS}.title,${Tables.KBDETAILS}.tag,
        ${Tables.KBDETAILS}.body,${Tables.PROJECT}.project_name,${Tables.KBDETAILS}.created_by,${Tables.KBDETAILS}.created_on,${Tables.KBDETAILS}.kb_assigner 
        FROM ${Tables.KBDETAILS}
        RIGHT JOIN ${Tables.PROJECT}
        ON ${Tables.KBDETAILS}.project_id = projects.id
        WHERE ${Tables.PROJECT}.project_name LIKE "%${kb.kbName}%"  AND is_kb_active= 1 AND ${Tables.KBDETAILS}.is_kb_approved=1 AND ${Tables.KBDETAILS}.is_kb_deleted=0`);

        if (query.length <= 0) {
            return ResponseBuilder.notFound("DATA_NOT_FOUND");
        } else {
            return ResponseBuilder.data(query);
            ;
        }
    }

    public async SearchByTag(kb: any) {
        const query: any = await Sql.query(`SELECT ${Tables.KBDETAILS}.id,${Tables.KBDETAILS}.title,${Tables.KBDETAILS}.tag,
        ${Tables.KBDETAILS}.body,${Tables.KBDETAILS}.created_by,${Tables.KBDETAILS}.created_on,${Tables.KBDETAILS}.kb_assigner 
        FROM ${Tables.KBDETAILS}
        WHERE ${Tables.KBDETAILS}.tag LIKE "%${kb.kbName}%"  AND is_kb_active= 1 AND ${Tables.KBDETAILS}.is_kb_approved=1 AND ${Tables.KBDETAILS}.is_kb_deleted=0`);

        if (query.length <= 0) {
            return ResponseBuilder.notFound("DATA_NOT_FOUND");
        } else {
            return ResponseBuilder.data(query);
            ;
        }
    }
    public async SearchByClient(kb: any) {
        const query: any = await Sql.query(`SELECT ${Tables.KBDETAILS}.id,${Tables.KBDETAILS}.title,${Tables.KBDETAILS}.tag,
        ${Tables.KBDETAILS}.body,${Tables.KBDETAILS}.created_by,${Tables.KBDETAILS}.created_on,${Tables.KBDETAILS}.kb_assigner 
        FROM ${Tables.KBDETAILS}
        WHERE ${Tables.KBDETAILS}.created_by LIKE "%${kb.kbName}%"  AND is_kb_active= 1 AND ${Tables.KBDETAILS}.is_kb_approved=1 AND ${Tables.KBDETAILS}.is_kb_deleted=0`);

        if (query.length <= 0) {
            return ResponseBuilder.notFound("DATA_NOT_FOUND");
        } else {
            return ResponseBuilder.data(query);
            ;
        }
    }

    public async commentKB(data) {
        const query: any = await Sql.insert(Tables.COMMENTSTABLE, data);
        if (query.length <= 0) {
            return ResponseBuilder.notFound("DATA_NOT_FOUND");
        } else {
            return ResponseBuilder.data(query);
            ;
        }
    }

    public async problemResolved(data) {
        const query: any = await Sql.insert(Tables.USERACTION, data);
        if (query) {
            return ResponseBuilder.notFound("Data can't insert");
        } else {
            return ResponseBuilder.data(query);
            ;
        }
    }
    // ${Tables.KBTABLE}.is_kb_active=1 AND ${Tables.KBTABLE}.is_kb_deleted=0 AND ${Tables.KBTABLE}.is_kb_approved=1  //    ORDER BY ${Tables.KBTABLE}.is_kb_approved
    public async mykbList(employeeDetails: any) {
        const query: any = await Sql.query(`SELECT ${Tables.KBTABLE}.id,${Tables.KBTABLE}.title,categories.category_name,${Tables.KBTABLE}.is_kb_approved,
        ${Tables.KBAPPROVEREJECTCOMMENTDETAIL}.approve_reject_comment,${Tables.KBTABLE}.created_on
                FROM ${Tables.KBTABLE}
                       INNER JOIN categories 
                       ON ${Tables.KBTABLE}.category_id=categories.id
                       LEFT JOIN kb_approve_reject_comment_details
                       ON kb_details.id=${Tables.KBAPPROVEREJECTCOMMENTDETAIL}.kb_detail_id
                       WHERE ${Tables.KBTABLE}.created_by="${employeeDetails.email}" AND ${Tables.KBTABLE}.is_kb_active=1 AND ${Tables.KBTABLE}.is_kb_deleted=0
                       GROUP BY ${Tables.KBTABLE}.id
                       ORDER BY id DESC`
        );
        if (!query) {
            return ResponseBuilder.notFound("Cannot found data");
        } else {
            return ResponseBuilder.data(query);
            ;
        }
    }

    public async getRatingsOnKB(rating: any) {
        const query: any = await Sql.query(`SELECT id,kb_detail_id,rating
            FROM ${Tables.USERRATING} 
            WHERE ${Tables.USERRATING}.kb_detail_id=${rating} 
            AND is_active=1 AND is_deleted=0
            ORDER BY rating DESC LIMIT 0,1`);
        return query;

    }
    public async postRatingsOnKB(rating: any) {
        const query: any = await Sql.insert(Tables.USERRATING, rating);
        return query;

    }
    public async postLikesOnKB(likes: any) {
        const query: any = await Sql.update(Tables.USERACTION, {
            is_like: likes.is_like,
        }, "kb_detail_id = ? AND created_by=?", [likes.kb_detail_id, likes.create_by]);
        return query;

    }

    public async KBViewed(viewDetails: any) {
        const query: any = await Sql.query(`SELECT COUNT(*) AS kb_view_count FROM kb_user_action_details
        WHERE kb_user_action_details.kb_detail_id="${viewDetails.kb_detail_id}"`);
        return query;
    }
    public async checkIfKBisViewed(viewDetails: any) {
        const query: any = await Sql.query(`SELECT kb_user_action_details.kb_detail_id, kb_user_action_details.created_by,kb_user_action_details.is_view,kb_user_action_details.is_active,kb_user_action_details.is_deleted
        from ${Tables.USERACTION}
        WHERE kb_user_action_details.kb_detail_id=${viewDetails.kb_detail_id} AND kb_user_action_details.created_by="${viewDetails.created_by}"`);
        return query;
    }
    public async kbPostViewed(viewData: any) {
        const query = await Sql.insert(Tables.USERACTION, viewData);
        return query;
    }
    public async KbIsUseful(data: any) {
        const query = await Sql.update(Tables.USERACTION, {
            is_useful: data.is_useful,
            description: data.description,
            useful_reason_type: data.useful_reason_type
        }, "kb_detail_id = ? AND created_by=?", [data.kb_detail_id, data.created_by]);
        return query;
    }

    public async findKbForMail(data: any) {

        const query = await Sql.query(`SELECT ${Tables.KBDETAILS}.title,${Tables.KBDETAILS}.id,${Tables.KBDETAILS}.category_id,${Tables.KBDETAILS}.practice_id,${Tables.KBDETAILS}.project_id,${Tables.KBDETAILS}.tag,${Tables.KBDETAILS}.team,${Tables.KBDETAILS}.body,${Tables.KBDETAILS}.is_kb_draft
        FROM ${Tables.KBDETAILS} 
        RIGHT JOIN ${Tables.CATEGORIES}
        ON ${Tables.KBDETAILS}.category_id=categories.id
        RIGHT JOIN ${Tables.PRACTICES}
        ON ${Tables.KBDETAILS}.practice_id=practices.id
        RIGHT JOIN ${Tables.PROJECT}
        ON ${Tables.KBDETAILS}.project_id=projects.id
        WHERE ${Tables.KBDETAILS}.title="${data.title}" AND ${Tables.KBDETAILS}.category_id=${data.category_id} AND	practices.practice_name="${data.practice}" AND ${Tables.KBDETAILS}.project_id=${data.project_id} AND ${Tables.KBDETAILS}.is_kb_approved=0 AND ${Tables.KBDETAILS}.is_kb_draft=0`);
        return query;
    }

    public async addCategoryColor(data: any) {

        const query = await Sql.query(`UPDATE ${Tables.CATEGORIES} SET bg_color='${data.bg_color}' WHERE category_code LIKE '%${data.category_name}%' OR category_name LIKE '%${data.category_name}%'`);
        return query;
    }

    public async supportingQuery(details: any) {
        const getPracticeData: any = await Sql.query(`SELECT id,practice_name FROM ${Tables.PRACTICES} WHERE practice_name="${details}"`);
        return await getPracticeData;
    }

}