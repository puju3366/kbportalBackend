import * as request from "request";

export class MediaServer {
  public static upload(file: any, type: string, fileName?: string, mimetype?: string) {
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

      request(options, async (error: any, response: any, body: any) => {
        if (response) {
          resolve({
            statusCode: response.statusCode,
            data: response.body,
          });
        } else {
          reject(error);
        }
      });
    });
  }
}
