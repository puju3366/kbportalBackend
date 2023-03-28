import { Response } from "express";
import * as Sql from "jm-ez-mysql";
import { Tables } from "../../../config/tables";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { Constants } from '../../../config/constants';

export class KBMiddleware {

  public IsTitleAlreadyExist = async (req: any, res: Response, next: () => void) => {
    // const getPracticeData: any = await Sql.query(`SELECT id,practice_name FROM ${Tables.PRACTICES} WHERE FIND_IN_SET(practice_name, "${req.body.practice_id}")`)
    const title = await Sql.query(`SELECT COUNT(id) AS Count FROM ${Tables.KBTABLE}  WHERE title="${req.body.title}" AND 
    category_id=${req.body.category_id} AND project_id=${req.body.project_id} AND team="${req.body.team}"
    `)
    if (title[0].Count > 0) {
      const response = await ResponseBuilder.getErrorResponse({ error: "KB Already Exist" })
      res.json(ResponseBuilder.getErrorResponse(title, "KB ALREADY Exists", Constants.BAD_REQ));
    } else {
      next()
    }
  }

  public IsKBAlreadyDeleted = async (req: any, res: Response, next: () => void) => {
    const data = await Sql.first(Tables.KBTABLE, ["*"], "id = ?", [req.params.id]);
    const dataToShow = {
      title: data.title,
      tag: data.title,
      body: data.body
    }
    if (data.is_deleted === 1) {
      res.status(Constants.BAD_REQ).json(ResponseBuilder.getErrorResponse(dataToShow, "ERR_DATA_ALREADY_DELETED", Constants.BAD_REQ));
    }
    else {
      next()
    }
  }

  public async validatePracticeName(req: any, res: Response, next: () => void) {
    const result = await Sql.first(Tables.PRACTICES, ["title"], "title = ?", [req.body.Value]);
    if (result) {
      res.status(Constants.BAD_REQ).json(ResponseBuilder.getErrorResponse(result, "ERR_TITLE_ALREADY_EXISTS", Constants.BAD_REQ));
    } else {
      next()
    }
  }

  public async isKbActiveToComment(req: any, res: Response, next: () => void) {
    const query = await Sql.query(`SELECT * FROM ${Tables.KBTABLE} WHERE id=${req.body.kb_detail_id}`)
    if (query.length > 0) {
      if (query[0].is_active == 0 || query[0].is_deleted == 1) {
        res.status(Constants.BAD_REQ).json(ResponseBuilder.getErrorResponse(query, "ERR_KB_IS_NOT_ACTIVE", Constants.BAD_REQ));
      } else {
        next();
      }
    } else {
      next();
    }
  }
  public async kbAlreadyCommented(req: any, res: Response, next: () => void) {
    const query = await Sql.query(`SELECT * FROM ${Tables.COMMENTSTABLE} WHERE user_id=${req.body.user_id} AND kb_detail_id = ${req.body.kb_detail_id} AND is_active=1 AND is_deleted=0`);
    if (query.length > 0) {
      res.status(Constants.BAD_REQ).json(ResponseBuilder.getErrorResponse(query, "ERR_KB_ALREADY_COMMENTED", Constants.BAD_REQ));
    } else {
      next();
    }
  }

  public async isKBAlreadyRated(req: any, res: Response, next: () => void) {
    const query = await Sql.query(`SELECT id,kb_detail_id,rating,created_by 
    FROM kb_rating_details 
    WHERE kb_rating_details.kb_detail_id="${req.body.kb_detail_id}" AND kb_rating_details.created_by="${req.body.created_by}"  AND is_active=1 AND is_deleted=0`);
    if (query.length > 0) {
      // const updateRating: any = await Sql.update(Tables.USERRATING, { rating: req.body.rating, modified_by: req.body.created_by }, "id = ?", [query[0].id]);
      // return res.status(200).json(ResponseBuilder.getSuccessResponse(updateRating, "Rating updated successfully"));
      return res.status(200).json(ResponseBuilder.getSuccessResponse(query, "You Already Rated This KB"));
    } else {
      next();
    }
  }

  public async isKBAlreadyLiked(req: any, res: Response, next: () => void) {
    const query = await Sql.query(`SELECT id,kb_detail_id,is_like,created_by 
    FROM ${Tables.USERACTION} 
    WHERE ${Tables.USERACTION}.kb_detail_id="${req.body.kb_detail_id}" AND
     ${Tables.USERACTION}.created_by="${req.body.create_by}" AND is_like = 1 AND is_active=1 AND is_deleted=0 `);
    if (query.length > 0) {
      // const updateRating:any = await Sql.update(Tables.USERACTION, {rating:req.body.rating,modified_by:req.body.created_by}, "id = ?", [query[0].id]);
      return res.status(200).json(ResponseBuilder.getSuccessResponse(query, "You Already Liked This KB"));
    } else {
      next();
    }
  }
}