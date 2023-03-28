
import { createLogger, format, transports } from "winston";
import { Constants } from "../config/constants";


export class TermsCondition {

    public static gettermsAndCondition() {
        const data = `<html>
                       <body>
                          <h1>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</h1>
                        </body>
                      </html>`
        return data;
    }

    public static getPrivacyPolicy() {
        const data = `<html>
                       <body>
                          <h1>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</h1>
                        </body>
                      </html>`
        return data;
    }
}
