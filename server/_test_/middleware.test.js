const errorHandler = require("../middlewares/errorHandler");

describe("errorHandler middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  test("returns 500 for unknown error", () => {
    errorHandler(new Error("boom"), req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
  });

  test("returns 400 for SequelizeValidationError", () => {
    const err = { name: "SequelizeValidationError", errors: [{ message: "Title Required!" }] };
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Title Required!" });
  });

  test("returns 400 for SequelizeUniqueConstraintError", () => {
    const err = { name: "SequelizeUniqueConstraintError", errors: [{ message: "Email must be unique" }] };
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Email must be unique" });
  });

  test("returns 400 for SequelizeDatabaseError", () => {
    const err = { name: "SequelizeDatabaseError" };
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid input" });
  });

  test("returns 400 for SequelizeForeignKeyConstraintError", () => {
    const err = { name: "SequelizeForeignKeyConstraintError" };
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid input" });
  });

  test("returns 400 for BadRequest", () => {
    errorHandler({ name: "BadRequest" }, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Please input email or password" });
  });

  test("returns 401 for LoginError", () => {
    errorHandler({ name: "LoginError" }, req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid email or password" });
  });

  test("returns 401 for Unauthorized", () => {
    errorHandler({ name: "Unauthorized" }, req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Please login first" });
  });

  test("returns 401 for JsonWebTokenError", () => {
    errorHandler({ name: "JsonWebTokenError" }, req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Please login first" });
  });

  test("returns 403 for Forbidden", () => {
    errorHandler({ name: "Forbidden" }, req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "You dont have any access" });
  });

  test("returns 404 for NotFound", () => {
    errorHandler({ name: "NotFound" }, req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Data not found" });
  });
});