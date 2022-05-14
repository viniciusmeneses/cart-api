module.exports = {
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  coverageDirectory: "coverage",
  coverageProvider: "babel",
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/index.ts",
    "!src/main/**/*.ts",
    "!src/infra/database/postgres/{migrations,config}/*.ts",
  ],
  coverageReporters: ["lcov", "text"],
  testMatch: ["**/*.spec.ts"],
  testEnvironment: "node",
  clearMocks: true,
  moduleNameMapper: {
    "@domain/(.*)": "<rootDir>/src/domain/$1",
    "@infra/(.*)": "<rootDir>/src/infra/$1",
    "@main/(.*)": "<rootDir>/src/main/$1",
    "@presentation/(.*)": "<rootDir>/src/presentation/$1",
    "@tests/(.*)": "<rootDir>/tests/$1",
  },
  transform: { "^.+\\.ts$": ["ts-jest"] },
};
