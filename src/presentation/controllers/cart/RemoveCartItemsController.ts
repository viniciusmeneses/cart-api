import { inject, singleton } from "tsyringe";

import { IRemoveCartItemsUseCase } from "@domain/ports/useCases/cart";
import { HttpErrorHandler, HttpResponse } from "@presentation/helpers";
import { Http, IController } from "@presentation/protocols";

@singleton()
export class RemoveCartItemsController implements IController {
  public constructor(@inject("RemoveCartItemsUseCase") private removeCartItemsUseCase: IRemoveCartItemsUseCase) {}

  public async handle(request: RemoveCartItemsController.IRequest): Promise<Http.IResponse> {
    const { cartId, productId } = request.url.params;

    try {
      await this.removeCartItemsUseCase.execute({ cartId, productId });
      return HttpResponse.noContent();
    } catch (error) {
      return HttpErrorHandler.handleCartError(error);
    }
  }
}

export namespace RemoveCartItemsController {
  interface IRequestParams {
    cartId: string;
    productId?: string;
  }

  export type IRequest = Http.IRequest<unknown, IRequestParams>;
}
