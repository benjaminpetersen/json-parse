import { BehaviorSubject } from 'rxjs';
export type ExplorationStack = (string | number)[]; // numbers for array indices
export type IModel = {
  // A lodash style key array -> ['key','array', '0', 'nestedArrayKey'];
  numArrays: number;
  numObjects: number;
  explorationStack: ExplorationStack;
  chars: string[];
  generatedObject: any;
  building: 'key' | 'string' | 'number' | 'boolean' | 'none';
};

let initialModel: IModel = {
  numArrays: 0,
  numObjects: 0,
  building: 'none',
  generatedObject: {},
  explorationStack: [],
  chars: [],
};

export default new BehaviorSubject<[IModel, IModel]>([
  initialModel,
  initialModel,
]);
