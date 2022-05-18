import { inject, singleton } from "tsyringe";

import { IUpdateCartItemUseCase } from "@domain/ports/useCases/cart";
import { CartItemNotExistsError, ProductStockUnavailableError } from "@domain/useCases/errors";
import { ValidationErrors } from "@domain/validator";
import { HttpResponse } from "@presentation/helpers";
import { Http, IController } from "@presentation/protocols";

@singleton()
export class UpdateCartItemController implements IController {
  public constructor(@inject("UpdateCartItemUseCase") private updateCartItemUseCase: IUpdateCartItemUseCase) {}

  public async handle(request: UpdateCartItemController.IRequest): Promise<Http.IResponse> {
    const { cartId, productId } = request.url.params;
    const { quantity } = request.body;

    try {
      const cartItem = await this.updateCartItemUseCase.execute({ cartId, productId, quantity });
      return HttpResponse.ok(cartItem);
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: Error): Http.IResponse {
    if (error instanceof ValidationErrors) return HttpResponse.badRequest(error.errors);
    if (error instanceof CartItemNotExistsError) return HttpResponse.notFound(error);
    if (error instanceof ProductStockUnavailableError) return HttpResponse.badRequest(error);
    throw error;
  }
}

export namespace UpdateCartItemController {
  interface IRequestBody {
    quantity: number;
  }

  interface IRequestParams {
    productId: string;
    cartId: string;
  }

  export type IRequest = Http.IRequest<IRequestBody, IRequestParams>;
}
