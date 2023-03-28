import { Log } from "./logger";
import * as admin from "firebase-admin";
import { ResponseBuilder } from "./responseBuilder";

export class SendPushNotification {
    private static logger: any = Log.getLogger();

    public static sendPushNotificationFirebase(token,message) {
        admin.messaging().sendToDevice(token,message)
            .then(response => {
                SendPushNotification.logger.info(`Message sent: ${JSON.stringify(response)}`);
            })
            .catch(err => {
                SendPushNotification.logger.error(`Error in sending push notification: ${err} and token: , message: ${message}`);
            });
    }
}