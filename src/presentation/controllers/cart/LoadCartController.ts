import { inject, singleton } from "tsyringe";

import { ILoadCartUseCase } from "@domain/ports/useCases/cart";
import { CartNotExistsError } from "@domain/useCases/errors";
import { ValidationErrors } from "@domain/validator";
import { HttpResponse } from "@presentation/helpers";
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
      return this.handleError(error);
    }
  }

  private handleError(error: Error): Http.IResponse {
    if (error instanceof ValidationErrors) return HttpResponse.badRequest(error.errors);
    if (error instanceof CartNotExistsError) return HttpResponse.notFound(error);
    throw error;
  }
}

export namespace LoadCartController {
  export type IRequest = Http.IRequest<unknown, { cartId: string }>;
}
