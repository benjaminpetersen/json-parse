import { IModel } from './store';
import { get, lastElement, popOff } from './utils';
import cloneDeep from 'lodash.clonedeep';

const boolRe = /[truefalse]/i;
const numRe = /[0-9\.]/;

const isFinishedBuilding = (building: IModel['building'], char: string) => {
  switch (building) {
    case 'string':
    case 'key':
      return char === '"';
    case 'boolean':
      return !boolRe.exec(char);
    case 'number':
      return !numRe.exec(char);
    default:
      // Never
      return false;
  }
};

const cast = (building: IModel['building'], joinedChars: string) => {
  switch (building) {
    case 'number':
      return Number(joinedChars);
    case 'boolean':
      return joinedChars[0] === 't' ? true : false;
    default:
      return joinedChars;
  }
};

export const update = (char: string, model: IModel): IModel => {
  const lastKey = lastElement(model.explorationStack);
  const upOne = popOff(model.explorationStack);
  const generatedObject = cloneDeep(model.generatedObject);
  const terminus = get(generatedObject, model.explorationStack);

  // If we're accumulating characters of a boolean/number/string/key
  if (model.building !== 'none') {
    if (!isFinishedBuilding(model.building, char))
      return { ...model, chars: [...model.chars, char] };
    else {
      const joinedChars = model.chars.join('');
      if (model.building === 'key')
        return {
          ...model,
          building: 'none',
          chars: [],
          explorationStack: [...model.explorationStack, joinedChars],
        };
      get(generatedObject, upOne)[lastKey] = cast(model.building, joinedChars);
      return {
        ...model,
        building: 'none',
        explorationStack:
          typeof lastKey === 'number' ? [...upOne, lastKey + 1] : upOne,
        chars: [],
        generatedObject,
      };
    }
  }

  switch (char) {
    case '{':
      if (model.explorationStack.length === 0) return model;
      get(generatedObject, upOne)[lastKey] = {};
      return { ...model, generatedObject, numObjects: model.numObjects + 1 };
    case '}':
      return {
        ...model,
        explorationStack:
          typeof lastKey === 'number' ? [...upOne, lastKey + 1] : upOne,
      };
    case '[':
      get(generatedObject, upOne)[lastKey] = [];
      return {
        ...model,
        explorationStack: [...model.explorationStack, 0],
        numArrays: model.numArrays + 1,
        generatedObject,
      };
    case ']':
      return {
        ...model,
        explorationStack: model.explorationStack.slice(
          0,
          model.explorationStack.length - 2, // pull off the index and the key pointing to the array
        ),
      };
    default:
      // If nothing else has matched by this point, we're waiting to start build something;
      if (numRe.exec(char))
        return { ...model, chars: [char], building: 'number' };
      if (boolRe.exec(char))
        return { ...model, chars: [char], building: 'boolean' };
      if (char === '"')
        return {
          ...model,
          chars: [],
          building:
            typeof terminus === 'object' && !Array.isArray(terminus)
              ? 'key'
              : 'string',
        };
      return model;
  }
};
