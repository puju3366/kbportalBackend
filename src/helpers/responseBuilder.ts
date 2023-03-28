import * as l10n from "jm-ez-l10n";
import { Failure } from "./error";

export class ResponseBuilder {

  public static successMessage(message: string): ResponseBuilder {
    const rb: ResponseBuilder = new ResponseBuilder();
    rb.code = 200;
    rb.message = message;
    return rb;
  }

  public static errorMessage(message?: any): ResponseBuilder {
    const rb: ResponseBuilder = new ResponseBuilder();
    rb.code = 500;
    rb.message = message != null ? message : l10n.t("ERR_INTERNAL_SERVER");
    rb.status = true;
    rb.result = null;
    return rb;
  }

  public static badRequest(message: any): ResponseBuilder {
    const rb: ResponseBuilder = new ResponseBuilder();
    rb.code = 400;
    rb.message = message != null ? message : l10n.t("ERR_INTERNAL_SERVER");
    rb.status = true;
    rb.result = null;
    return rb;
  }

  public static notFound(message: any): ResponseBuilder {
    const rb: ResponseBuilder = new ResponseBuilder();
    rb.code = 404;
    rb.message = message != null ? message : l10n.t("ERR_INTERNAL_SERVER");
    rb.status = true;
    rb.result = null;
    return rb;
  }

  public static data(result: Json, message?: string): ResponseBuilder {
    const rb: ResponseBuilder = new ResponseBuilder();
    rb.code = 200;
    rb.status = true;
    if (result) {
      result.message = message;
    }
    rb.result = result;
    rb.message = message || null;
    return rb;
  }

  public static error(err: Failure, message?: string): ResponseBuilder {
    const rb: ResponseBuilder = new ResponseBuilder();
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

  public static getSuccessResponse(result: Json, message?: string): ResponseBuilder {
    const rb: ResponseBuilder = new ResponseBuilder();
    rb.code = 200;
    rb.status = true;
    rb.result = result;
    rb.message = message || null;
    return rb;
  }

  public static getErrorResponse(result: Json, message?: string, errorCode?: number): ResponseBuilder {
    const rb: ResponseBuilder = new ResponseBuilder();
    rb.code = errorCode || 404;
    rb.status = false;
    rb.result = result;
    rb.message = message || null;
    return rb;
  }
  public static respSuccess(result: Json, message?: string): ResponseBuilder {
    const data: any = result;
    let respObj = null;
    if (result) {
      respObj = {
        items: result,
        totalCount: data.data ? data.data.length :result.length,
        status: 1,
        status_code: 200,
        message: message || null,
        event_status : process.env.EVENT_STATUS

      };
    } else {
      respObj = {
        items: [],
        totalCount: 0,
        status: 1,
        status_code: 200,
        message: "Success",
        event_status : process.env.EVENT_STATUS

      }
    }
    return respObj;
  }
  public static respSuccess1(result: Json, message?: string): ResponseBuilder {
    const data: any = result;
    let respObj = null;
    if (result) {
      respObj = {
        items: result,
        totalCount: data.data ? data.data.length :result.length,
        status: 1,
        status_code: 200,
        message: message || null,
        event_status : process.env.EVENT_STATUS

      };
    } else {
      respObj = {
        items: [],
        totalCount: 0,
        status: 1,
        status_code: 200,
        message: "Success",
        event_status : process.env.EVENT_STATUS

      }
    }
    return respObj;
  }


  public code: number;
  public message: string;
  public error: string;
  public status: boolean;
  public result: any;
  public description: string;
}
