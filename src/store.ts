import { BehaviorSubject } from 'rxjs';
export type ExplorationStack = (string | number)[]; // numbers for array indices
export type IModel = {
  squareOpen: number;
  squareClose: number;
  curlyOpen: number;
  curlyClose: number;
  qouteCount: number;
  // lodash style key array -> ['key','array', '0', 'nestedArrayKey'];
  explorationStack: ExplorationStack;
  chars: string[];
  // Mutable built object... bad practice
  generatedObject: any;
  building: 'string' | 'number' | 'boolean' | 'none';
};

let initialModel: IModel = {
  building: 'none',
  squareOpen: 0,
  squareClose: 0,
  curlyOpen: 0,
  curlyClose: 0,
  qouteCount: 0,
  generatedObject: {},
  explorationStack: [],
  chars: [],
};

export default new BehaviorSubject<[IModel, IModel]>([
  initialModel,
  initialModel,
]);
