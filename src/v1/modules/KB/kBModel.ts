import {
    IsEmail, IsNotEmpty, Validate, MaxLength, IsOptional, IsInt
} from "class-validator";
import {
    IsDataAlreadyExistConstraint,
} from "./kBValidator";
import { Model } from "../../../model";

export class KBModel extends Model {

    @IsNotEmpty()
    public title: string;

    @IsNotEmpty()
    public category_id: number;

    @IsNotEmpty()
    public practice_id: string;

    public project_id: number;

    @IsNotEmpty()
    public tag: string;

    @IsNotEmpty()
    public team: string;

    @IsNotEmpty()
    public body: string;

    public is_kb_draft:number;

    @IsNotEmpty()
    public created_by: string;

    @IsNotEmpty()
    public kb_assigner: string;

    @IsNotEmpty()
    public kb_approved_by: string;

    // @IsNotEmpty()
    // public kb_expiry_date: string;

    constructor(body1: any) {
        super();
        const {
            title,
            category_id,
            practice_id,
            project_id,
            tag,
            team,
            body,
            is_kb_draft,
            created_by,
            kb_assigner,
            kb_approved_by,
            // kb_expiry_date,
        } = body1;
        this.title = title;
        this.category_id = category_id;
        this.practice_id = practice_id;
        this.project_id = project_id;
        this.tag = tag;
        this.team = team;
        this.body = body;
        this.is_kb_draft = is_kb_draft;
        this.created_by = created_by;
        this.kb_assigner = kb_assigner;
        this.kb_approved_by = kb_approved_by;
        // this.kb_expiry_date = kb_expiry_date;
    }

}

export class ProblemResolved extends Model {

    @IsNotEmpty()
    public is_useful: number;

    public description: String;

    @IsNotEmpty()
    public is_view: number;

    @IsNotEmpty()
    public kb_detail_id: number;

    @IsNotEmpty()
    public user_id: number;

    
    constructor(body1: any) {
        super();
        const {
            is_useful,
            description,
            is_view,
            kb_detail_id,
            user_id,
        } = body1;
        this.is_useful = is_useful;
        this.description = description;
        this.is_view = is_view;
        this.kb_detail_id = kb_detail_id;
        this.user_id = user_id;
    }

}