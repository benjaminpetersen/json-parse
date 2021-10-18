import { IModel } from './store';
import { get, lastElement, popOff } from './utils';

export const update = (char: string, model: IModel): IModel => {
  const lastKey = lastElement(model.explorationStack);
  const upOne = popOff(model.explorationStack);
  const { generatedObject } = model;
  if (model.qouteCount % 2 === 1 && char !== '"')
    return { ...model, chars: [...model.chars, char] };
  switch (char) {
    case '{':
      if (lastKey !== undefined) get(generatedObject, upOne)[lastKey] = {};
      return { ...model, curlyOpen: ++model.curlyOpen };
    case '}':
      return {
        ...model,
        curlyClose: ++model.curlyClose,
        explorationStack:
          typeof lastKey === 'number' ? [...upOne, lastKey + 1] : upOne,
      };
    case '[':
      get(generatedObject, upOne)[lastKey] = [];
      return {
        ...model,
        squareOpen: ++model.squareOpen,
        explorationStack: [...model.explorationStack, 0],
      };
    case ']':
      return {
        ...model,
        squareClose: ++model.squareClose,
        explorationStack: model.explorationStack.slice(
          0,
          model.explorationStack.length - 2,
        ), // pull off the number and the key pointing to the array
      };
    case '"':
      const qouteCount = model.qouteCount + 1;
      if (qouteCount % 2 === 1)
        return { ...model, building: 'string', chars: [], qouteCount };
      const _model: IModel = {
        ...model,
        qouteCount,
        chars: [],
        building: 'none',
      };
      // When completing a word, if the current exploration stack ends in an object, add this to the stack as a new key, if it ends with a string, add this as a value.
      const word = model.chars.join('');
      const terminus = get(generatedObject, model.explorationStack);
      if (typeof terminus === 'object')
        return {
          ..._model,
          explorationStack: [...model.explorationStack, word],
        };
      else if (typeof lastKey === 'number') {
        get(generatedObject, upOne).push(word);
        return {
          ..._model,
          explorationStack: [...upOne, lastKey + 1],
        };
      }
      get(generatedObject, upOne)[lastKey] = word;
      return { ..._model, explorationStack: upOne };
    default:
      if (model.building === 'none') {
        if (/\d/.exec(char))
          return { ...model, chars: [char], building: 'number' };
        if (char === 't' || char === 'f')
          return { ...model, chars: [char], building: 'boolean' };
      }
      if (['number', 'boolean'].includes(model.building)) {
        if (/[truefalse0-9\.]/.exec(char))
          return { ...model, chars: [...model.chars, char] };
        // Done building these types:
        if (model.building === 'number') {
          const num = Number(model.chars.join(''));
          get(model.generatedObject, upOne)[lastKey] = num;
          return { ...model, building: 'none', explorationStack: upOne };
        }
        if (model.building === 'boolean') {
          const bool = model.chars[0] === 't' ? true : false;
          get(model.generatedObject, upOne)[lastKey] = bool;
          return { ...model, building: 'none', explorationStack: upOne };
        }
      }
      return model;
  }
};
