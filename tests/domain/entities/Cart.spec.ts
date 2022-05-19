import { Cart } from "@domain/entities/Cart";

import { makeFakeCartItem, makeFakeCoupon } from "../fakes";

const fakeItems = [
  makeFakeCartItem({ cartId: null, productId: null }),
  makeFakeCartItem({ cartId: null, productId: null }),
];

const fakeCoupon = makeFakeCoupon({ id: null });

const makeSut = () => new Cart();

describe("Cart", () => {
  describe("subtotal", () => {
    it("Should be 0 if items is empty", () => {
      const sut = makeSut();
      expect(sut.subtotal).toBe(0);
    });

    it("Should be equal to sum of items total", () => {
      const sut = makeSut();

      sut.items = fakeItems;
      expect(sut.subtotal).toBe(fakeItems.reduce((acc, { total }) => acc + total, 0));
    });
  });

  describe("total", () => {
    it("Should be equal to subtotal", () => {
      const sut = makeSut();
      expect(sut.total).toBe(sut.subtotal);
    });

    it("Should have discount if a coupon was applied", () => {
      const sut = makeSut();
      sut.items = fakeItems;
      sut.coupon = fakeCoupon;
      expect(sut.total).toBe(sut.subtotal - sut.subtotal * (fakeCoupon.percentage / 100));
    });
  });
});
