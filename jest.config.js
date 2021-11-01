module.exports = {
  displayName: "jest-namespace-imports-transformer",

  testMatch: ["**/+(*.)+(spec|test).+(ts|js)?(x)"],
  moduleFileExtensions: ["ts", "js", "html"],
  coverageReporters: ["html"],
  transform: {
    "^.+\\.(ts|js|html)$": "ts-jest",
  },
  testEnvironment: "jsdom",

  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.spec.json",
    },
  },
  transform: {
    "^.+\\.[tj]sx?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  coverageDirectory: "../../coverage/libs/jest-namespace-imports-transformer",
};
