import { validateOrReject, ValidationError as ClassValidationError } from "class-validator";

import { FieldValidationError, ValidationErrors } from "@domain/validator/errors";
import faker from "@faker-js/faker";

import { ValidateInputs } from "../../../src/domain/validator";

jest.mock("class-validator", () => {
  const originalModule = jest.requireActual("class-validator");

  return {
    ...originalModule,
    validateOrReject: jest.fn().mockResolvedValue(null),
  };
});

class UseCaseStubInput {
  public data: string;
}

class UseCaseStub {
  @ValidateInputs
  public async execute(_input: UseCaseStubInput): Promise<void> {
    return null;
  }
}

const makeSut = () => new UseCaseStub();

const fakeInput = { data: faker.random.word() };

describe("ValidateInputs Decorator", () => {
  it("Should call ClassValidator.validateOrReject with correct input", async () => {
    const sut = makeSut();
    await sut.execute(fakeInput);

    expect(validateOrReject).toHaveBeenCalledTimes(1);
    expect(validateOrReject).toHaveBeenCalledWith(fakeInput, expect.anything());
  });

  it("Should throw ValidationError if ClassValidator.validateOrReject throws", async () => {
    const sut = makeSut();
    const fakeValidatorError = new ClassValidationError();

    jest
      .mocked(validateOrReject)
      .mockRejectedValueOnce([
        fakeValidatorError,
        { ...fakeValidatorError, property: "data", constraints: { data: "error" } },
      ]);
    const promise = sut.execute(fakeInput);

    await expect(promise).rejects.toEqual(new ValidationErrors([new FieldValidationError("data", "error")]));
  });

  it("Should not validate inputs that aren't a class", async () => {
    class UseCaseStub {
      @ValidateInputs
      public async execute(_input: string): Promise<void> {
        return null;
      }
    }

    const sut = new UseCaseStub();
    const result = await sut.execute(fakeInput.data);

    expect(result).toBeNull();
    expect(validateOrReject).toHaveBeenCalledTimes(0);
  });
});
