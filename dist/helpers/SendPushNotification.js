"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendPushNotification = void 0;
const logger_1 = require("./logger");
const admin = require("firebase-admin");
class SendPushNotification {
    static sendPushNotificationFirebase(token, message) {
        admin.messaging().sendToDevice(token, message)
            .then(response => {
            SendPushNotification.logger.info(`Message sent: ${JSON.stringify(response)}`);
        })
            .catch(err => {
            SendPushNotification.logger.error(`Error in sending push notification: ${err} and token: , message: ${message}`);
        });
    }
}
exports.SendPushNotification = SendPushNotification;
SendPushNotification.logger = logger_1.Log.getLogger();
//# sourceMappingURL=SendPushNotification.js.map