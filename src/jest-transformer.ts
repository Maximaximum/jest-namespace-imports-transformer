import { SyncTransformer, TransformOptions } from '@jest/transform';
import { NgJestTransformer } from 'jest-preset-angular/build/ng-jest-transformer';

import { transformAllFiles } from './transform-script';

export class ReplaceNamespaceImportsTransformer
  extends NgJestTransformer
  implements SyncTransformer
{
  constructor() {
    super();
  }

  // canInstrument?: boolean;
  // createTransformer?: (options?: unknown) => SyncTransformer<unknown>;
  // getCacheKey?: (sourceText: string, sourcePath: string, options: TransformOptions<unknown>) => string;
  // getCacheKeyAsync?: (sourceText: string, sourcePath: string, options: TransformOptions<unknown>) => Promise<string>;
  // processAsync?: (sourceText: string, sourcePath: string, options: TransformOptions<unknown>) => Promise<TransformedSource>;

  process(sourceText: string, sourcePath: string, options: TransformOptions<unknown>) {
    let code = sourceText;
    if (sourcePath.endsWith('.ts') || sourcePath.endsWith('.js')) {
      code = transformAllFiles({ [sourcePath]: sourceText })[sourcePath];
      // TODO SourceMaps
    }

    return super.process(code, sourcePath, options);
  }

  getCacheKey() {
    return (Math.random() * 10000000).toString();
  }
}

export default {
  createTransformer: (): ReplaceNamespaceImportsTransformer =>
    new ReplaceNamespaceImportsTransformer(),
};
