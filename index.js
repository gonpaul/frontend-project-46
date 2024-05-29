import _ from 'lodash';
import parseJsonOrYaml from './parsers.js';
import plainFormatter from './formatters/plainFormatter.js';
import stylishFormatter from './formatters/stylishFormatter.js';
import jsonFormatter from './formatters/jsonFormatter.js';

const getExt = (path) => path.trim().split('.').pop();

const getParsingFunc = (ext) => {
    switch (ext) {
    case 'yaml':
    case 'yml':
    case 'json':
        return parseJsonOrYaml;
    default:
        throw new Error(`There is no parsing function implemented for your format: ${ext}`);
    }
};

const getFormatter = (option) => {
    switch (option.toLowerCase()) {
    case 'stylish':
        return stylishFormatter;
    case 'plain':
        return plainFormatter;
    case 'json':
        return jsonFormatter;
    default:
        throw new Error(`The formatter ${option} does not exist. Try running gendiff -h to see docs`);
    }
};

const dataStructuresAreEqual = (value1, value2) => {
    if (typeof value1 !== typeof value2) {
        return false;
    }
    if (typeof value1 === 'object' && value1 !== null && value2 !== null) {
        return JSON.stringify(value1) === JSON.stringify(value2);
    }
    return value1 === value2;
};

const generateDiff = (obj1, obj2) => {
    const keys = _.union(Object.keys(obj1), Object.keys(obj2)).sort();
    return keys.map((key) => {
        if (!Object.prototype.hasOwnProperty.call(obj1, key)) {
            return { key, type: 'added', value: obj2[key] };
        }
        if (!Object.prototype.hasOwnProperty.call(obj2, key)) {
            return { key, type: 'removed', value: obj1[key] };
        }
        if (!dataStructuresAreEqual(obj1[key], obj2[key])) {
            if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
                return { key, type: 'nested', children: generateDiff(obj1[key], obj2[key]) };
            }
            return {
                key, type: 'changed', oldValue: obj1[key], newValue: obj2[key],
            };
        }
        return { key, type: 'unchanged', value: obj2[key] };
    });
};

const genDiff = (path1, path2, format = 'stylish') => {
    const formatFunc = getFormatter(format);

    const ext1 = getExt(path1);
    const parsingFunc = getParsingFunc(ext1);

    const data1 = parsingFunc(path1);
    const data2 = parsingFunc(path2);

    const diff = generateDiff(data1, data2);
    // console.log(diff);
    const formattedDiff = formatFunc(diff);
    console.log(formattedDiff);
    return formattedDiff;
};

export default genDiff;
