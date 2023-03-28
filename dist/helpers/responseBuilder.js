"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseBuilder = void 0;
const l10n = require("jm-ez-l10n");
class ResponseBuilder {
    static successMessage(message) {
        const rb = new ResponseBuilder();
        rb.code = 200;
        rb.message = message;
        return rb;
    }
    static errorMessage(message) {
        const rb = new ResponseBuilder();
        rb.code = 500;
        rb.message = message != null ? message : l10n.t("ERR_INTERNAL_SERVER");
        rb.status = true;
        rb.result = null;
        return rb;
    }
    static badRequest(message) {
        const rb = new ResponseBuilder();
        rb.code = 400;
        rb.message = message != null ? message : l10n.t("ERR_INTERNAL_SERVER");
        rb.status = true;
        rb.result = null;
        return rb;
    }
    static notFound(message) {
        const rb = new ResponseBuilder();
        rb.code = 404;
        rb.message = message != null ? message : l10n.t("ERR_INTERNAL_SERVER");
        rb.status = true;
        rb.result = null;
        return rb;
    }
    static data(result, message) {
        const rb = new ResponseBuilder();
        rb.code = 200;
        rb.status = true;
        if (result) {
            result.message = message;
        }
        rb.result = result;
        rb.message = message || null;
        return rb;
    }
    static error(err, message) {
        const rb = new ResponseBuilder();
        if (err instanceof ResponseBuilder) {
            return err;
        }
        rb.code = 500;
        rb.error = err || l10n.t("ERR_INTERNAL_SERVER");
        rb.message = message || null;
        rb.description = err.description;
        rb.result = err ? l10n.t("ERR_THROW_BY_CODE") : l10n.t("ERR_INTERNAL_SERVER");
        return rb;
    }
    static getSuccessResponse(result, message) {
        const rb = new ResponseBuilder();
        rb.code = 200;
        rb.status = true;
        rb.result = result;
        rb.message = message || null;
        return rb;
    }
    static getErrorResponse(result, message, errorCode) {
        const rb = new ResponseBuilder();
        rb.code = errorCode || 404;
        rb.status = false;
        rb.result = result;
        rb.message = message || null;
        return rb;
    }
    static respSuccess(result, message) {
        const data = result;
        let respObj = null;
        if (result) {
            respObj = {
                items: result,
                totalCount: data.data ? data.data.length : result.length,
                status: 1,
                status_code: 200,
                message: message || null,
                event_status: process.env.EVENT_STATUS
            };
        }
        else {
            respObj = {
                items: [],
                totalCount: 0,
                status: 1,
                status_code: 200,
                message: "Success",
                event_status: process.env.EVENT_STATUS
            };
        }
        return respObj;
    }
    static respSuccess1(result, message) {
        const data = result;
        let respObj = null;
        if (result) {
            respObj = {
                items: result,
                totalCount: data.data ? data.data.length : result.length,
                status: 1,
                status_code: 200,
                message: message || null,
                event_status: process.env.EVENT_STATUS
            };
        }
        else {
            respObj = {
                items: [],
                totalCount: 0,
                status: 1,
                status_code: 200,
                message: "Success",
                event_status: process.env.EVENT_STATUS
            };
        }
        return respObj;
    }
}
exports.ResponseBuilder = ResponseBuilder;
//# sourceMappingURL=responseBuilder.js.map