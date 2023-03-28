"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendEmail = void 0;
const aws = require("aws-sdk");
const fs = require("fs");
const _ = require("lodash");
const nodemailer = require("nodemailer");
const path = require("path");
const logger_1 = require("./logger");
class SendEmail {
}
exports.SendEmail = SendEmail;
SendEmail.logger = logger_1.Log.getLogger();
SendEmail.sendRawMail = (template = null, replaceData = null, emails, subject, text = null, isPersonalEmail = false) => {
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
        transporter.sendMail(mailOptions, (mailSendErr, info) => {
            if (!mailSendErr) {
                SendEmail.logger.info(`Message sent: ${info.response}`);
            }
            else {
                SendEmail.logger.error(`Error in sending email: ${mailSendErr}`);
            }
        });
    }
    catch (error) {
        SendEmail.logger.error(error);
        throw error;
    }
};
// Just reading html file and then returns in string
SendEmail.getHtmlContent = (filePath, replaceData) => {
    const data = fs.readFileSync(filePath);
    let html = data.toString();
    _.keys(replaceData).forEach((key) => {
        html = html.replace(key, replaceData[key]);
    });
    return html;
};
//# sourceMappingURL=sendEmail.js.map