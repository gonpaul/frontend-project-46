// import path from 'path';
// import { fileURLToPath } from 'url';
import gendiff from '../index.js';

/*
// Convert import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to get the full path of the file
const buildFullPath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
// console.log(buildFullPath('file1.json'));
*/

const answer = `
{
    common: {
      + follow: false
        setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: null
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
        setting6: {
            doge: {
              - wow: 
              + wow: so much
            }
            key: value
          + ops: vops
        }
    }
    group1: {
      - baz: bas
      + baz: bars
        foo: bar
      - nest: {
            key: value
        }
      + nest: str
    }
  - group2: {
        abc: 12345
        deep: {
            id: 45
        }
    }
  + group3: {
        deep: {
            id: {
                number: 45
            }
        }
        fee: 100500
    }
}`;

test('json format test 1', () => {
    expect(gendiff('file1.json', 'file2.json')).toBe(answer);
});

test('yaml format test 2', () => {
    expect(gendiff('file1.yml', 'file2.yml')).toBe(answer);
});
