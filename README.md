# jest-namespace-imports-transformer

This package contains a jest transformer that transforms `*.ts` and `*.js` files by replacing es6 `namespace imports` with `named imports`.

It is meant to be used a temporary workaround for the `jest-preset-angular` issue: https://github.com/thymikee/jest-preset-angular/issues/963

## Rationale

`jest-preset-angular` messes up constructors that are imported under a namespace (like `import * as Apollo from 'apollo-angular'`). While the easiest workaround would be not to use namespace imports at all, it's not always achievable due to usage of 3rd party code generators (like `graphql-code-generator`).

## How to use

Inside your `jest.config.js` add this:

```
transform: {
  '^.+\\.(ts|js|html)$': 'jest-namespace-imports-transformer',
},
```

## Known issues

`jest-namespace-imports-transformer` makes its own code transformations, and afterwards applies `NgJestTransformer` transformations. In cases where a different transformer has been used originally, this might cause issues. Unfortunately, it seems like `jest` does not support a way to specify multiple transformers for the same files, so we ended up hardcoding `NgJestTransformer`.

## Running unit tests

Run `npm test` to execute the unit tests. Note that you need to have `jest` installed.
