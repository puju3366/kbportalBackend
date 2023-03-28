"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = void 0;
const model_1 = require("./model");
class Validator {
    validate(arg) {
        // tslint:disable-next-line:only-arrow-functions space-before-function-paren
        return function (req, res, next) {
            model_1.Model.getModel(arg, req.body, req.query).then((m2) => {
                req.model = m2;
                next();
            }).catch((err) => {
                // Refactor validation messages
                const error = err.length > 0 && err[0].constraints ?
                    err[0].constraints[`${Object.keys(err[0].constraints)[0]}`] : err;
                const errMessage = req.t(error).length > 0 ? req.t(error) : error;
                return res.status(400).json({ message: errMessage, result: null, code: 400, status: false });
            });
        };
    }
    fileValidate(arg) {
        // tslint:disable-next-line:only-arrow-functions space-before-function-paren
        return function (req, res, next) {
            model_1.Model.getModel(arg, req.files, req.query).then((m2) => {
                req.model = m2;
                next();
            }).catch((err) => {
                // Refactor validation messages
                const error = err.length > 0 && err[0].constraints ?
                    err[0].constraints[`${Object.keys(err[0].constraints)[0]}`] : err;
                const errMessage = req.t(error).length > 0 ? req.t(error) : error;
                return res.status(400).json({ message: errMessage, result: null, code: 400, status: false });
            });
        };
    }
}
exports.Validator = Validator;
//# sourceMappingURL=validate.js.map