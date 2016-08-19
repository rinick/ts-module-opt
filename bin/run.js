const Fs = require('fs');
const Path = require('path');

let arglen = process.argv.length;

let references = [];

for (let i = 2; i < arglen; ++i) {
    let path = process.argv[i];

    if (path == '-r' || path == '--reference') {
        references.push(process.argv[++i]);
        continue;
    }

    let name = Path.base(path);
    if (!/^\w+$/.test(name) || !Fs.lstatSync(path).isDirectory()) {
        console.warn(`${path} is not a valid module directory`);
        continue;
    }
    let output = Path.resolve(path, name + '.js');

    require('./generate_index');

    let command = `tsc --noImplicitAny true --target es6 --sourceMap false --module system --outFile ${output} ${references.join(" ")} path`;
    require('child_process').exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(error);
            return;
        }
        require('./optimize_module').optimize_module(output, name);
    });
}




