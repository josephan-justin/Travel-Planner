const errorHandler = require("../../middlewares/errorHandler");

describe("errorHandler middleware", () => {
  test("should send error response with status code", () => {
    const err = {
      name: "NotFound",
    };

    const mockReq = {};
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockNext = jest.fn();

    errorHandler(err, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalled();
  });

  test("should send error response with default 500 status", () => {
    const err = new Error("Test error");

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockNext = jest.fn();

    errorHandler(err, {}, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalled();
  });
});
