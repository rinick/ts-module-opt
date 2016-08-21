module my_module {
    export class File2 extends File3 {
        print(): string {
            return 'this file should be in the end of the reference list, because it has more dependencies.';
        }
    }
}