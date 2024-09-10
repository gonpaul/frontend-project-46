/**
    * A module for all parsers to separate concerns
*/
import path from 'node:path';
import fs from 'fs';
import yaml from 'js-yaml';

const buildFullPath = (filepath) => path.resolve(process.cwd(), '__fixtures__', filepath);
const customReadFile = (filepath) => {
  const absolutePath = buildFullPath(filepath);
  // console.log(absolutePath);
  const data = fs.readFileSync(absolutePath, 'utf-8');
  return data;
};

/*
export const parseJsonFile = (filepath) => {
    try {
        const data = customReadFile(filepath);
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading or parsing JSON file: ${filepath}`, error);
        return null;
    }
};

export const parseYamlFile = (filepath) => {
    try {
        const data = customReadFile(filepath);
        return yaml.load(data);
    } catch (error) {
        console.error(`Error reading or parsing Yaml file: ${filepath}`, error);
        return null;
    }
};
*/
const parse = {
  json: JSON.parse,
  yaml: yaml.load,
  yml: yaml.load,
}

const parseFile = (filepath, format) => {
  try {
    const fileContent = customReadFile(filepath);
    // const data = yaml.load(fileContent);
    const data = parse[format](fileContent); // dispatch by key
    // console.log(data);
    return data;
  } catch (e) {
    console.error(`Error parsing file ${filepath}:`, e);
    return null;
  }
};

export default parseFile;
