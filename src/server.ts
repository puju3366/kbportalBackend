import * as bodyParser from "body-parser"; // pull information from HTML POST (express4)
import * as compression from "compression"; // Compression request and response
import * as dotenv from "dotenv"; // Loads environment variables from a .env
import * as express from "express";
// tslint:disable-next-line: no-var-requires
require("express-async-errors");
import * as helmet from "helmet"; // Security
import * as l10n from "jm-ez-l10n";
import * as methodOverride from "method-override"; // simulate DELETE and PUT (express4)
import * as morgan from "morgan"; // log requests to the console (express4)
import * as path from "path";
import * as trimRequest from "trim-request";
import { Log } from "./helpers/logger";
import { Routes } from "./routes";
// import * as fileUpload from "express-fileupload";
import { DB } from "./database";
import * as multer from 'multer';
import firebaseInit from './firebase';
const swaggerUi = require("swagger-ui-express");

import swaggerDocument from './swagger';
var cron = require('node-cron');
// Loads environment variables from a .env
dotenv.config();
const upload = multer({
  dest: '/tmp/assets',
});
// initialize database
DB.init();
firebaseInit();
export class App {
  public app: express.Application;
  private logger = Log.getLogger();
  constructor() {
    const NODE_ENV = process.env.NODE_ENV;
    const PORT = process.env.PORT as string;
    
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
      } else {
        next();
      }
    });

    if (NODE_ENV === "development") {
      this.app.use(express.static(path.join(process.cwd(), "tmp")));
      // set the static files location of bower_components
      this.app.use(morgan("dev")); // log every request to the console
    } else {
      this.app.use(compression()); // All request compressed
      // set the static files location /tmp/img will be /img for users
      this.app.use(express.static(path.join(process.cwd(), "dist"), { maxAge: "7d" }));
    }

    l10n.setTranslationsFile("en", "src/language/translation.en.json");
    this.app.use(l10n.enableL10NExpress);
    this.app.use(bodyParser.json({ limit: "50mb" }));
    this.app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

    this.app.use(bodyParser.json(), (error: any, req: any, res: any, next: () => void) => {
      if (error) {
        return res.status(400).json({ message: req.t("ERR_GENRIC_SYNTAX"), code: 400, status: false, result : null });
      }
      next();
    });

    this.app.use(bodyParser.json({ type: "application/vnd.api+json" })); // parse application/vnd.api+json as json
    // this.app.use(fileUpload());
    this.app.use(upload.any());
    this.app.use(methodOverride());
    this.app.use(trimRequest.all);
    const routes = new Routes(NODE_ENV);
    this.app.use("/api/v1", routes.path());
    var task = cron.schedule('1 * * * *', () =>  {
      
    }, {
      scheduled: false
    });
    
    task.start();
    this.app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    const Server = this.app.listen(PORT, () => {
      this.logger.info(`The server is running on port localhost: ${process.env.PORT}`);
      this.app.use((err: any, req: any, res: any, next: () => void) => {
        if (err) {
          console.log('errr ', err);
          return res.status(500).json({ message: req.t("ERR_INTERNAL_SERVER"), code: 500, status: false, result : null });
          // SendEmail.sendRawMail(null, null, [process.env.EXCEPTION_MAIL],
          //   `ICrowd - API (${NODE_ENV}) - Unhandled Crash`, err.stack); // sending exception email
          return;
        }
        next();
      });
    });


  }
}
