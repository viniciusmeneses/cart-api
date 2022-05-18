import { inject, singleton } from "tsyringe";

import { IUpdateCartItemUseCase } from "@domain/ports/useCases/cart";
import { HttpErrorHandler, HttpResponse } from "@presentation/helpers";
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
      return HttpErrorHandler.handleCartError(error);
    }
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
