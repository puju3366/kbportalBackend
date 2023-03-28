import * as Sql from "jm-ez-mysql";
import * as _ from "lodash";
import { Tables } from "../../../config/tables";


export class DashBoardUtils {
    public async getAllCounts() {
        const result = await Sql.query(`SELECT COUNT(id) AS totalCount FROM ${Tables.KBTABLE} as kd where DATE_FORMAT(kd.created_on,'%Y-%m') = DATE_FORMAT(CURRENT_DATE(),'%Y-%m') AND kd.is_kb_active=1 AND kd.is_kb_deleted=0;`)
        return result[0].totalCount;
    }
    public async getKBByMonth() {
        const result = await Sql.query(`SELECT m.month_name AS month_name, m.month_order_seqence AS month_no, IFNULL(kd.cnt, 0) AS 'count'
        FROM ${Tables.MONTH} AS m
        LEFT JOIN (SELECT MONTHNAME(kd.created_on) AS month_name, COUNT(kd.id) AS cnt
          FROM ${Tables.KBTABLE} AS kd
          WHERE kd.is_kb_active = 1 AND kd.is_kb_deleted = 0 AND YEAR(kd.created_on) = YEAR(CURDATE()) GROUP BY MONTHNAME(kd.created_on)) AS kd
          ON kd.month_name = m.month_name
        WHERE m.month_order_seqence <= MONTH(CURDATE())ORDER BY m.month_order_seqence;`)
        return result;
    }
    public async getKbPracticeCounts() {
        const query = await Sql.query(`SELECT  COUNT(${Tables.KBPRACTICEDETAILS}.practice_id) AS totalCount,${Tables.KBPRACTICEDETAILS}.practice_id ,${Tables.PRACTICES}.practice_name
        FROM ${Tables.KBPRACTICEDETAILS} 
        INNER JOIN ${Tables.PRACTICES}
        ON ${Tables.KBPRACTICEDETAILS}.practice_id=${Tables.PRACTICES}.id
        INNER JOIN ${Tables.KBTABLE}
        ON ${Tables.KBPRACTICEDETAILS}.kb_detail_id = ${Tables.KBTABLE}.id
        WHERE DATE_FORMAT(${Tables.KBPRACTICEDETAILS}.created_on,'%Y-%m') = DATE_FORMAT(CURRENT_DATE(),'%Y-%m') AND ${Tables.KBPRACTICEDETAILS}.is_active=1 AND ${Tables.KBPRACTICEDETAILS}.is_deleted=0  AND ${Tables.KBTABLE}.is_kb_approved=1 AND ${Tables.KBTABLE}.is_kb_deleted=0
        GROUP BY ${Tables.KBPRACTICEDETAILS}.practice_id;`)
        return query;

    }
    public async getKbProjectCounts(practice: any) {
        const query = await Sql.query(`SELECT COUNT(kd.id) AS totalCount,kd.project_id , p.project_name
        FROM ${Tables.KBTABLE} as kd
        INNER JOIN ${Tables.PROJECT} as p
        ON kd.project_id = p.id
        WHERE DATE_FORMAT(kd.created_on,'%Y-%m') = DATE_FORMAT(CURRENT_DATE(),'%Y-%m')  AND kd.is_kb_active=1 AND kd.is_kb_deleted=0 AND kd.is_kb_approved=1
        GROUP BY kd.project_id;`)
        return query;
    }
    public async getunreviewedKB() {
        const query = await Sql.query(`SELECT COUNT(is_kb_approved) AS Un_Reviewed_KB_count 
        FROM ${Tables.KBTABLE} 
        WHERE is_kb_active=1 AND is_kb_deleted=0 AND is_kb_approved=0 AND kb_expiry_date > CURDATE();`)
        return query;
    }
    public async getKbPerTechnology() {
        const query = await Sql.query(`SELECT COUNT(ktd.kb_detail_id) AS totalCount,
        ktd.technology_id,
        t.technology_name
        FROM ${Tables.TECHNOLOGYDETAILS} as ktd
        INNER JOIN ${Tables.TECHNOLOGY} as t
        ON ktd.technology_id = t.id
        WHERE DATE_FORMAT(ktd.created_on,'%Y-%m') = DATE_FORMAT(CURRENT_DATE(),'%Y-%m')  
        AND ktd.is_active=1 
        AND ktd.is_deleted=0 
        GROUP BY ktd.technology_id;`)
        return query;
    }

    public async getKBPerResolvedIssues() {
        const query = await Sql.query(`SELECT COUNT(is_useful) AS IssueResolveCount
        FROM ${Tables.USERACTION}
        WHERE is_useful=1 AND is_active=1 AND is_deleted=0 AND DATE_FORMAT(created_on,'%Y-%m') = DATE_FORMAT(CURRENT_DATE(),'%Y-%m')`);
        return query;
    }
    public async getQuarterOneCount(year: any, quarter: any) {
        if (quarter == 'Q1') {
            const QuarterForApril = "04-01 00:00:00"
            const QuarterToJune = "06-30 23:23:59"
            const query = await Sql.query(`SELECT  COUNT(${Tables.KBPRACTICEDETAILS}.practice_id) AS totalCount,${Tables.KBPRACTICEDETAILS}.practice_id ,${Tables.PRACTICES}.practice_name
        FROM ${Tables.KBPRACTICEDETAILS} 
        INNER JOIN ${Tables.PRACTICES}
        ON ${Tables.KBPRACTICEDETAILS}.practice_id=${Tables.PRACTICES}.id
        INNER JOIN ${Tables.KBTABLE}
        ON ${Tables.KBPRACTICEDETAILS}.kb_detail_id = ${Tables.KBTABLE}.id
        WHERE kb_practice_details.created_on BETWEEN '${year}-${QuarterForApril}' AND '${year}-${QuarterToJune}'  AND ${Tables.KBPRACTICEDETAILS}.is_active=1 AND ${Tables.KBPRACTICEDETAILS}.is_deleted=0  AND ${Tables.KBTABLE}.is_kb_approved=1 AND ${Tables.KBTABLE}.is_kb_active=1 AND ${Tables.KBTABLE}.is_kb_deleted=0
        GROUP BY ${Tables.KBPRACTICEDETAILS}.practice_id
        ORDER BY ${Tables.PRACTICES}.practice_name ASC;`)

            return query;
        }
        if (quarter == 'Q2') {
            const QuarterForJuly = "07-01 00:00:00"
            const QuarterToSeptember = "09-30 23:23:59"
            const query = await Sql.query(`SELECT  COUNT(${Tables.KBPRACTICEDETAILS}.practice_id) AS totalCount,${Tables.KBPRACTICEDETAILS}.practice_id ,${Tables.PRACTICES}.practice_name
        FROM ${Tables.KBPRACTICEDETAILS} 
        INNER JOIN ${Tables.PRACTICES}
        ON ${Tables.KBPRACTICEDETAILS}.practice_id=${Tables.PRACTICES}.id
        INNER JOIN ${Tables.KBTABLE}
        ON ${Tables.KBPRACTICEDETAILS}.kb_detail_id = ${Tables.KBTABLE}.id
        WHERE kb_practice_details.created_on BETWEEN '${year}-${QuarterForJuly}' AND '${year}-${QuarterToSeptember}'  AND ${Tables.KBPRACTICEDETAILS}.is_active=1 AND ${Tables.KBPRACTICEDETAILS}.is_deleted=0  AND ${Tables.KBTABLE}.is_kb_approved=1 AND ${Tables.KBTABLE}.is_kb_active=1 AND ${Tables.KBTABLE}.is_kb_deleted=0
        GROUP BY ${Tables.KBPRACTICEDETAILS}.practice_id
        ORDER BY ${Tables.PRACTICES}.practice_name ASC;`)

            return query;
        }
        if (quarter == 'Q3') {
            const QuarterForOctober = "10-01 00:00:00"
            const QuarterToDecember = "12-31 23:23:59"
            const query = await Sql.query(`SELECT  COUNT(${Tables.KBPRACTICEDETAILS}.practice_id) AS totalCount,${Tables.KBPRACTICEDETAILS}.practice_id ,${Tables.PRACTICES}.practice_name
        FROM ${Tables.KBPRACTICEDETAILS} 
        INNER JOIN ${Tables.PRACTICES}
        ON ${Tables.KBPRACTICEDETAILS}.practice_id=${Tables.PRACTICES}.id
        INNER JOIN ${Tables.KBTABLE}
        ON ${Tables.KBPRACTICEDETAILS}.kb_detail_id = ${Tables.KBTABLE}.id
        WHERE kb_practice_details.created_on BETWEEN '${year}-${QuarterForOctober}' AND '${year}-${QuarterToDecember}'  AND ${Tables.KBPRACTICEDETAILS}.is_active=1 AND ${Tables.KBPRACTICEDETAILS}.is_deleted=0  AND ${Tables.KBTABLE}.is_kb_approved=1 AND ${Tables.KBTABLE}.is_kb_active=1 AND ${Tables.KBTABLE}.is_kb_deleted=0
        GROUP BY ${Tables.KBPRACTICEDETAILS}.practice_id
        ORDER BY ${Tables.PRACTICES}.practice_name ASC;`)

            return query;
        }
        if (quarter == 'Q4') {
            let yearresult = Number(year) + 1

            const QuarterForJanuary = "01-01 00:00:00"
            const QuarterToMarch = "03-31 23:23:59"
            const query = await Sql.query(`SELECT  COUNT(${Tables.KBPRACTICEDETAILS}.practice_id) AS totalCount,${Tables.KBPRACTICEDETAILS}.practice_id ,${Tables.PRACTICES}.practice_name
        FROM ${Tables.KBPRACTICEDETAILS} 
        INNER JOIN ${Tables.PRACTICES}
        ON ${Tables.KBPRACTICEDETAILS}.practice_id=${Tables.PRACTICES}.id
        INNER JOIN ${Tables.KBTABLE}
        ON ${Tables.KBPRACTICEDETAILS}.kb_detail_id = ${Tables.KBTABLE}.id
        WHERE kb_practice_details.created_on BETWEEN '${yearresult}-${QuarterForJanuary}' AND '${yearresult}-${QuarterToMarch}'  AND ${Tables.KBPRACTICEDETAILS}.is_active=1 AND ${Tables.KBPRACTICEDETAILS}.is_deleted=0  AND ${Tables.KBTABLE}.is_kb_approved=1 AND ${Tables.KBTABLE}.is_kb_active=1 AND ${Tables.KBTABLE}.is_kb_deleted=0
        GROUP BY ${Tables.KBPRACTICEDETAILS}.practice_id
        ORDER BY ${Tables.PRACTICES}.practice_name ASC;`)

            return query;
        }


    }
}
