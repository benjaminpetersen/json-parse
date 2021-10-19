import { BehaviorSubject } from 'rxjs';
import { get, lastElement, popOff } from './utils';
import clonedeep from 'lodash.clonedeep';
export type ExplorationStack = (string | number)[]; // numbers for array indices

class GeneratedObject {
  object: any;
  constructor(obj: any) {
    this.object = obj;
  }
  updateValue(keyStack: ExplorationStack, value: any) {
    const upOne = popOff(keyStack);
    const lastKey = lastElement(keyStack);
    this.object = clonedeep(this.object);
    get(this.object, upOne)[lastKey] = value;
    return this;
  }
  get(keyStack: ExplorationStack = []) {
    return get(clonedeep(this.object), keyStack);
  }
}

export type IModel = {
  // A lodash style key array -> ['key','array', '0', 'nestedArrayKey'];
  numArrays: number;
  numObjects: number;
  explorationStack: ExplorationStack;
  chars: string[];
  generatedObject: GeneratedObject;
  building: 'key' | 'string' | 'number' | 'boolean' | 'none';
};

let initialModel: IModel = {
  numArrays: 0,
  numObjects: 0,
  building: 'none',
  generatedObject: new GeneratedObject({}),
  explorationStack: [],
  chars: [],
};

export default new BehaviorSubject<[IModel, IModel]>([
  initialModel,
  initialModel,
]);
