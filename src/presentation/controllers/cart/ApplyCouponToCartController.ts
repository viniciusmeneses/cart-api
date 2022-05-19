import { inject, singleton } from "tsyringe";

import { IApplyCouponToCartUseCase } from "@domain/ports/useCases/cart";
import { HttpErrorHandler, HttpResponse } from "@presentation/helpers";
import { Http, IController } from "@presentation/protocols";

@singleton()
export class ApplyCouponToCartController implements IController {
  public constructor(@inject("ApplyCouponToCartUseCase") private applyCouponToCartUseCase: IApplyCouponToCartUseCase) {}

  public async handle(request: ApplyCouponToCartController.IRequest): Promise<Http.IResponse> {
    const { cartId } = request.url.params;
    const { couponCode } = request.body;

    try {
      const cart = await this.applyCouponToCartUseCase.execute({ id: cartId, couponCode });
      return HttpResponse.ok(cart);
    } catch (error) {
      return HttpErrorHandler.handleCartError(error);
    }
  }
}

export namespace ApplyCouponToCartController {
  interface IRequestParams {
    cartId: string;
  }

  interface IRequestBody {
    couponCode: string;
  }

  export type IRequest = Http.IRequest<IRequestBody, IRequestParams>;
}
