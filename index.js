import parseJsonOrYaml from './parsers.js';
// import _ from 'lodash';
// import { parseJsonFile, parseYamlFile } from './parsers.js';

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
const displayPropertyValue = (value) => {
    if (typeof value === 'object' && value !== null) {
        return JSON.stringify(value, null, 2);
    }
    return value;
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
const findDiffRecursive = (obj1, obj2, depth = 1) => {
    const indent = '  '.repeat(depth);
    const keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
    const diff = [];

    keys.forEach((key) => {
        if (!Object.hasOwn(obj1, key)) {
            diff.push(`${indent}+ ${key}: ${displayPropertyValue(obj2[key])}`);
        } else if (!Object.hasOwn(obj2, key)) {
            diff.push(`${indent}- ${key}: ${displayPropertyValue(obj1[key])}`);
        } else if (!dataStructuresAreEqual(obj1[key], obj2[key])) {
            if (typeof obj1[key] === 'object' && obj1[key] !== null && typeof obj2[key] === 'object' && obj2[key] !== null) {
                diff.push(`${indent}${key}: {`);
                diff.push(findDiffRecursive(obj1[key], obj2[key], depth + 1).join('\n'));
                diff.push(`${indent}}`);
            } else {
                diff.push(`${indent}- ${key}: ${displayPropertyValue(obj1[key])}`);
                diff.push(`${indent}+ ${key}: ${displayPropertyValue(obj2[key])}`);
            }
        } else {
            diff.push(`${indent}  ${key}: ${displayPropertyValue(obj2[key])}`);
        }
    });

    return diff;
};
const diff = (data1, data2) => {
    const sortedKeys = [...Object.keys(data1), ...Object.keys(data2)].sort();
    const result = sortedKeys.reduce((acc, key) => {
        let depth = 1;

        if (Object.hasOwn(data1, key) && !Object.hasOwn(data2, key)) {
            acc.push(`  - ${key}: ${displayPropertyValue(data1[key])}`);
        } else if (!Object.hasOwn(data1, key) && Object.hasOwn(data2, key)) {
            acc.push(`  + ${key}: ${displayPropertyValue(data2[key])}`);
        } else if (!dataStructuresAreEqual(data1[key], data2[key])) {
            if (typeof data1[key] === 'object' && typeof data2[key] === 'object') {
                acc.push(`${key}: {`);
                acc.push(...findDiffRecursive(data1[key], data2[key], depth));
                acc.push('}');
                depth += 1;
            } else {
                acc.push(`  - ${key}: ${displayPropertyValue(data1[key])}`);
                acc.push(`  + ${key}: ${displayPropertyValue(data2[key])}`);
            }
        } else {
            acc.push(`    ${key}: ${displayPropertyValue(data2[key])}`);
        }
        return acc;
    }, []);

    return `{\n${result.join('\n')}\n}`;
};
const genDiff = (path1, path2) => {
    const ext = getExt(path1);
    const parsingFunc = getParsingFunc(ext);
    const data1 = parsingFunc(path1);
    const data2 = parsingFunc(path2);
    if (!data1 || !data2) {
        return null;
    }
    const result = diff(data1, data2);
    console.log(result);
    return result;
};
/*
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
    //new step 7
    const findDiffRecursive = (data) => {
        // this function will be the main which tells what to add and where
        // to stop going down the rabbit whole
        // For primitive data structures it will work as before,
        // but for objects - go recursive
        // It should work this way: receive an object and return a list of
        // compared properties, to get an answer it will go recursive/call itself for each
        // property which value is also an object
        // Possible inputs:
        // object and primitive (-object, +primitive)
        // primitive and primitive (minus plus scheme)
        //
        // object and object (recursive works here)
        // primitive and object (-primitive, +object)
        //
        // exist and don't exist (minus)
        // don't exist and exist (plus)
        return 'recursive difference algorithm'
    };
    */

export default genDiff;
