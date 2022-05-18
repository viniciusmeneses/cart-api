import { inject, singleton } from "tsyringe";

import { IAddCouponToCartUseCase } from "@domain/ports/useCases/cart";
import { HttpErrorHandler, HttpResponse } from "@presentation/helpers";
import { Http, IController } from "@presentation/protocols";

@singleton()
export class AddCouponToCartController implements IController {
  public constructor(@inject("AddCouponToCartUseCase") private addCouponToCartUseCase: IAddCouponToCartUseCase) {}

  public async handle(request: AddCouponToCartController.IRequest): Promise<Http.IResponse> {
    const { cartId } = request.url.params;
    const { couponCode } = request.body;

    try {
      const cart = await this.addCouponToCartUseCase.execute({ id: cartId, couponCode });
      return HttpResponse.ok(cart);
    } catch (error) {
      return HttpErrorHandler.handleCartError(error);
    }
  }
}

export namespace AddCouponToCartController {
  interface IRequestParams {
    cartId: string;
  }

  interface IRequestBody {
    couponCode: string;
  }

  export type IRequest = Http.IRequest<IRequestBody, IRequestParams>;
}
