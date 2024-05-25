import gendiff from '../index.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Convert import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to get the full path of the file
const buildFullPath = (filename) => {
    return path.join(__dirname, '..', '__fixtures__', filename);
};
// console.log(buildFullPath('file1.json'));

test('json format test 1', () => {
    const answer = [
        '{',
        ' - follow: false',
        '   host: hexlet.io',
        ' - proxy: 123.234.53.22',
        ' - timeout: 50',
        ' + timeout: 20',
        ' + verbose: true',
        '}'
    ].join('\n');
    const path1 = buildFullPath('file1.json');
    const path2 = buildFullPath('file2.json');
    expect(gendiff(path1, path2)).toBe(answer);
});
