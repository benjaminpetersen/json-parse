import { IModel } from './store';
import { get, lastElement, popOff } from './utils';
import cloneDeep from 'lodash.clonedeep';

const boolRe = /[truefalse]/i;
const numRe = /[0-9\.]/;

export const update = (char: string, model: IModel): IModel => {
  const lastKey = lastElement(model.explorationStack);
  const upOne = popOff(model.explorationStack);
  const generatedObject = cloneDeep(model.generatedObject);
  if (model.qouteCount % 2 === 1 && char !== '"')
    return { ...model, chars: [...model.chars, char] };
  switch (char) {
    case '{':
      if (lastKey !== undefined) get(generatedObject, upOne)[lastKey] = {};
      return { ...model, curlyOpen: ++model.curlyOpen, generatedObject };
    case '}':
      return {
        ...model,
        curlyClose: ++model.curlyClose,
        explorationStack:
          typeof lastKey === 'number' ? [...upOne, lastKey + 1] : upOne,
        generatedObject,
      };
    case '[':
      get(generatedObject, upOne)[lastKey] = [];
      return {
        ...model,
        squareOpen: ++model.squareOpen,
        explorationStack: [...model.explorationStack, 0],
        generatedObject,
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
          generatedObject,
        };
      }
      get(generatedObject, upOne)[lastKey] = word;
      return { ..._model, explorationStack: upOne, generatedObject };
    default:
      if (model.building === 'none' && numRe.exec(char))
        return { ...model, chars: [char], building: 'number' };
      else if (model.building === 'none' && boolRe.exec(char))
        return { ...model, chars: [char], building: 'boolean' };
      else if (
        ['number', 'boolean'].includes(model.building) &&
        (numRe.exec(char) || boolRe.exec(char))
      )
        return { ...model, chars: [...model.chars, char] };
      else if (model.building === 'number' && !numRe.exec(char)) {
        const num = Number(model.chars.join(''));
        get(generatedObject, upOne)[lastKey] = num;
        return {
          ...model,
          building: 'none',
          explorationStack: upOne,
          generatedObject,
        };
      } else if (model.building === 'boolean' && !boolRe.exec(char)) {
        const bool = model.chars[0] === 't' ? true : false;
        get(generatedObject, upOne)[lastKey] = bool;
        return {
          ...model,
          building: 'none',
          explorationStack: upOne,
          generatedObject,
        };
      }
      return model;
  }
};
