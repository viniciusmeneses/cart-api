import {
  CartItemAlreadyExistsError,
  CartItemNotExistsError,
  CartNotExistsError,
  ProductNotExistsError,
  ProductStockUnavailableError,
} from "@domain/useCases/errors";
import { ValidationErrors } from "@domain/validator";
import { Http } from "@presentation/protocols";

import { HttpResponse } from "./HttpResponse";

export namespace HttpErrorHandler {
  export const handleCartError = (error: Error): Http.IResponse => {
    if (error instanceof ValidationErrors) return HttpResponse.badRequest(error.errors);
    if (error instanceof CartItemAlreadyExistsError) return HttpResponse.badRequest(error);
    if (error instanceof ProductStockUnavailableError) return HttpResponse.badRequest(error);

    if (error instanceof CartNotExistsError) return HttpResponse.notFound(error);
    if (error instanceof CartItemNotExistsError) return HttpResponse.notFound(error);
    if (error instanceof ProductNotExistsError) return HttpResponse.notFound(error);

    throw error;
  };
}
