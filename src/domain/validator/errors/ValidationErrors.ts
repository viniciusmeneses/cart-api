import { FieldValidationError } from "./FieldValidationError";

export class ValidationErrors extends Error {
  public constructor(public errors: FieldValidationError[]) {
    super(errors.toString());
    this.name = "ValidationErrors";
  }
}
