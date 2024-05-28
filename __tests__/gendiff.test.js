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

const answerStylish = `{
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

const answerPlain = `Property 'common.follow' was added with value: false
Property 'common.setting2' was removed
Property 'common.setting3' was updated. From true to null
Property 'common.setting4' was added with value: 'blah blah'
Property 'common.setting5' was added with value: [complex value]
Property 'common.setting6.doge.wow' was updated. From '' to 'so much'
Property 'common.setting6.ops' was added with value: 'vops'
Property 'group1.baz' was updated. From 'bas' to 'bars'
Property 'group1.nest' was updated. From [complex value] to 'str'
Property 'group2' was removed
Property 'group3' was added with value: [complex value]`;

test('json stylish format test 1', () => {
    expect(gendiff('file1.json', 'file2.json', 'stylish')).toBe(answerStylish);
});

test('yaml stylish format test 2', () => {
    expect(gendiff('file1.yml', 'file2.yml', 'stylish')).toBe(answerStylish);
});

test('json-yaml stylish format test 3', () => {
    expect(gendiff('file1.json', 'file2.yml', 'stylish')).toBe(answerStylish);
});

test('json plain format test 1', () => {
    expect(gendiff('file1.json', 'file2.json', 'plain')).toBe(answerPlain);
});

test('yaml plain format test 2', () => {
    expect(gendiff('file1.yml', 'file2.yml', 'plain')).toBe(answerPlain);
});

test('json-yaml plain format test 3', () => {
    expect(gendiff('file1.json', 'file2.yml', 'plain')).toBe(answerPlain);
});
