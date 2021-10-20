import storeSubject, { IModel } from './store';
import { update } from './update';
import { createReadStream, get } from './utils';
import { view } from './view';
import { defer, repeat } from 'rxjs';
import inquirer from 'inquirer';

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
  let sub = view ? storeSubject.subscribe(view) : undefined;
  const gennedObj = await pr;
  if (sub) sub.unsubscribe();
  return gennedObj.get();
};

if (require.main === module) {
  const processCommand = (cmd: any) => {
    return main({ jsonPath: cmd.value, view });
  };

  const source = defer(() =>
    inquirer.prompt([
      {
        type: 'input',
        name: 'value',
        message: 'Enter a JSON path to parse:',
      },
    ]),
  );

  const example = source.pipe(repeat());

  const subscription = example.subscribe(async cmd => {
    const val = await processCommand(cmd).catch(e =>
      console.error('caught an error', e),
    );
    console.log('done::', val);
  });
  setTimeout(() => subscription.unsubscribe(), 100000);
}
