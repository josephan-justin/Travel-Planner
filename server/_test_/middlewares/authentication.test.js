const authentication = require("../../middlewares/authentication");
const { User } = require("../../models");
const { verifyToken } = require("../../helpers/jwt");

jest.mock("../../models", () => ({
  User: {
    findByPk: jest.fn(),
  },
}));

jest.mock("../../helpers/jwt", () => ({
  verifyToken: jest.fn(),
}));

describe("authentication middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should add loginInfo when token is valid", async () => {
    const req = {
      headers: {
        authorization: "Bearer valid-token",
      },
      query: {},
    };

    const res = {};
    const next = jest.fn();

    verifyToken.mockReturnValue({
      id: 1,
    });

    User.findByPk.mockResolvedValue({
      id: 1,
      email: "test@mail.com",
    });

    await authentication(req, res, next);

    expect(verifyToken).toHaveBeenCalledWith("valid-token");

    expect(User.findByPk).toHaveBeenCalledWith(1);

    expect(req.loginInfo).toEqual({
      userId: 1,
      email: "test@mail.com",
    });

    expect(next).toHaveBeenCalled();
  });

  test("should call next with Unauthorized when token is missing", async () => {
    const req = {
      headers: {},
      query: {},
    };

    const res = {};
    const next = jest.fn();

    await authentication(req, res, next);

    expect(next).toHaveBeenCalledWith({
      name: "Unauthorized",
    });
  });

  test("should use access_token from query when authorization header is missing", async () => {
    const req = {
      headers: {},
      query: {
        access_token: "query-token",
      },
    };

    const res = {};
    const next = jest.fn();

    verifyToken.mockReturnValue({
      id: 1,
    });

    User.findByPk.mockResolvedValue({
      id: 1,
      email: "test@mail.com",
    });

    await authentication(req, res, next);

    expect(verifyToken).toHaveBeenCalledWith("query-token");

    expect(req.loginInfo).toEqual({
      userId: 1,
      email: "test@mail.com",
    });

    expect(next).toHaveBeenCalled();
  });

  test("should call next with Unauthorized when user does not exist", async () => {
    const req = {
      headers: {
        authorization: "Bearer valid-token",
      },
      query: {},
    };

    const res = {};
    const next = jest.fn();

    verifyToken.mockReturnValue({
      id: 999,
    });

    User.findByPk.mockResolvedValue(null);

    await authentication(req, res, next);

    expect(next).toHaveBeenCalledWith({
      name: "Unauthorized",
    });
  });
});