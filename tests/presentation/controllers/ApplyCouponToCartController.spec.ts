import { plainToInstance } from "class-transformer";
import { F } from "rambda";

import { ApplyCouponToCartUseCase } from "@domain/useCases/cart";
import faker from "@faker-js/faker";
import { CartsRepository, CouponsRepository } from "@infra/database/postgres";
import { ApplyCouponToCartController } from "@presentation/controllers/cart";
import { HttpErrorHandler, HttpResponse } from "@presentation/helpers";
import { makeFakeCart, makeFakeCoupon } from "@tests/domain/fakes";

jest.mock("@domain/useCases/cart");
jest.mock("@infra/database/postgres");

jest.spyOn(HttpErrorHandler, "handleCartError");

type MockedApplyCouponToCartUseCase = jest.Mocked<ApplyCouponToCartUseCase>;

interface ISutTypes {
  sut: ApplyCouponToCartController;
  applyCouponToCartUseCaseMock: MockedApplyCouponToCartUseCase;
}

const fakeCart = makeFakeCart({
  id: faker.datatype.uuid(),
  coupon: makeFakeCoupon({ id: faker.random.alphaNumeric(5) }),
});

const fakeRequest: ApplyCouponToCartController.IRequest = {
  url: { params: { cartId: fakeCart.id }, query: null },
  body: { couponCode: fakeCart.coupon.code },
};

const makeApplyCouponToCartUseCaseMock = () => {
  const applyCouponToCartUseCaseMock = new ApplyCouponToCartUseCase(
    new CartsRepository(),
    new CouponsRepository()
  ) as MockedApplyCouponToCartUseCase;
  applyCouponToCartUseCaseMock.execute.mockResolvedValue(fakeCart);
  return applyCouponToCartUseCaseMock;
};

const makeSut = (): ISutTypes => {
  const applyCouponToCartUseCaseMock = makeApplyCouponToCartUseCaseMock();
  const sut = new ApplyCouponToCartController(applyCouponToCartUseCaseMock);
  return { sut, applyCouponToCartUseCaseMock };
};

describe("ApplyCouponToCartController", () => {
  it("Should call ApplyCouponToCartUseCase.execute with dto", async () => {
    const { sut, applyCouponToCartUseCaseMock } = makeSut();
    const useCaseSpy = jest.spyOn(applyCouponToCartUseCaseMock, "execute");

    await sut.handle(fakeRequest);

    expect(useCaseSpy).toHaveBeenCalledTimes(1);
    expect(useCaseSpy).toHaveBeenCalledWith({ id: fakeRequest.url.params.cartId, ...fakeRequest.body });
  });

  it("Should call HttpErrorHandler.handleCartError if use case throws", async () => {
    const { sut, applyCouponToCartUseCaseMock } = makeSut();
    const fakeError = new Error();

    jest.spyOn(applyCouponToCartUseCaseMock, "execute").mockRejectedValueOnce(fakeError);
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
