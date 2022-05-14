export class FieldValidationError extends Error {
  public constructor(public field: string, public message: string) {
    super(message);
    this.name = "FieldValidationError";
  }
}
