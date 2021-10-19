import { main } from '../index';
import testJSON from '../assets/test.json';
// import lottieFile from '../assets/lottie-file.json';

describe('Parse an object correctly', () => {
  it('Should read test.json', () => {
    return main({
      jsonPath: __dirname + '/../assets/test.json',
      view: ([prevState, state]) => {
        if (
          prevState.numArrays !== state.numArrays ||
          prevState.numObjects !== state.numObjects
        )
          console.log(
            `Objects: ${state.numObjects},\nArrays: ${state.numArrays}\n\n`,
          );
      },
    }).then(parsedObj => {
      expect(parsedObj).toStrictEqual(testJSON);
    });
  });
  //  Something isn't working with this test just yet.
  //   it('Should read the lottie file', () => {
  //     return main({ jsonPath: __dirname + '/../assets/lottie-file.json' }).then(
  //       parsedObj => {
  //         expect(parsedObj).toStrictEqual(lottieFile);
  //       },
  //     );
  //   });
});
