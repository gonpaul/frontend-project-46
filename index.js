import _ from 'lodash';
import { parseJsonFile, parseYamlFile } from './parsers.js';

const getExt = (path) => path.trim().split('.').pop();
const getParsingFunc = (ext) => {
    switch (ext) {
    case 'yaml':
    case 'yml':
        return parseYamlFile;
    case 'json':
        return parseJsonFile;
    default:
        throw new Error(`There is no parsing function implemented for your format: ${ext}`);
    }
};
const genDiff = (path1, path2) => {
    const ext = getExt(path1);
    const parsingFunc = getParsingFunc(ext);
    const data1 = parsingFunc(path1);
    const data2 = parsingFunc(path2);
    if (!data1 || !data2) {
        return null;
    }

    const keys1 = Object.keys(data1);
    const keys2 = Object.keys(data2);
    const sortedKeys = _.union(keys1, keys2).sort();
    //    console.log(sortedKeys);

    const diff = sortedKeys.reduce((acc, key) => {
        if (Object.hasOwn(data1, key) && !Object.hasOwn(data2, key)) {
            acc.push(` - ${key}: ${data1[key]}`);
        } else if (!Object.hasOwn(data1, key) && Object.hasOwn(data2, key)) {
            acc.push(` + ${key}: ${data2[key]}`);
        } else if (data1[key] !== data2[key]) {
            acc.push(` - ${key}: ${data1[key]}`);
            acc.push(` + ${key}: ${data2[key]}`);
        } else {
            acc.push(`   ${key}: ${data1[key]}`);
        }
        return acc;
    }, ['{']);
    diff.push('}');
    const result = diff.join('\n');
    console.log(result);
    return result;
};

export default genDiff;
