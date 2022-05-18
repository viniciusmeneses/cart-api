import { inject, singleton } from "tsyringe";

import { ILoadCartUseCase } from "@domain/ports/useCases/cart";
import { HttpErrorHandler, HttpResponse } from "@presentation/helpers";
import { Http, IController } from "@presentation/protocols";

@singleton()
export class LoadCartController implements IController {
  public constructor(@inject("LoadCartUseCase") private loadCartUseCase: ILoadCartUseCase) {}

  public async handle(request: LoadCartController.IRequest): Promise<Http.IResponse> {
    const { cartId } = request.url.params;

    try {
      const cart = await this.loadCartUseCase.execute({ id: cartId });
      return HttpResponse.ok(cart);
    } catch (error) {
      return HttpErrorHandler.handleCartError(error);
    }
  }
}

export namespace LoadCartController {
  interface IRequestParams {
    cartId: string;
  }

  export type IRequest = Http.IRequest<unknown, IRequestParams>;
}
