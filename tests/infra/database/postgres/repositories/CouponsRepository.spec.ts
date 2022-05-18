import { Coupon } from "@domain/entities/Coupon";
import faker from "@faker-js/faker";
import { CouponsRepository, PostgresConnection } from "@infra/database/postgres";
import { makeFakeCoupon } from "@tests/domain/fakes";

const fakeCoupon = makeFakeCoupon({ id: faker.datatype.uuid() });

PostgresConnection.prototype.getRepository = jest.fn().mockReturnValue({
  findOneBy: jest.fn().mockReturnValue(fakeCoupon),
});

const connectionMock = new PostgresConnection();
const couponsRepositoryMock = jest.mocked(connectionMock.getRepository(Coupon));

const makeSut = () => new CouponsRepository(connectionMock);

describe("CouponsRepository", () => {
  describe("findByCode", () => {
    it("Should call Repository.findOneBy", async () => {
      const sut = makeSut();
      await sut.findByCode(fakeCoupon.code);
      expect(couponsRepositoryMock.findOneBy).toHaveBeenCalledTimes(1);
    });

    it("Should throw if Repository.findOneBy throws", async () => {
      const sut = makeSut();
      jest.spyOn(couponsRepositoryMock, "findOneBy").mockRejectedValueOnce(new Error());
      await expect(sut.findByCode(fakeCoupon.code)).rejects.toThrow();
    });

    it("Should return a coupon on success", async () => {
      const sut = makeSut();
      const foundCoupon = await sut.findByCode(fakeCoupon.code);
      expect(foundCoupon).toEqual(fakeCoupon);
    });

    it("Should not return a coupon if code not exists", async () => {
      const sut = makeSut();
      couponsRepositoryMock.findOneBy.mockResolvedValueOnce(null);
      const noneCoupon = await sut.findByCode(fakeCoupon.code);
      expect(noneCoupon).toBeFalsy();
    });
  });
});
