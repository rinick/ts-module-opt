compile multi-files based ts module into same scope

install
```
npm install -g ts-module-opt
```

compile a module directory
```
ts-module-opt -r typings/index.d.ts src
```

compile multiple module directories
```
ts-module-opt -r typings/index.d.ts modulePath1 modulePath2
```

### parameters
 * **--reference {path}**: add a reference file path to the tsc compiler
   * or **-r {path}** 
 * **--target es5**: change the tsc targert to es5, default is es6
   * or **-t es5** 
 * **--declaration**: generate the typescript declaration file (.d.ts)
    * or **-d** 
 * **--sourceMap**: generate the source map

### benifits

 * a main ts file is generate for the directory to maintain all the reference paths
 * all module files are compiled into same scope
 * exported types are compiled into same scope in the declaration
 * reference to **ModuleName.TypeName** is optimited to just **TypeName** when they are in same module

### limitations
 * require tsc to be in system path
 * all typescript files in directory need to be in same module
 * if a type need to be used in a different file, that type must be exported even these files are in same module
 * resolving dependency might not be 100% correct, and it requires the ts source code to use 4 spaces padding