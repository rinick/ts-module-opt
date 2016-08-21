const Fs = require('fs');
const Path = require('path');

const generate_index = require('./generate_index').generate_index;
const optimize_module = require('./optimize_module').optimize_module;

let arglen = process.argv.length;

let references = [];

for (let i = 2; i < arglen; ++i) {
    let path = process.argv[i];

    if (path == '-r' || path == '--reference') {
        references.push(process.argv[++i]);
        continue;
    }

    if (!Fs.lstatSync(path).isDirectory()) {
        console.warn(`${path} is not a directory`);
        continue;
    }

    let name = generate_index(path);

    let input = Path.resolve(path, name + '.ts');
    let output = Path.resolve(path, name + '.js');

    let command = `tsc --noImplicitAny --target es6 --module system --outFile ${output} ${references.join(" ")} ${input}`;
    require('child_process').exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(error);
            return;
        }
        optimize_module(output, name);
    });
}




