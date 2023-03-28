"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xlsxUtil = void 0;
const XLSX = require('xlsx');
class xlsxUtil {
}
exports.xlsxUtil = xlsxUtil;
xlsxUtil.generateExcelFromData = (jsonData) => {
    try {
        const ws = XLSX.utils.json_to_sheet(jsonData);
        const file = XLSX.utils.sheet_to_csv(ws);
        return file;
    }
    catch (error) {
        return null;
    }
};
//# sourceMappingURL=excel-parser.js.map