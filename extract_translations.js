const fs = require('fs');
const path = require('path');

function findTsxFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            findTsxFiles(filePath, fileList);
        } else if (filePath.endsWith('.tsx')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const files = findTsxFiles('./src');
const keys = {};

const regex = /t\(['"]([^'"]+)['"](?:,\s*['"]([^'"]+)['"])?/g;

for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    let match;
    while ((match = regex.exec(content)) !== null) {
        const key = match[1];
        const fallback = match[2] || '';
        keys[key] = fallback;
    }
}

console.log(JSON.stringify(keys, null, 2));
