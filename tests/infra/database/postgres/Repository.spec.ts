import { PostgresConnection, Repository } from "@infra/database/postgres";

const makeConnection = () => new PostgresConnection();

const makeSut = () => {
  const connection = makeConnection();
  return new Repository(connection);
};

describe("Repository", () => {
  describe("connection", () => {
    test("Should be initialized with an instance of PostgresConnection", () => {
      const sut = makeSut();
      expect(sut["connection"]).toBeInstanceOf(PostgresConnection);
    });
  });
});
