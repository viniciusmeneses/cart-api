import { inject, singleton } from "tsyringe";

import { ICreateCartItemUseCase } from "@domain/ports/useCases/cart";
import { HttpErrorHandler, HttpResponse } from "@presentation/helpers";
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
      return HttpErrorHandler.handleCartError(error);
    }
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
