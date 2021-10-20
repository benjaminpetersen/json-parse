import { IModel } from './store';

export const view = ([prevModel, model]: [IModel, IModel]) => {
  if (prevModel.explorationStack.length > model.explorationStack.length) {
    console.log(
      'key added ->',
      prevModel.explorationStack.join('.'),
      ':',
      model.generatedObject.get(prevModel.explorationStack),
    );
  }
};
