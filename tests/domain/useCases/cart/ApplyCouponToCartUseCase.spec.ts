import { plainToInstance } from "class-transformer";

import { Cart } from "@domain/entities/Cart";
import { ICartsRepository, ICouponsRepository } from "@domain/ports/repositories";
import { ApplyCouponToCartUseCase } from "@domain/useCases/cart";
import { CartNotExistsError, CouponCodeInvalidError } from "@domain/useCases/errors";
import { ValidationErrors } from "@domain/validator";
import faker from "@faker-js/faker";
import { CartsRepository, CouponsRepository } from "@infra/database/postgres";
import { makeFakeCartItem, makeFakeCoupon } from "@tests/domain/fakes";
import { makeFakeCart } from "@tests/domain/fakes/cart";

jest.mock("@infra/database/postgres");

type MockedICartsRepository = jest.Mocked<ICartsRepository>;
type MockedICouponsRepository = jest.Mocked<ICouponsRepository>;

interface ISutTypes {
  sut: ApplyCouponToCartUseCase;
  cartsRepositoryMock: MockedICartsRepository;
  couponsRepositoryMock: MockedICouponsRepository;
}

const fakeCartId = faker.datatype.uuid();

const fakeCart = makeFakeCart({
  id: fakeCartId,
  items: [makeFakeCartItem({ cartId: fakeCartId, productId: faker.datatype.uuid() })],
});

const fakeCoupon = makeFakeCoupon({ id: faker.datatype.uuid() });

const fakeCartWithCoupon = plainToInstance(Cart, { ...fakeCart, coupon: fakeCoupon });

const makeCartsRepositoryMock = () => {
  const cartsRepositoryMock = jest.mocked(new CartsRepository());
  cartsRepositoryMock.findById.mockResolvedValue(fakeCart);
  cartsRepositoryMock.update.mockResolvedValue(fakeCartWithCoupon);
  return cartsRepositoryMock;
};

const makeCouponsRepositoryMock = () => {
  const couponsRepositoryMock = jest.mocked(new CouponsRepository());
  couponsRepositoryMock.findByCode.mockResolvedValue(fakeCoupon);
  return couponsRepositoryMock;
};

const makeSut = (): ISutTypes => {
  const cartsRepositoryMock = makeCartsRepositoryMock();
  const couponsRepositoryMock = makeCouponsRepositoryMock();
  const sut = new ApplyCouponToCartUseCase(cartsRepositoryMock, couponsRepositoryMock);
  return { sut, cartsRepositoryMock, couponsRepositoryMock };
};

describe("ApplyCouponToCartUseCase", () => {
  it("Should throw ValidationErrors if any param is invalid", async () => {
    const { sut } = makeSut();
    const promise = sut.execute({ id: null, couponCode: null });
    await expect(promise).rejects.toThrowError(ValidationErrors);
  });

  it("Should call CartsRepository.findById with id", async () => {
    const { sut, cartsRepositoryMock } = makeSut();
    await sut.execute({ id: fakeCart.id, couponCode: fakeCoupon.code });

    expect(cartsRepositoryMock.findById).toBeCalledTimes(1);
    expect(cartsRepositoryMock.findById).toBeCalledWith(fakeCart.id);
  });

  it("Should throw CartNotExistsError if cart id does not exists", async () => {
    const { sut, cartsRepositoryMock } = makeSut();
    cartsRepositoryMock.findById.mockResolvedValue(null);
    await expect(sut.execute({ id: fakeCart.id, couponCode: fakeCoupon.code })).rejects.toThrowError(
      CartNotExistsError
    );
  });

  it("Should throw if CartsRepository.findById throws", async () => {
    const { sut, cartsRepositoryMock } = makeSut();
    cartsRepositoryMock.findById.mockRejectedValueOnce(new Error());
    await expect(sut.execute({ id: fakeCart.id, couponCode: fakeCoupon.code })).rejects.toThrow();
  });

  it("Should throw if CouponsRepository.findByCode throws", async () => {
    const { sut, couponsRepositoryMock } = makeSut();
    couponsRepositoryMock.findByCode.mockRejectedValueOnce(new Error());
    await expect(sut.execute({ id: fakeCart.id, couponCode: fakeCoupon.code })).rejects.toThrow();
  });

  it("Should call CouponsRepository.findByCode with id", async () => {
    const { sut, couponsRepositoryMock } = makeSut();
    await sut.execute({ id: fakeCart.id, couponCode: fakeCoupon.code });

    expect(couponsRepositoryMock.findByCode).toBeCalledTimes(1);
    expect(couponsRepositoryMock.findByCode).toBeCalledWith(fakeCoupon.code);
  });

  it("Should throw CouponCodeInvalidError if cart id does not exists", async () => {
    const { sut, couponsRepositoryMock } = makeSut();
    couponsRepositoryMock.findByCode.mockResolvedValue(null);
    await expect(sut.execute({ id: fakeCart.id, couponCode: fakeCoupon.code })).rejects.toThrowError(
      CouponCodeInvalidError
    );
  });

  it("Should return cart with applied coupon on success", async () => {
    const { sut } = makeSut();
    await expect(sut.execute({ id: fakeCart.id, couponCode: fakeCoupon.code })).resolves.toEqual(fakeCartWithCoupon);
  });
});
