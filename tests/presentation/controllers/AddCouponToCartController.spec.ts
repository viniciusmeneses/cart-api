import { plainToInstance } from "class-transformer";
import { F } from "rambda";

import { AddCouponToCartUseCase } from "@domain/useCases/cart";
import faker from "@faker-js/faker";
import { CartsRepository, CouponsRepository } from "@infra/database/postgres";
import { AddCouponToCartController } from "@presentation/controllers/cart";
import { HttpErrorHandler, HttpResponse } from "@presentation/helpers";
import { makeFakeCart, makeFakeCoupon } from "@tests/domain/fakes";

jest.mock("@domain/useCases/cart");
jest.mock("@infra/database/postgres");

jest.spyOn(HttpErrorHandler, "handleCartError");

type MockedAddCouponToCartUseCase = jest.Mocked<AddCouponToCartUseCase>;

interface ISutTypes {
  sut: AddCouponToCartController;
  addCouponToCartUseCaseMock: MockedAddCouponToCartUseCase;
}

const fakeCart = makeFakeCart({
  id: faker.datatype.uuid(),
  coupon: makeFakeCoupon({ id: faker.random.alphaNumeric(5) }),
});

const fakeRequest: AddCouponToCartController.IRequest = {
  url: { params: { cartId: fakeCart.id }, query: null },
  body: { couponCode: fakeCart.coupon.code },
};

const makeAddCouponToCartUseCaseMock = () => {
  const addCouponToCartUseCaseMock = new AddCouponToCartUseCase(
    new CartsRepository(),
    new CouponsRepository()
  ) as MockedAddCouponToCartUseCase;
  addCouponToCartUseCaseMock.execute.mockResolvedValue(fakeCart);
  return addCouponToCartUseCaseMock;
};

const makeSut = (): ISutTypes => {
  const addCouponToCartUseCaseMock = makeAddCouponToCartUseCaseMock();
  const sut = new AddCouponToCartController(addCouponToCartUseCaseMock);
  return { sut, addCouponToCartUseCaseMock };
};

describe("AddCouponToCartController", () => {
  it("Should call AddCouponToCartUseCase.execute with dto", async () => {
    const { sut, addCouponToCartUseCaseMock } = makeSut();
    const useCaseSpy = jest.spyOn(addCouponToCartUseCaseMock, "execute");

    await sut.handle(fakeRequest);

    expect(useCaseSpy).toHaveBeenCalledTimes(1);
    expect(useCaseSpy).toHaveBeenCalledWith({ id: fakeRequest.url.params.cartId, ...fakeRequest.body });
  });

  it("Should call HttpErrorHandler.handleCartError if use case throws", async () => {
    const { sut, addCouponToCartUseCaseMock } = makeSut();
    const fakeError = new Error();

    jest.spyOn(addCouponToCartUseCaseMock, "execute").mockRejectedValueOnce(fakeError);
    await sut.handle(fakeRequest).catch(F);

    expect(HttpErrorHandler.handleCartError).toHaveBeenCalledTimes(1);
    expect(HttpErrorHandler.handleCartError).toHaveBeenCalledWith(fakeError);
  });

  it("Should return cart on success", async () => {
    const { sut } = makeSut();
    const response = await sut.handle(fakeRequest);
    expect(response).toEqual(HttpResponse.ok(fakeCart));
  });
});
