"use strict";

const Fs = require('fs');
const Path = require('path');

let srcPath = Path.resolve(__dirname, '../src');

let outputs = [];
function readTs(folder, file) {

}

let reg0 = /extends ([A-Z]\w+)/g;
let reg1 = /implements (([A-Z]\w+[, ]+)+)/g;
let reg2 = /= ([A-Z]\w+)\./g;

let reg3 = /export (class|interface) ([A-Z]\w+)/g;

function analyzeFile(folder, foldername, file, dict, classes) {
    let name = file.substr(0, file.length - 3);
    let data = Fs.readFileSync(folder + '/' + file, 'utf8');
    let deps = new Set();
    let myclass = new Set();
    data.replace(reg0, function (m, m1) {
        // find extends
        deps.add(m1);
    });
    data.replace(reg1, function (m, m1) {
        // find implements
        for (let m2 of m1.split(','))
            deps.add(m2.trim());
    });
    data.replace(reg2, function (m, m1) {
        // find assignment
        deps.add(m1);
    });

    data.replace(reg3, function (m, m1, m2) {
        // find export class
        classes.add(m2);
        myclass.add(m2);
    });
    for (let c of myclass) {
        deps.delete(c);
    }

    dict[name] = {
        'file': file,
        'ref': foldername + file,
        'deps': Array.from(deps),
        'classes': Array.from(myclass)
    };
}

let dict = {};
let classes = new Set();

function readFolder(folder, foldername) {
    let subfolders = [];
    for (let str of Fs.readdirSync(folder)) {
        if (str.endsWith('.ts')) {
            analyzeFile(folder, foldername, str, dict, classes);
        } else if (!str.includes('.')) {
            subfolders.push(str);
        }
    }

    for (let str of subfolders) {
        readFolder(folder + '/' + str, foldername + str + '/');
    }
}

function resolve() {
    // find the correct order of modules
    while (true) {
        let found = false;
        let keys = Object.getOwnPropertyNames(dict);
        if (keys.length == 0) break;
        for (let key of keys) {
            let obj = dict[key];
            obj.deps = obj.deps.filter((str)=>classes.has(str));
        }
        for (let key of keys) {
            let obj = dict[key];
            if (obj.deps.length == 0) {
                outputs.push('\/\/\/ <reference path="' + obj.ref + '" />');
                for (let c of obj.classes) {
                    classes.delete(c);
                }
                delete dict[key];
                found = true;
            }
        }
        if (!found) {
            throw 'circular dependency';
        }
    }
}

readFolder(Path.resolve(srcPath, 'util'), 'util/');
readFolder(Path.resolve(srcPath, 'core'), 'core/');
readFolder(Path.resolve(srcPath, 'logic'), 'logic/');

resolve();

Fs.writeFileSync(Path.resolve(srcPath, 'breezeflow.ts'), outputs.join('\n'));