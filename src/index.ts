import storeSubject, { IModel } from './store';
import { update } from './update';
import { createReadStream, get } from './utils';
const jsonPath = process.argv[2];
if (jsonPath === undefined)
  throw new Error(
    'Please specify the path to a JSON file after "node index.js"',
  );
new Promise(async (res, rej) => {
  const rs = createReadStream(jsonPath);
  rs.on('error', rej);
  rs.on('data', d => {
    if (typeof d === 'string') {
      for (let char of d) {
        const [_, model] = storeSubject.getValue();
        storeSubject.next([model, update(char, model)]);
      }
    } else {
      for (let char of d) {
        const [_, model] = storeSubject.getValue();
        storeSubject.next([model, update(String.fromCharCode(char), model)]);
      }
    }
  });
  rs.on('close', res);
})
  .then(() => {
    // const [_, m] = storeSubject.getValue();
    // console.log('done', m);
  })
  .catch(console.error);

// let count = 0;
const view = ([prevModel, model]: [IModel, IModel]) => {
  if (prevModel.explorationStack.length > model.explorationStack.length) {
    console.log(
      'key added ->',
      prevModel.explorationStack.join('.'),
      ':',
      get(model.generatedObject, prevModel.explorationStack),
    );
  }
};

storeSubject.subscribe(view);
