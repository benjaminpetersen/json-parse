import storeSubject, { IModel } from './store';
import { update } from './update';
import { createReadStream, get } from './utils';
import { view } from './view';

export const main = async ({
  view,
  jsonPath,
}: {
  view?: (args: [IModel, IModel]) => void;
  jsonPath: string;
}) => {
  const pr = new Promise<IModel['generatedObject']>((res, rej) => {
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
    rs.on('close', () => {
      const [_, model] = storeSubject.getValue();
      res(model.generatedObject);
    });
  });
  if (view) storeSubject.subscribe(view);
  const gennedObj = await pr;
  return gennedObj.get();
};

if (require.main === module) {
  const jsonPath = process.argv[2];
  if (jsonPath === undefined)
    throw new Error(
      'Please specify the path to a JSON file after "node index.js"',
    );
  main({ view, jsonPath })
    .then(() => console.log('DONE PARSING'))
    .catch(console.error);
}
