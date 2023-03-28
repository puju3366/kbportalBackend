"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProblemResolved = exports.KBModel = void 0;
const class_validator_1 = require("class-validator");
const model_1 = require("../../../model");
class KBModel extends model_1.Model {
    // @IsNotEmpty()
    // public kb_expiry_date: string;
    constructor(body1) {
        super();
        const { title, category_id, practice_id, project_id, tag, team, body, is_kb_draft, created_by, kb_assigner, kb_approved_by, } = body1;
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
__decorate([
    class_validator_1.IsNotEmpty()
], KBModel.prototype, "title", void 0);
__decorate([
    class_validator_1.IsNotEmpty()
], KBModel.prototype, "category_id", void 0);
__decorate([
    class_validator_1.IsNotEmpty()
], KBModel.prototype, "practice_id", void 0);
__decorate([
    class_validator_1.IsNotEmpty()
], KBModel.prototype, "tag", void 0);
__decorate([
    class_validator_1.IsNotEmpty()
], KBModel.prototype, "team", void 0);
__decorate([
    class_validator_1.IsNotEmpty()
], KBModel.prototype, "body", void 0);
__decorate([
    class_validator_1.IsNotEmpty()
], KBModel.prototype, "created_by", void 0);
__decorate([
    class_validator_1.IsNotEmpty()
], KBModel.prototype, "kb_assigner", void 0);
__decorate([
    class_validator_1.IsNotEmpty()
], KBModel.prototype, "kb_approved_by", void 0);
exports.KBModel = KBModel;
class ProblemResolved extends model_1.Model {
    constructor(body1) {
        super();
        const { is_useful, description, is_view, kb_detail_id, user_id, } = body1;
        this.is_useful = is_useful;
        this.description = description;
        this.is_view = is_view;
        this.kb_detail_id = kb_detail_id;
        this.user_id = user_id;
    }
}
__decorate([
    class_validator_1.IsNotEmpty()
], ProblemResolved.prototype, "is_useful", void 0);
__decorate([
    class_validator_1.IsNotEmpty()
], ProblemResolved.prototype, "is_view", void 0);
__decorate([
    class_validator_1.IsNotEmpty()
], ProblemResolved.prototype, "kb_detail_id", void 0);
__decorate([
    class_validator_1.IsNotEmpty()
], ProblemResolved.prototype, "user_id", void 0);
exports.ProblemResolved = ProblemResolved;
//# sourceMappingURL=kBModel.js.map