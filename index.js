import parseJsonOrYaml from './parsers.js';

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
const displayPropertyValue = (value, depth = 1) => {
    const indent = '    '.repeat(depth);
    if (typeof value === 'object' && value !== null) {
        const jsonString = JSON.stringify(value, null, 4);
        const lines = jsonString.split('\n');
        const formattedLines = lines.map((line, index) => {
            if (index === 0) {
                return line;
            }
            return `${indent}${line}`;
        });
        return formattedLines.join('\n').replace(/"/g, '').replace(/,/g, '');
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
    const indentPlus = ' '.repeat(depth*4-2) + '+ ';
    const indentMinus = ' '.repeat(depth*4-2) + '- ';
    const indent= ' '.repeat(depth*4);
    const keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
    const diff = [];

    keys.forEach((key) => {
        if (!Object.prototype.hasOwnProperty.call(obj1, key)) {
            diff.push(`${indentPlus}${key}: ${displayPropertyValue(obj2[key], depth)}`);
        } else if (!Object.prototype.hasOwnProperty.call(obj2, key)) {
            diff.push(`${indentMinus}${key}: ${displayPropertyValue(obj1[key]), depth}`);
        } else if (!dataStructuresAreEqual(obj1[key], obj2[key])) {
            if (typeof obj1[key] === 'object' && obj1[key] !== null && typeof obj2[key] === 'object' && obj2[key] !== null) {
                diff.push(`${indent}${key}: {`);
                diff.push(findDiffRecursive(obj1[key], obj2[key], depth + 1).join('\n'));
                diff.push(`${indent}}`);
            } else {
                diff.push(`${indentMinus}${key}: ${displayPropertyValue(obj1[key], depth)}`);
                diff.push(`${indentPlus}${key}: ${displayPropertyValue(obj2[key], depth)}`);
            }
        } else {
            diff.push(`${indent}${key}: ${displayPropertyValue(obj2[key], depth)}`);
        }
    });

    return diff;
};

const diff = (data1, data2) => {
    const sortedKeys = [...new Set([...Object.keys(data1), ...Object.keys(data2)])].sort();
    const result = sortedKeys.reduce((acc, key) => {
        if (Object.prototype.hasOwnProperty.call(data1, key) && !Object.prototype.hasOwnProperty.call(data2, key)) {
            acc.push(`  - ${key}: ${displayPropertyValue(data1[key])}`);
        } else if (!Object.prototype.hasOwnProperty.call(data1, key) && Object.prototype.hasOwnProperty.call(data2, key)) {
            acc.push(`  + ${key}: ${displayPropertyValue(data2[key])}`);
        } else if (!dataStructuresAreEqual(data1[key], data2[key])) {
            if (typeof data1[key] === 'object' && typeof data2[key] === 'object') {
                acc.push(`    ${key}: {`);
                acc.push(...findDiffRecursive(data1[key], data2[key], 2));
                acc.push('    }');
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

export default genDiff;
