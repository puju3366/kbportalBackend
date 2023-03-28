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
exports.MediaServer = void 0;
const request = require("request");
class MediaServer {
    static upload(file, type, fileName, mimetype) {
        return new Promise((resolve, reject) => {
            const options = {
                method: "POST",
                url: process.env.MEDIA_SERVER,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                formData: {
                    file: {
                        value: (file.data) ? file.data : file,
                        options: {
                            filename: (file.name) ? file.name : fileName,
                            contentType: (file.mimetype) ? file.mimetype : mimetype,
                        },
                    },
                    type: {
                        value: type,
                        options: {},
                    },
                },
            };
            request(options, (error, response, body) => __awaiter(this, void 0, void 0, function* () {
                if (response) {
                    resolve({
                        statusCode: response.statusCode,
                        data: response.body,
                    });
                }
                else {
                    reject(error);
                }
            }));
        });
    }
}
exports.MediaServer = MediaServer;
//# sourceMappingURL=mediaServer.js.map