import { FieldValidationError } from "@domain/validator";
import { Http } from "@presentation/protocols";

type Errors = Error | FieldValidationError[];

const serializeErrors = (errors: Errors) => {
  const errorsList = errors instanceof Error ? [errors] : errors;

  return {
    errors: errorsList.map((error) => ({
      type: error.name,
      message: error.message,
      ...(error instanceof FieldValidationError ? { field: error.field } : {}),
    })),
  };
};

export namespace HttpResponse {
  export const created = (data: any): Http.IResponse => ({
    status: 201,
    body: data,
  });

  export const badRequest = (errors: Errors): Http.IResponse => ({
    status: 400,
    body: serializeErrors(errors),
  });

  export const notFound = (errors: Errors): Http.IResponse => ({
    status: 404,
    body: serializeErrors(errors),
  });
}
