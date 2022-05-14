import { validateOrReject } from "class-validator";

export const validateSut = (sut: object) => validateOrReject(sut, { skipUndefinedProperties: true });
