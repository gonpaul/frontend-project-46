/**
    * A module for all parsers to separate concerns
*/
import path from 'node:path';
import fs from 'fs';
import yaml from 'js-yaml';

const buildFullPath = (filepath) => path.resolve(process.cwd(), '__fixtures__', filepath);

export const parseJsonFile = (filepath) => {
    try {
        const absolutePath = buildFullPath(filepath);
        // console.log(absolutePath);
        const data = fs.readFileSync(absolutePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading or parsing JSON file: ${filepath}`, error);
        return null;
    }
};

export const parseYamlFile = (filepath) => {
    try {
        const absolutePath = buildFullPath(filepath);
        // console.log(absolutePath);
        const data = fs.readFileSync(absolutePath, 'utf-8');
        return yaml.load(data);
    } catch (error) {
        console.error(`Error reading or parsing Yaml file: ${filepath}`, error);
        return null;
    }
};
