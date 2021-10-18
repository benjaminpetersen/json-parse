import { IModel } from "./store";
import { get } from "./utils";

export const view = ([prevModel, model]: [IModel, IModel]) => {
  if (prevModel.explorationStack.length > model.explorationStack.length) {
    console.log(
      'key added ->',
      prevModel.explorationStack.join('.'),
      ':',
      get(model.generatedObject, prevModel.explorationStack),
    );
  }
};