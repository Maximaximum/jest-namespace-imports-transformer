import { readdirSync, readFileSync } from 'fs';

import { Files, transformAllFiles } from './transform-script';

function readTestData(folder: string) {
  const baseDir = __dirname + '/../test-data/' + folder + '/';
  const inputDir = baseDir + 'input/';
  const outputDir = baseDir + 'output/';
  const files: Files = Object.fromEntries(
    readdirSync(inputDir).map((f) => [f, readFileSync(inputDir + f).toString()])
  );
  const expected: Files = Object.fromEntries(
    readdirSync(outputDir).map((f) => [f, readFileSync(outputDir + f).toString()])
  );

  return [files, expected];
}

describe('jest-namespace-imports-transformer', () => {
  it('should work for a minimal reproduction file', () => {
    const [files, expected] = readTestData('minimal');

    const newFiles = transformAllFiles(files);

    expect(newFiles).toEqual(expected);
  });

  it('should work for multiple files', () => {
    const [files, expected] = readTestData('multiple');

    const newFiles = transformAllFiles(files);

    expect(newFiles).toEqual(expected);
  });

  it('should work for real-world file', () => {
    const [files, expected] = readTestData('real-world');

    const newFiles = transformAllFiles(files);

    expect(newFiles).toEqual(expected);
  });
});
