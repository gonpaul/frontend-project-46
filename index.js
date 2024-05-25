import path from 'node:path';
import fs from 'fs';
import _ from 'lodash';

const buildFullPath = (filepath) => path.resolve(process.cwd(), filepath);

const readJsonFile = (filepath) => {
    try {
        const absolutePath = buildFullPath(filepath);
        const data = fs.readFileSync(absolutePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading or parsing file: ${filepath}`, error);
        return null;
    }
};

const genDiff = (path1, path2) => {
    const data1 = readJsonFile(path1);
    const data2 = readJsonFile(path2);

    if (!data1 || !data2) {
        return;
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
    }, []);

    console.log(diff);
};

export default genDiff;
