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
 * -r : add a reference path

### benifits

 * a main ts file is generate for the directory to maintain all the reference paths
 * all module files are compiled into same scope
 * reference to `ModuleName.TypeName` is optimited to just `TypeName` when they are in same module

### limitations
 * require tsc to be in system path
 * all typescript files in directory need to be in same module
 * if a type need to be used in a different file, that type must be exported even these files are in same module