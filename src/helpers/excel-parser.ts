const XLSX = require('xlsx');


export class xlsxUtil {

    public static generateExcelFromData = (jsonData) => {
        try {
            const ws = XLSX.utils.json_to_sheet(jsonData);
            const file = XLSX.utils.sheet_to_csv(ws);
            return file;
        } catch (error) {
            return null;
        }
    };

}