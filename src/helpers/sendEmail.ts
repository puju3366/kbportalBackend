import * as aws from "aws-sdk";
import * as fs from "fs";
import * as _ from "lodash";
import * as nodemailer from "nodemailer";
import * as path from "path";
import { Log } from "./logger";
export class SendEmail {
    private static logger: any = Log.getLogger();
    public static sendRawMail = (
        template: string = null, replaceData: any = null, emails: string[], subject: string, text: string = null,
        isPersonalEmail: boolean = false) => {
        try {
            let html = "";
            if (template) {
                // send email for verification
                const templatesDir = path.resolve(`${__dirname}/../`, "templates");
                const content = `${templatesDir}/${template}.html`;
                html = SendEmail.getHtmlContent(content, replaceData);
            }
            const mailOptions = {
                from: process.env.DEFAULT_FROM,
                html,
                replyTo: process.env.DEFAULT_REPLY_TO,
                subject,
                to: !isPersonalEmail ? replaceData.kb_approved_by : [],
                bcc: isPersonalEmail ? emails : [],

                text,
                
            };
            let transportObj = {
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                auth: {
                    user: process.env.SMTP_USER_NAME,
                    pass: process.env.SMTP_PASSWORD,
                },
                tls: {
                    rejectUnauthorized: false
                },
                secure: false,
            };
            
            const envChecks = process.env.ENV_CHECKS_FOR_MAIL_AND_SMS.split(",");
            if (envChecks.includes(process.env.NODE_ENV)) {
                aws.config.update({ region: process.env.AWS_REGION });
            }
            const transporter = nodemailer.createTransport(transportObj);
            transporter.sendMail(mailOptions, (mailSendErr: any, info: any) => {
                if (!mailSendErr) {
                    SendEmail.logger.info(`Message sent: ${info.response}`);
                } else {
                    SendEmail.logger.error(`Error in sending email: ${mailSendErr}`);
                }
            });
        } catch (error) {
            SendEmail.logger.error(error);
            throw error;
        }
    }
    // Just reading html file and then returns in string
    private static getHtmlContent = (filePath: string, replaceData: any) => {
        const data = fs.readFileSync(filePath);
        let html = data.toString();
        _.keys(replaceData).forEach((key) => {
            html = html.replace(key, replaceData[key]);
        });
        return html;
    }
}