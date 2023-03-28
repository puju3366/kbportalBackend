import { validate } from "class-validator";

export class Model {
  public static async getModel(model, body, query?): Promise<Model> {
    try {
      const modelInstance = new model(body, query);
      const errors = await validate(modelInstance);
      if (errors.length) {
        throw errors;
      }
      return modelInstance;
    } catch (error) {
      throw error;
    }
  }
}
