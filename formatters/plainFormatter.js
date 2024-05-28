const formatValue = (value) => {
    if (typeof value === 'string') {
        return `'${value}'`;
    }
    if (typeof value !== 'object' || value === null) {
        return value;
    }
    return '[complex value]';
};

const plainFormatter = (diff, path = []) => {
    const lines = diff.map((item) => {
        const currentPath = [...path, item.key].join('.');
        switch (item.type) {
        case 'added':
            return `Property '${currentPath}' was added with value: ${formatValue(item.value)}`;
        case 'removed':
            return `Property '${currentPath}' was removed`;
        case 'changed':
            return `Property '${currentPath}' was updated. From ${formatValue(item.oldValue)} to ${formatValue(item.newValue)}`;
        case 'nested':
            return plainFormatter(item.children, [...path, item.key]);
        case 'unchanged':
            return null;
        default:
            throw new Error(`Unknown type: ${item.type}`);
        }
    }).filter(Boolean);
    return lines.join('\n');
};

export default plainFormatter;
