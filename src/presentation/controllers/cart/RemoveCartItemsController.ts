import { inject, singleton } from "tsyringe";

import { IRemoveCartItemsUseCase } from "@domain/ports/useCases/cart";
import { CartNotExistsError, ProductNotExistsError } from "@domain/useCases/errors";
import { ValidationErrors } from "@domain/validator";
import { HttpResponse } from "@presentation/helpers";
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
      return this.handleError(error);
    }
  }

  private handleError(error: Error): Http.IResponse {
    if (error instanceof ValidationErrors) return HttpResponse.badRequest(error.errors);
    if (error instanceof CartNotExistsError) return HttpResponse.notFound(error);
    throw error;
  }
}

export namespace RemoveCartItemsController {
  export type IRequest = Http.IRequest<unknown, { cartId: string; productId?: string }>;
}
