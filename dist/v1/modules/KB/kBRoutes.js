"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KBRoute = void 0;
const express_1 = require("express");
const validate_1 = require("../../../validate");
const kBControler_1 = require("./kBControler");
const kBModel_1 = require("./kBModel");
const kBMiddleware_1 = require("./kBMiddleware");
const router = express_1.Router();
const kBControler = new kBControler_1.KBController();
const v = new validate_1.Validator();
const kBMiddleware = new kBMiddleware_1.KBMiddleware();
// used by publisher*
router.post("/kb-create", v.validate(kBModel_1.KBModel), kBMiddleware.IsTitleAlreadyExist, kBControler.createKB);
// ends
// this  Kbs API are not deferentiated by user type *
router.post("/kb-getall", kBControler.getallKB);
router.post("/kb-getallByCat", kBControler.getallKBByCat);
router.get("/kb-getone/:id", kBControler.getKBDetails);
router.get("/kbpractice/:id", kBControler.getPracticeDetails);
router.post("/getRelativeKB", kBControler.getRelatedKB);
router.post("/getUserRating/:id", kBControler.getUserRating);
// ends
//update category color
router.post("/updateCategory", kBControler.updateCategoryColor);
//To upload image on server
router.post("/imageupload", kBControler.getImageUpload);
//kb details comments  get and comment post
router.post("/kbComment", kBMiddleware.isKbActiveToComment, kBControler.kbComments);
router.post("/rejectComment", kBMiddleware.isKbActiveToComment, kBControler.kbRejected);
router.get("/getKBComments/:id", kBControler.getKBComment);
// ends
//get data from master table of categories, project, practice, Team
router.get("/categories", kBControler.getCategories);
router.get("/project", kBControler.getProjectData);
router.get("/practice", kBControler.getPracticesData);
router.get("/team", kBControler.getTeamsData);
// problemResolved yes or no
router.post("/problemResolved", v.validate(kBModel_1.ProblemResolved), kBControler.kbProblemResolved);
// ends
// View related API
router.get("/kbviewcount/:id", kBControler.getKbViewCount);
router.post("/checkingKBViews", kBControler.checkingKBViews);
router.post("/enterViewedKBPost", kBControler.enterViewedKBPost);
// is_useFul
router.post("/isUseFul", kBControler.isUseFul);
// is_useFul ends
// View related API ends
// this KB api are deferentiated by user 
router.post("/employeeKB", kBControler.myKB);
// ends
//this is to get/ post rating on individual KB
router.get("/getRating/:id", kBControler.getRating);
router.post("/postRating", kBMiddleware.isKBAlreadyRated, kBControler.postRating);
router.post("/postKbLike", kBMiddleware.isKBAlreadyLiked, kBControler.postKbLike);
// ends
// * Get details of kb_comment_details
router.get("/kb-comment-details", kBControler.getallcomment);
// Get kb data which is pending for approval
router.get("/kbapproved", kBControler.getUnapprovedKb);
//kb search on title* 
router.post("/kbSearch", kBControler.searchKB);
router.post("/menudata", kBControler.getMenu);
// ends
//Admin side not is use
router.patch("/kb-togglesatus/:id", kBControler.toggleStatus);
router.patch("/kb-update/:id", v.validate(kBModel_1.KBModel), kBControler.updateKB);
router.delete("/kb-deleteone/:id", kBMiddleware.IsKBAlreadyDeleted, kBControler.deleteKB);
// ends
//api to populate DB*
router.get("/get-practice", kBControler.getPractices);
router.get("/get-project", kBControler.getProject);
router.get("/get-teams", kBControler.getTeams);
// ends
// api to fetch userDetails of KB begins
router.post("/employeeDetails", kBControler.getUserDetails);
router.post("/emailData", kBControler.getUserEmail);
// api to fetch userDetails of KB ends
exports.KBRoute = router;
//# sourceMappingURL=kBRoutes.js.map