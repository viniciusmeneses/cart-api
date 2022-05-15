// eslint-disable-next-line
const config = require("./jest.config");

config.testMatch = ["**/*.test.ts"];
config.setupFilesAfterEnv = [...config.setupFilesAfterEnv, "./jest-e2e.setup.ts"];
module.exports = config;
