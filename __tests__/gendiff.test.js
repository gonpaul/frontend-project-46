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

const answer = [
    '{',
    ' - follow: false',
    '   host: hexlet.io',
    ' - proxy: 123.234.53.22',
    ' - timeout: 50',
    ' + timeout: 20',
    ' + verbose: true',
    '}',
].join('\n');

test('json format test 1', () => {
    expect(gendiff('file1.json', 'file2.json')).toBe(answer);
});

test('yaml format test 2', () => {
    expect(gendiff('file1.yml', 'file2.yml')).toBe(answer);
});
