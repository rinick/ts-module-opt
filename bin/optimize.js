"use strict";
const Fs = require("fs");
function optimize_module(path, moduleName) {
    // merge modules to single scope
    let search = new RegExp(`\\}\\)\\(${moduleName} \\|\\| \\(${moduleName} = \\{\\}\\)\\);\\r?\\nvar ${moduleName};\\r?\\n\\(function \\(${moduleName}\\) \\{`, 'g');
    let rows = Fs.readFileSync(path, 'utf8').replace(search, '\n\n').split('\n');
    let breezeReg = new RegExp(`\\b${moduleName}\\.`, 'g');
    let exportReg = new RegExp(`\\b${moduleName}\\.(\\w+) = (\\w+);`);
    for (let i in rows) {
        let row = rows[i];
        if (row.includes(moduleName)) {
            let m = row.match(exportReg);
            if (m && m[1] === m[2])
                continue;
            rows[i] = row.replace(breezeReg, '');
        }
    }
    rows.push(`
if (typeof module !== 'undefined' && module.exports) {
    module.exports =  ${moduleName};
}
`);
    Fs.writeFileSync(path, rows.join('\n'));
}
exports.optimize_module = optimize_module;
function optimize_declaration(path, moduleName) {
    // merge declaration to single scope
    let search = new RegExp(`\\}\\r?\\ndeclare module ${moduleName} \\{`, 'g');
    let result = Fs.readFileSync(path, 'utf8').replace(search, '\n');
    Fs.writeFileSync(path, result);
}
exports.optimize_declaration = optimize_declaration;
