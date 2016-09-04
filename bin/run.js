"use strict";
const Fs = require('fs');
const Path = require('path');
const Generate = require('./generate');
const Optimize = require('./optimize');
let argLen = process.argv.length;
let references = [];
let tscTarget = 'es6';
let declaration = '';
let sourceMap = '';
for (let i = 2; i < argLen; ++i) {
    let path = process.argv[i];
    if (path === '-r' || path === '--reference') {
        references.push(process.argv[++i]);
        continue;
    }
    if (path === '-t' || path === '--target') {
        tscTarget = process.argv[++i];
        continue;
    }
    if (path === '-d' || path === '--declaration') {
        declaration = '--declaration';
        continue;
    }
    if (path === '--sourceMap') {
        sourceMap = '--sourceMap';
        continue;
    }
    if (!Fs.lstatSync(path).isDirectory()) {
        console.warn(`${path} is not a directory`);
        continue;
    }
    let name = Generate.generate_index(path);
    let input = Path.resolve(path, name + '.ts');
    let output = Path.resolve(path, name + '.js');
    let dOutput = Path.resolve(path, name + '.d.ts');
    let command = `node node_modules/typescript/lib/tsc.js --noImplicitAny ${declaration} ${sourceMap} --target ${tscTarget} --module system --outFile ${output} ${references.join(" ")} ${input}`;
    require('child_process').exec(command, function (error, stdout, stderr) {
        if (error) {
            console.log(stdout);
            console.error(error);
            return;
        }
        Optimize.optimize_module(output, name);
        if (declaration) {
            Optimize.optimize_declaration(dOutput, name);
        }
    });
}
