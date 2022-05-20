import { pick } from "rambda";
import request from "supertest";
import { container } from "tsyringe";
import { Repository } from "typeorm";

import { Cart } from "@domain/entities/Cart";
import { CartItem } from "@domain/entities/CartItem";
import { Coupon } from "@domain/entities/Coupon";
import { Product } from "@domain/entities/Product";
import faker from "@faker-js/faker";
import { PostgresConnection } from "@infra/database/postgres";
import { app } from "@main/app";

let connection: PostgresConnection;
let cartsRepository: Repository<Cart>;
let cartItemsRepository: Repository<CartItem>;
let couponsRepository: Repository<Coupon>;
let productsRepository: Repository<Product>;

describe("Cart Routes", () => {
  beforeAll(async () => {
    connection = container.resolve(PostgresConnection);
    await connection.connect();

    cartsRepository = connection.getRepository(Cart);
    cartItemsRepository = connection.getRepository(CartItem);
    couponsRepository = connection.getRepository(Coupon);
    productsRepository = connection.getRepository(Product);
  });

  afterAll(() => connection.disconnect());

  describe("POST /carts", () => {
    it("Should return 201", async () => {
      const response = await request(app).post("/api/carts");

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.items).toHaveLength(0);
      expect(response.body.total).toBe(0);
    });

    it("Should return 201 with cart items filled", async () => {
      const fakeProduct = await productsRepository.save({ name: faker.random.word(), price: 0, stock: 5 });

      const response = await request(app)
        .post("/api/carts")
        .send({
          items: [{ productId: fakeProduct.id, quantity: 1 }],
        });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.items).toHaveLength(1);
      expect(response.body.items[0].productId).toBe(fakeProduct.id);
    });

    it("Should return 400 if any request param is invalid", async () => {
      const response = await request(app)
        .post("/api/carts")
        .send({ items: [{ productId: "", quantity: 0 }] });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        errors: [
          {
            type: "FieldValidationError",
            message: "productId must be a UUID",
            field: "items[0].productId",
          },
          {
            type: "FieldValidationError",
            message: "productId should not be empty",
            field: "items[0].productId",
          },
          {
            type: "FieldValidationError",
            message: "quantity must be a positive number",
            field: "items[0].quantity",
          },
        ],
      });
    });

    it("Should return 404 if any product does not exist", async () => {
      const fakeProductId = faker.datatype.uuid();

      const response = await request(app)
        .post("/api/carts")
        .send({ items: [{ productId: fakeProductId, quantity: 1 }] });

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        errors: [
          {
            type: "ProductNotExistsError",
            message: `Product ${fakeProductId} does not exist`,
          },
        ],
      });
    });
  });

  describe("GET /carts/{cartId}", () => {
    it("Should return 200", async () => {
      const fakeCart = await cartsRepository.save({});
      const response = await request(app).get(`/api/carts/${fakeCart.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(pick(["id", "items", "cupon", "total", "subtotal"], fakeCart));
    });

    it("Should return 400 if any request param is invalid", async () => {
      const response = await request(app).get("/api/carts/id").send();

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        errors: [
          {
            type: "FieldValidationError",
            message: "id must be a UUID",
            field: "id",
          },
        ],
      });
    });

    it("Should return 404 if cart does not exist", async () => {
      const fakeCartId = faker.datatype.uuid();
      const response = await request(app).get(`/api/carts/${fakeCartId}`).send();

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        errors: [
          {
            type: "CartNotExistsError",
            message: `Cart ${fakeCartId} does not exist`,
          },
        ],
      });
    });
  });

  describe("POST /carts/:cartId/applyCoupon", () => {
    it("Should return 200", async () => {
      const fakeProduct = await productsRepository.save({ name: faker.random.word(), price: 100, stock: 5 });
      const fakeCart = await cartsRepository.save({ items: [{ productId: fakeProduct.id, quantity: 1 }] });
      const fakeCoupon = await couponsRepository.save({ code: "FAKE", percentage: 5 });

      const response = await request(app)
        .post(`/api/carts/${fakeCart.id}/applyCoupon`)
        .send({ couponCode: fakeCoupon.code });

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(fakeCart.id);
      expect(response.body.coupon).toMatchObject(pick(["id", "code", "percentage"], fakeCoupon));
      expect(response.body.subtotal).toBe(100);
      expect(response.body.total).toBe(95);
    });

    it("Should return 400 if any request param is invalid", async () => {
      const response = await request(app).post("/api/carts/id/applyCoupon").send();

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        errors: [
          {
            type: "FieldValidationError",
            message: "id must be a UUID",
            field: "id",
          },
          {
            type: "FieldValidationError",
            message: "couponCode must be shorter than or equal to 5 characters",
            field: "couponCode",
          },
          {
            type: "FieldValidationError",
            message: "couponCode should not be empty",
            field: "couponCode",
          },
        ],
      });
    });

    it("Should return 400 if coupon code is invalid", async () => {
      const fakeCart = await cartsRepository.save({});

      const response = await request(app).post(`/api/carts/${fakeCart.id}/applyCoupon`).send({ couponCode: "XXXXX" });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        errors: [
          {
            type: "CouponCodeInvalidError",
            message: "Coupon XXXXX is invalid",
          },
        ],
      });
    });

    it("Should return 404 if cart does not exist", async () => {
      const fakeCartId = faker.datatype.uuid();
      const response = await request(app).post(`/api/carts/${fakeCartId}/applyCoupon`).send({ couponCode: "XXXXX" });

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        errors: [
          {
            type: "CartNotExistsError",
            message: `Cart ${fakeCartId} does not exist`,
          },
        ],
      });
    });
  });

  describe("DELETE /carts/:cartId/items", () => {
    it("Should return 204", async () => {
      const fakeProduct = await productsRepository.save({ name: faker.random.word(), price: 100, stock: 5 });
      const fakeCart = await cartsRepository.save({ items: [{ productId: fakeProduct.id, quantity: 1 }] });

      const response = await request(app).delete(`/api/carts/${fakeCart.id}/items`).send();

      const fakeCartWithoutItems = await cartsRepository.findOne({
        where: { id: fakeCart.id },
        relations: { items: true },
      });

      expect(response.status).toBe(204);
      expect(fakeCartWithoutItems.items).toHaveLength(0);
    });

    it("Should return 400 if any request param is invalid", async () => {
      const response = await request(app).delete("/api/carts/id/items").send();

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        errors: [
          {
            type: "FieldValidationError",
            message: "cartId must be a UUID",
            field: "cartId",
          },
        ],
      });
    });

    it("Should return 404 if cart does not exist", async () => {
      const fakeCartId = faker.datatype.uuid();
      const response = await request(app).delete(`/api/carts/${fakeCartId}/items`).send();

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        errors: [
          {
            type: "CartNotExistsError",
            message: `Cart ${fakeCartId} does not exist`,
          },
        ],
      });
    });
  });
});
