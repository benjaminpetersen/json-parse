import fs from 'fs';
import { ExplorationStack } from './store';

export const createReadStream = (path: string) => {
  console.log('Running JSON.parse on ' + path);
  return fs.createReadStream(path, 'utf-8');
};

export const get = (obj: any, explorationStack: ExplorationStack) =>
  explorationStack.reduce((val, key) => val[key], obj);

export const lastElement = (a: any[]) => a[a.length - 1];

export const popOff = (a: any[]) => a.slice(0, a.length - 1);
