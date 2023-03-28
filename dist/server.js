"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const bodyParser = require("body-parser"); // pull information from HTML POST (express4)
const compression = require("compression"); // Compression request and response
const dotenv = require("dotenv"); // Loads environment variables from a .env
const express = require("express");
// tslint:disable-next-line: no-var-requires
require("express-async-errors");
const helmet = require("helmet"); // Security
const l10n = require("jm-ez-l10n");
const methodOverride = require("method-override"); // simulate DELETE and PUT (express4)
const morgan = require("morgan"); // log requests to the console (express4)
const path = require("path");
const trimRequest = require("trim-request");
const logger_1 = require("./helpers/logger");
const routes_1 = require("./routes");
// import * as fileUpload from "express-fileupload";
const database_1 = require("./database");
const multer = require("multer");
const firebase_1 = require("./firebase");
const swaggerUi = require("swagger-ui-express");
const swagger_1 = require("./swagger");
var cron = require('node-cron');
// Loads environment variables from a .env
dotenv.config();
const upload = multer({
    dest: '/tmp/assets',
});
// initialize database
database_1.DB.init();
firebase_1.default();
class App {
    constructor() {
        this.logger = logger_1.Log.getLogger();
        const NODE_ENV = process.env.NODE_ENV;
        const PORT = process.env.PORT;
        this.app = express();
        this.app.use(helmet());
        this.app.use("/tmp", express.static(path.join("tmp")));
        this.app.use(express.static(path.join(process.cwd(), "public")));
        this.app.all("/*", (req, res, next) => {
            // res.setHeader("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Request-Headers", "*");
            // tslint:disable-next-line: max-line-length
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Access-Control-Allow-Headers, authorization, token, x-device-type, x-app-version, x-build-number, uuid,x-auth-token,X-L10N-Locale");
            res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, PATCH");
            if (req.method === "OPTIONS") {
                res.writeHead(200);
                res.end();
            }
            else {
                next();
            }
        });
        if (NODE_ENV === "development") {
            this.app.use(express.static(path.join(process.cwd(), "tmp")));
            // set the static files location of bower_components
            this.app.use(morgan("dev")); // log every request to the console
        }
        else {
            this.app.use(compression()); // All request compressed
            // set the static files location /tmp/img will be /img for users
            this.app.use(express.static(path.join(process.cwd(), "dist"), { maxAge: "7d" }));
        }
        l10n.setTranslationsFile("en", "src/language/translation.en.json");
        this.app.use(l10n.enableL10NExpress);
        this.app.use(bodyParser.json({ limit: "50mb" }));
        this.app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
        this.app.use(bodyParser.json(), (error, req, res, next) => {
            if (error) {
                return res.status(400).json({ message: req.t("ERR_GENRIC_SYNTAX"), code: 400, status: false, result: null });
            }
            next();
        });
        this.app.use(bodyParser.json({ type: "application/vnd.api+json" })); // parse application/vnd.api+json as json
        // this.app.use(fileUpload());
        this.app.use(upload.any());
        this.app.use(methodOverride());
        this.app.use(trimRequest.all);
        const routes = new routes_1.Routes(NODE_ENV);
        this.app.use("/api/v1", routes.path());
        var task = cron.schedule('1 * * * *', () => {
        }, {
            scheduled: false
        });
        task.start();
        this.app.use("/docs", swaggerUi.serve, swaggerUi.setup(swagger_1.default));
        const Server = this.app.listen(PORT, () => {
            this.logger.info(`The server is running on port localhost: ${process.env.PORT}`);
            this.app.use((err, req, res, next) => {
                if (err) {
                    console.log('errr ', err);
                    return res.status(500).json({ message: req.t("ERR_INTERNAL_SERVER"), code: 500, status: false, result: null });
                    // SendEmail.sendRawMail(null, null, [process.env.EXCEPTION_MAIL],
                    //   `ICrowd - API (${NODE_ENV}) - Unhandled Crash`, err.stack); // sending exception email
                    return;
                }
                next();
            });
        });
    }
}
exports.App = App;
//# sourceMappingURL=server.js.map