const indentSize = 4;

const formatValue = (value, depth) => {
  if (typeof value !== 'object' || value === null) {
    return value;
  }
  const indent = ' '.repeat(depth * indentSize);
  const lines = Object.entries(value).map(
    ([key, val]) => `${indent}${key}: ${formatValue(val, depth + 1)}`,
  );
  return `{\n${lines.join('\n')}\n${' '.repeat((depth - 1) * indentSize)}}`;
};

const stylishFormatter = (diff, depth = 1) => {
  const indent = ' '.repeat(depth * indentSize - 2);
  const lines = diff.map((item) => {
    switch (item.type) {
    case 'added':
      return `${indent}+ ${item.key}: ${formatValue(item.value, depth + 1)}`;
    case 'removed':
      return `${indent}- ${item.key}: ${formatValue(item.value, depth + 1)}`;
    case 'changed':
      return [
        `${indent}- ${item.key}: ${formatValue(item.oldValue, depth + 1)}`,
        `${indent}+ ${item.key}: ${formatValue(item.newValue, depth + 1)}`,
      ].join('\n');
    case 'unchanged':
      return `${indent}  ${item.key}: ${formatValue(item.value, depth + 1)}`;
    case 'nested':
      return `${indent}  ${item.key}: {\n${stylishFormatter(item.children, depth + 1)}\n${' '.repeat(depth * indentSize)}}`;
    default:
      throw new Error(`Unknown type: ${item.type}`);
    }
  });
  const result = lines.join('\n');
  if (depth === 1) {
    return `{\n${result}\n}`;
  }
  return result;
};

export default stylishFormatter;
