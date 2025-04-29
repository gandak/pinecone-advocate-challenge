module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testMatch: ["**/specs/**/*.test.ts", "**/specs/**/*.spec.ts"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
  },

  collectCoverage: true,
  collectCoverageFrom: [
    "<rootDir>/graphql/resolvers/**/*.{ts,tsx}",
    "!**/index.ts",
    "!**/*.d.ts",
  ],
  coverageReporters: ["text", "html", "lcov"],
};
