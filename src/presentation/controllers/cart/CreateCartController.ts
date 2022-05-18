import { inject, singleton } from "tsyringe";

import { ICreateCartUseCase } from "@domain/ports/useCases/cart";
import { HttpErrorHandler, HttpResponse } from "@presentation/helpers";
import { Http, IController } from "@presentation/protocols";

@singleton()
export class CreateCartController implements IController {
  public constructor(@inject("CreateCartUseCase") private createCartUseCase: ICreateCartUseCase) {}

  public async handle(request: CreateCartController.IRequest): Promise<Http.IResponse> {
    const { items } = request.body;

    try {
      const cart = await this.createCartUseCase.execute({ items });
      return HttpResponse.created(cart);
    } catch (error) {
      return HttpErrorHandler.handleCartError(error);
    }
  }
}

export namespace CreateCartController {
  interface IRequestItem {
    productId: string;
    quantity: number;
  }

  interface IRequestBody {
    items: IRequestItem[];
  }

  export type IRequest = Http.IRequest<IRequestBody>;
}
