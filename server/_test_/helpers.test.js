const formatBudget = require("../helpers/formatBuget");
const formatDate = require("../helpers/formatDate");
const formatDestination = require("../helpers/formatDestination");
const { signToken, verifyToken } = require("../helpers/jwt");

describe("Helpers", () => {
  afterAll(async () => {
    const { sequelize } = require("../models");
    await sequelize.close();
  });

  describe("formatBudget", () => {
    test("returns numeric value from string with non-digits stripped", () => {
      expect(formatBudget("Rp 1.500.000")).toBe(1500000);
    });

    test("returns numeric value when given a number", () => {
      expect(formatBudget(5000000)).toBe(5000000);
    });

    test("returns 0 when no digits exist", () => {
      expect(formatBudget("abc")).toBe(0);
    });
  });

  describe("formatDate", () => {
    test("returns date in YYYY-MM-DD format", () => {
      expect(formatDate("2026-08-13T00:00:00.000Z")).toBe("2026-08-13");
    });

    test("works with a Date object", () => {
      expect(formatDate(new Date("2026-01-15T00:00:00.000Z"))).toBe(
        "2026-01-15",
      );
    });
  });

  describe("formatDestination", () => {
    test("capitalizes first letter of each word", () => {
      expect(formatDestination("bali indonesia")).toBe("Bali Indonesia");
    });

    test("handles single word", () => {
      expect(formatDestination("japan")).toBe("Japan");
    });
  });

  describe("JWT helpers", () => {
    test("signToken creates a token that verifyToken can decode", () => {
      process.env.JWT_SECRET = "test-secret";
      const payload = { id: 1, email: "test@mail.com" };
      const token = signToken(payload);

      expect(typeof token).toBe("string");
      const decoded = verifyToken(token);
      expect(decoded.id).toBe(1);
      expect(decoded.email).toBe("test@mail.com");
    });

    test("verifyToken throws on invalid token", () => {
      process.env.JWT_SECRET = "test-secret";
      expect(() => verifyToken("invalid.token.here")).toThrow();
    });
  });
});