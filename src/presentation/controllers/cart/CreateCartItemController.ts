import { inject, singleton } from "tsyringe";

import { ICreateCartItemUseCase } from "@domain/ports/useCases/cart";
import {
  CartItemAlreadyExistsError,
  CartNotExistsError,
  ProductNotExistsError,
  ProductStockUnavailable,
} from "@domain/useCases/errors";
import { ValidationErrors } from "@domain/validator";
import { HttpResponse } from "@presentation/helpers";
import { Http, IController } from "@presentation/protocols";

@singleton()
export class CreateCartItemController implements IController {
  public constructor(@inject("CreateCartItemUseCase") private createCartItemUseCase: ICreateCartItemUseCase) {}

  public async handle(request: CreateCartItemController.IRequest): Promise<Http.IResponse> {
    const { cartId } = request.url.params;
    const { productId, quantity } = request.body;

    try {
      const cartItem = await this.createCartItemUseCase.execute({ cartId, productId, quantity });
      return HttpResponse.created(cartItem);
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: Error): Http.IResponse {
    if (error instanceof ValidationErrors) return HttpResponse.badRequest(error.errors);
    if (error instanceof CartNotExistsError) return HttpResponse.notFound(error);
    if (error instanceof ProductNotExistsError) return HttpResponse.notFound(error);
    if (error instanceof ProductStockUnavailable) return HttpResponse.badRequest(error);
    if (error instanceof CartItemAlreadyExistsError) return HttpResponse.badRequest(error);
    throw error;
  }
}

export namespace CreateCartItemController {
  interface IRequestBody {
    productId: string;
    quantity: number;
  }

  interface IRequestParams {
    cartId: string;
  }

  export type IRequest = Http.IRequest<IRequestBody, IRequestParams>;
}
