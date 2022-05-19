import { CartItem } from "@domain/entities/CartItem";

import { makeFakeProduct } from "../fakes";

const fakeProduct = makeFakeProduct({ id: null });

const makeSut = () => {
  const sut = new CartItem();
  sut.quantity = 1;
  return sut;
};

describe("CartItem", () => {
  describe("total", () => {
    it("Should be 0 if product is null", () => {
      const sut = makeSut();
      expect(sut.total).toBe(0);
    });

    it("Should be equal to product price multiplied by quantity", () => {
      const sut = makeSut();
      sut.product = fakeProduct;
      expect(sut.total).toBe(fakeProduct.price * sut.quantity);
    });
  });
});
