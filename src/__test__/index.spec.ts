import {main} from '../index';
import testJSON from '../assets/test.json';
import lottieFile from '../assets/lottie-file.json'
import { parse } from 'path/posix';

describe('Parse an object correctly', () => {
    it("Should read test.json", () => {
        return main(()=>{/**Do nothing */},__dirname + '/../assets/test.json').then(parsedObj=>{
            expect(parsedObj).toStrictEqual(testJSON)
        })
    });
    it("Should read the lottie file", ()=>{
        return main(()=>{/**Do nothing */},__dirname + '/../assets/lottie-file.json').then(parsedObj=>{
            expect(parsedObj).toStrictEqual(lottieFile)
        })
    })
})
