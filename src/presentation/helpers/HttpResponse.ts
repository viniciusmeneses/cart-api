import { FieldValidationError } from "@domain/validator";
import { Http } from "@presentation/protocols";

export class HttpResponse {
  public static created(data: any): Http.IResponse {
    return {
      status: 201,
      body: data,
    };
  }

  public static badRequest(error: Error | FieldValidationError[]): Http.IResponse {
    const errors = error instanceof Error ? [error] : error;

    return {
      status: 400,
      body: {
        errors: errors.map((error) => {
          const { name: type, message } = error;
          if (error instanceof FieldValidationError) return { type, field: error.field, message };
          return { type, message };
        }),
      },
    };
  }
}
