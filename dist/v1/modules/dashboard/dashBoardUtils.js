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
exports.DashBoardUtils = void 0;
const Sql = require("jm-ez-mysql");
const tables_1 = require("../../../config/tables");
class DashBoardUtils {
    getAllCounts() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Sql.query(`SELECT COUNT(id) AS totalCount FROM ${tables_1.Tables.KBTABLE} as kd where DATE_FORMAT(kd.created_on,'%Y-%m') = DATE_FORMAT(CURRENT_DATE(),'%Y-%m') AND kd.is_kb_active=1 AND kd.is_kb_deleted=0;`);
            return result[0].totalCount;
        });
    }
    getKBByMonth() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Sql.query(`SELECT m.month_name AS month_name, m.month_order_seqence AS month_no, IFNULL(kd.cnt, 0) AS 'count'
        FROM ${tables_1.Tables.MONTH} AS m
        LEFT JOIN (SELECT MONTHNAME(kd.created_on) AS month_name, COUNT(kd.id) AS cnt
          FROM ${tables_1.Tables.KBTABLE} AS kd
          WHERE kd.is_kb_active = 1 AND kd.is_kb_deleted = 0 AND YEAR(kd.created_on) = YEAR(CURDATE()) GROUP BY MONTHNAME(kd.created_on)) AS kd
          ON kd.month_name = m.month_name
        WHERE m.month_order_seqence <= MONTH(CURDATE())ORDER BY m.month_order_seqence;`);
            return result;
        });
    }
    getKbPracticeCounts() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield Sql.query(`SELECT  COUNT(${tables_1.Tables.KBPRACTICEDETAILS}.practice_id) AS totalCount,${tables_1.Tables.KBPRACTICEDETAILS}.practice_id ,${tables_1.Tables.PRACTICES}.practice_name
        FROM ${tables_1.Tables.KBPRACTICEDETAILS} 
        INNER JOIN ${tables_1.Tables.PRACTICES}
        ON ${tables_1.Tables.KBPRACTICEDETAILS}.practice_id=${tables_1.Tables.PRACTICES}.id
        INNER JOIN ${tables_1.Tables.KBTABLE}
        ON ${tables_1.Tables.KBPRACTICEDETAILS}.kb_detail_id = ${tables_1.Tables.KBTABLE}.id
        WHERE DATE_FORMAT(${tables_1.Tables.KBPRACTICEDETAILS}.created_on,'%Y-%m') = DATE_FORMAT(CURRENT_DATE(),'%Y-%m') AND ${tables_1.Tables.KBPRACTICEDETAILS}.is_active=1 AND ${tables_1.Tables.KBPRACTICEDETAILS}.is_deleted=0  AND ${tables_1.Tables.KBTABLE}.is_kb_approved=1 AND ${tables_1.Tables.KBTABLE}.is_kb_deleted=0
        GROUP BY ${tables_1.Tables.KBPRACTICEDETAILS}.practice_id;`);
            return query;
        });
    }
    getKbProjectCounts(practice) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield Sql.query(`SELECT COUNT(kd.id) AS totalCount,kd.project_id , p.project_name
        FROM ${tables_1.Tables.KBTABLE} as kd
        INNER JOIN ${tables_1.Tables.PROJECT} as p
        ON kd.project_id = p.id
        WHERE DATE_FORMAT(kd.created_on,'%Y-%m') = DATE_FORMAT(CURRENT_DATE(),'%Y-%m')  AND kd.is_kb_active=1 AND kd.is_kb_deleted=0 AND kd.is_kb_approved=1
        GROUP BY kd.project_id;`);
            return query;
        });
    }
    getunreviewedKB() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield Sql.query(`SELECT COUNT(is_kb_approved) AS Un_Reviewed_KB_count 
        FROM ${tables_1.Tables.KBTABLE} 
        WHERE is_kb_active=1 AND is_kb_deleted=0 AND is_kb_approved=0 AND kb_expiry_date > CURDATE();`);
            return query;
        });
    }
    getKbPerTechnology() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield Sql.query(`SELECT COUNT(ktd.kb_detail_id) AS totalCount,
        ktd.technology_id,
        t.technology_name
        FROM ${tables_1.Tables.TECHNOLOGYDETAILS} as ktd
        INNER JOIN ${tables_1.Tables.TECHNOLOGY} as t
        ON ktd.technology_id = t.id
        WHERE DATE_FORMAT(ktd.created_on,'%Y-%m') = DATE_FORMAT(CURRENT_DATE(),'%Y-%m')  
        AND ktd.is_active=1 
        AND ktd.is_deleted=0 
        GROUP BY ktd.technology_id;`);
            return query;
        });
    }
    getKBPerResolvedIssues() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield Sql.query(`SELECT COUNT(is_useful) AS IssueResolveCount
        FROM ${tables_1.Tables.USERACTION}
        WHERE is_useful=1 AND is_active=1 AND is_deleted=0 AND DATE_FORMAT(created_on,'%Y-%m') = DATE_FORMAT(CURRENT_DATE(),'%Y-%m')`);
            return query;
        });
    }
    getQuarterOneCount(year, quarter) {
        return __awaiter(this, void 0, void 0, function* () {
            if (quarter == 'Q1') {
                const QuarterForApril = "04-01 00:00:00";
                const QuarterToJune = "06-30 23:23:59";
                const query = yield Sql.query(`SELECT  COUNT(${tables_1.Tables.KBPRACTICEDETAILS}.practice_id) AS totalCount,${tables_1.Tables.KBPRACTICEDETAILS}.practice_id ,${tables_1.Tables.PRACTICES}.practice_name
        FROM ${tables_1.Tables.KBPRACTICEDETAILS} 
        INNER JOIN ${tables_1.Tables.PRACTICES}
        ON ${tables_1.Tables.KBPRACTICEDETAILS}.practice_id=${tables_1.Tables.PRACTICES}.id
        INNER JOIN ${tables_1.Tables.KBTABLE}
        ON ${tables_1.Tables.KBPRACTICEDETAILS}.kb_detail_id = ${tables_1.Tables.KBTABLE}.id
        WHERE kb_practice_details.created_on BETWEEN '${year}-${QuarterForApril}' AND '${year}-${QuarterToJune}'  AND ${tables_1.Tables.KBPRACTICEDETAILS}.is_active=1 AND ${tables_1.Tables.KBPRACTICEDETAILS}.is_deleted=0  AND ${tables_1.Tables.KBTABLE}.is_kb_approved=1 AND ${tables_1.Tables.KBTABLE}.is_kb_active=1 AND ${tables_1.Tables.KBTABLE}.is_kb_deleted=0
        GROUP BY ${tables_1.Tables.KBPRACTICEDETAILS}.practice_id
        ORDER BY ${tables_1.Tables.PRACTICES}.practice_name ASC;`);
                return query;
            }
            if (quarter == 'Q2') {
                const QuarterForJuly = "07-01 00:00:00";
                const QuarterToSeptember = "09-30 23:23:59";
                const query = yield Sql.query(`SELECT  COUNT(${tables_1.Tables.KBPRACTICEDETAILS}.practice_id) AS totalCount,${tables_1.Tables.KBPRACTICEDETAILS}.practice_id ,${tables_1.Tables.PRACTICES}.practice_name
        FROM ${tables_1.Tables.KBPRACTICEDETAILS} 
        INNER JOIN ${tables_1.Tables.PRACTICES}
        ON ${tables_1.Tables.KBPRACTICEDETAILS}.practice_id=${tables_1.Tables.PRACTICES}.id
        INNER JOIN ${tables_1.Tables.KBTABLE}
        ON ${tables_1.Tables.KBPRACTICEDETAILS}.kb_detail_id = ${tables_1.Tables.KBTABLE}.id
        WHERE kb_practice_details.created_on BETWEEN '${year}-${QuarterForJuly}' AND '${year}-${QuarterToSeptember}'  AND ${tables_1.Tables.KBPRACTICEDETAILS}.is_active=1 AND ${tables_1.Tables.KBPRACTICEDETAILS}.is_deleted=0  AND ${tables_1.Tables.KBTABLE}.is_kb_approved=1 AND ${tables_1.Tables.KBTABLE}.is_kb_active=1 AND ${tables_1.Tables.KBTABLE}.is_kb_deleted=0
        GROUP BY ${tables_1.Tables.KBPRACTICEDETAILS}.practice_id
        ORDER BY ${tables_1.Tables.PRACTICES}.practice_name ASC;`);
                return query;
            }
            if (quarter == 'Q3') {
                const QuarterForOctober = "10-01 00:00:00";
                const QuarterToDecember = "12-31 23:23:59";
                const query = yield Sql.query(`SELECT  COUNT(${tables_1.Tables.KBPRACTICEDETAILS}.practice_id) AS totalCount,${tables_1.Tables.KBPRACTICEDETAILS}.practice_id ,${tables_1.Tables.PRACTICES}.practice_name
        FROM ${tables_1.Tables.KBPRACTICEDETAILS} 
        INNER JOIN ${tables_1.Tables.PRACTICES}
        ON ${tables_1.Tables.KBPRACTICEDETAILS}.practice_id=${tables_1.Tables.PRACTICES}.id
        INNER JOIN ${tables_1.Tables.KBTABLE}
        ON ${tables_1.Tables.KBPRACTICEDETAILS}.kb_detail_id = ${tables_1.Tables.KBTABLE}.id
        WHERE kb_practice_details.created_on BETWEEN '${year}-${QuarterForOctober}' AND '${year}-${QuarterToDecember}'  AND ${tables_1.Tables.KBPRACTICEDETAILS}.is_active=1 AND ${tables_1.Tables.KBPRACTICEDETAILS}.is_deleted=0  AND ${tables_1.Tables.KBTABLE}.is_kb_approved=1 AND ${tables_1.Tables.KBTABLE}.is_kb_active=1 AND ${tables_1.Tables.KBTABLE}.is_kb_deleted=0
        GROUP BY ${tables_1.Tables.KBPRACTICEDETAILS}.practice_id
        ORDER BY ${tables_1.Tables.PRACTICES}.practice_name ASC;`);
                return query;
            }
            if (quarter == 'Q4') {
                let yearresult = Number(year) + 1;
                const QuarterForJanuary = "01-01 00:00:00";
                const QuarterToMarch = "03-31 23:23:59";
                const query = yield Sql.query(`SELECT  COUNT(${tables_1.Tables.KBPRACTICEDETAILS}.practice_id) AS totalCount,${tables_1.Tables.KBPRACTICEDETAILS}.practice_id ,${tables_1.Tables.PRACTICES}.practice_name
        FROM ${tables_1.Tables.KBPRACTICEDETAILS} 
        INNER JOIN ${tables_1.Tables.PRACTICES}
        ON ${tables_1.Tables.KBPRACTICEDETAILS}.practice_id=${tables_1.Tables.PRACTICES}.id
        INNER JOIN ${tables_1.Tables.KBTABLE}
        ON ${tables_1.Tables.KBPRACTICEDETAILS}.kb_detail_id = ${tables_1.Tables.KBTABLE}.id
        WHERE kb_practice_details.created_on BETWEEN '${yearresult}-${QuarterForJanuary}' AND '${yearresult}-${QuarterToMarch}'  AND ${tables_1.Tables.KBPRACTICEDETAILS}.is_active=1 AND ${tables_1.Tables.KBPRACTICEDETAILS}.is_deleted=0  AND ${tables_1.Tables.KBTABLE}.is_kb_approved=1 AND ${tables_1.Tables.KBTABLE}.is_kb_active=1 AND ${tables_1.Tables.KBTABLE}.is_kb_deleted=0
        GROUP BY ${tables_1.Tables.KBPRACTICEDETAILS}.practice_id
        ORDER BY ${tables_1.Tables.PRACTICES}.practice_name ASC;`);
                return query;
            }
        });
    }
}
exports.DashBoardUtils = DashBoardUtils;
//# sourceMappingURL=dashBoardUtils.js.map