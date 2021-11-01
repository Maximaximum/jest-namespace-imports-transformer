declare module 'jest-preset-angular/build/ng-jest-transformer' {
  export class NgJestTransformer {
    process(sourceText: string, sourcePath: string, options: any): any;
  }
}
