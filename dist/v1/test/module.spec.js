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
//Require the dev-dependencies
const request = require("supertest");
const chai_1 = require("chai");
const BASE_URL = 'http://localhost:3002/api/v1/';
describe("Module APIs", () => {
    describe("Create New Module", () => {
        it('returns a 400 with missing name', () => __awaiter(void 0, void 0, void 0, function* () {
            return request(BASE_URL)
                .post('module')
                .send({})
                .expect(400);
        }));
        it('returns a 201 on successful add new record', () => __awaiter(void 0, void 0, void 0, function* () {
            let module = {
                "name": "User",
                "description": "Desc",
                "status": true
            };
            return request(BASE_URL)
                .post('module')
                .send(module)
                .expect(201);
        }));
        it('disallows duplicate name', () => __awaiter(void 0, void 0, void 0, function* () {
            yield request(BASE_URL)
                .post('module')
                .send({
                "name": "User"
            })
                .expect(201);
            yield request(BASE_URL)
                .post('module')
                .send({
                "name": "User"
            })
                .expect(400);
        }));
    });
    describe("Get Module by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        it('disallows alpha number passed as param', () => __awaiter(void 0, void 0, void 0, function* () {
            return request(BASE_URL)
                .get(`module/abcd`)
                .send()
                .expect(400);
        }));
        it('returns false if ID not exists in table', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body: fetchedModule } = yield request(BASE_URL)
                .get(`module/1`)
                .send()
                .expect(200);
            chai_1.expect(fetchedModule.result).equal(false);
        }));
        it('it should GET module object by the given id', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                "name": "User10",
                "description": "Desc",
                "status": true
            };
            const { body: module } = yield request(BASE_URL)
                .post('module')
                .send(payload)
                .expect(201);
            const { body: fetchedModule } = yield request(BASE_URL)
                .get(`module/${module.result.id}`)
                .send()
                .expect(200);
            chai_1.expect(fetchedModule.result.id).equal(module.result.id);
        }));
    }));
});
//# sourceMappingURL=module.spec.js.map