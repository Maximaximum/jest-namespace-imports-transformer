import * as ts from 'typescript';

const REFACTOR_NAME = 'Convert import';
const ACTION_NAME = 'Convert namespace import to named imports';

const defaultCompilerOptions: ts.CompilerOptions = {
  target: ts.ScriptTarget.ES2020,
  module: ts.ModuleKind.ES2020,
  // ...
};

const defaultFormatOptions: ts.FormatCodeSettings = {
  insertSpaceAfterCommaDelimiter: true,
  insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces: false,
  // ...
};

const preferences: ts.UserPreferences = {
  // This is helpful to find out why the refactor isn't working
  // provideRefactorNotApplicableReason: true
};

export type Files = Record<string, string>;

export function transformAllFiles(
  files: Files,
  compilerOptions: ts.CompilerOptions = defaultCompilerOptions,
  formatOptions: ts.FormatCodeSettings = defaultFormatOptions
) {
  // https://github.com/microsoft/TypeScript/wiki/Using-the-Language-Service-API#document-registry
  // It was the only way I could find to get a SourceFile from the language
  // service without having to parse the file again
  const registry = ts.createDocumentRegistry();

  // I think the getScriptVersion thing may be useful for incremental compilation,
  // but I'm trying to keep this as simple as possible
  let scriptVersion = 0;
  const service = ts.createLanguageService(
    {
      getCurrentDirectory: () => '/',
      getCompilationSettings: () => compilerOptions,
      getScriptFileNames: () => Object.keys(files),
      getScriptVersion: (_file) => scriptVersion.toString(),
      // https://github.com/microsoft/TypeScript/wiki/Using-the-Language-Service-API#scriptsnapshot
      getScriptSnapshot: (file) => {
        return file in files
          ? ts.ScriptSnapshot.fromString(files[file as keyof typeof files])
          : undefined;
      },
      getDefaultLibFileName: ts.getDefaultLibFilePath,
    },
    registry
  );

  const transformFile = (fileName: string): string => {
    function getNextNamespaceImportRange() {
      // Get the AST of the file
      const sourceFile = registry.acquireDocument(
        fileName,
        compilerOptions,
        ts.ScriptSnapshot.fromString(files[fileName]),
        (scriptVersion++).toString(),
        ts.ScriptKind.TS
      );

      const namespaceImport = sourceFile.statements
        // Get the namespace import declarations
        .find(
          (node) =>
            ts.isImportDeclaration(node) &&
            node.importClause?.namedBindings &&
            ts.isNamespaceImport(node.importClause.namedBindings)
        );

      if (!namespaceImport) {
        return;
      }

      // The range of the import declaration
      const res = {
        pos: namespaceImport.getStart(sourceFile),
        end: namespaceImport.getEnd(),
      } as ts.TextRange;

      return res;
    }

    function refactorNamespaceImport(range: ts.TextRange) {
      let text = files[fileName];
      // If preferences.provideRefactorNotApplicableReason is true,
      // each refactor will have a notApplicableReason property if it
      // isn't applicable (could be useful for debugging)
      const refactors = service.getApplicableRefactors(fileName, range, preferences);
      // Make sure the refactor is applicable (otherwise getEditsForRefactor
      // will throw an error)
      const nodeRefactorActions =
        refactors
          .find(({ name }) => name === REFACTOR_NAME)
          ?.actions.some(({ name }) => name === ACTION_NAME) ?? false
          ? // The actual part where you get the edits for the refactor
            service
              .getEditsForRefactor(
                fileName,
                formatOptions,
                range,
                REFACTOR_NAME,
                ACTION_NAME,
                preferences
              )
              ?.edits.flatMap(({ textChanges }) => textChanges) ?? []
          : [];

      let offset = 0;

      for (const {
        span: { start, length },
        newText,
      } of nodeRefactorActions.sort((a, b) => a.span.start - b.span.start)) {
        // start: index (of original text) of text to replace
        // length: length of text to replace
        // newText: new text
        // Because newText.length does not necessarily === length, the second
        // element of the accumulator keeps track of the offset
        const newStart = start + offset;
        text = text.slice(0, newStart) + newText + text.slice(newStart + length);
        offset = offset + newText.length - length;
      }

      files[fileName] = text;
    }

    let range = getNextNamespaceImportRange();

    while (range) {
      refactorNamespaceImport(range);
      range = getNextNamespaceImportRange();
    }

    return files[fileName];
  };

  for (const fileName of Object.keys(files)) {
    transformFile(fileName);
  }

  return files;
}
