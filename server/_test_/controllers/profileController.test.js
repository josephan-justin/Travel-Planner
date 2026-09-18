const Controller = require("../../controllers/profileController");
const { Profile } = require("../../models");

jest.mock("../../models", () => ({
  Profile: {
    findOne: jest.fn(),
  },
  User: {},
}));

describe("Profile Controller", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      loginInfo: {
        userId: 1,
      },
      body: {
        fullName: "John Doe",
        address: "Jakarta",
        phone: "08123456789",
        birthDate: "1999-01-01",
        gender: "Male",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    jest.clearAllMocks();
  });

  describe("getProfile", () => {
    test("should get profile successfully", async () => {
      const profile = {
        id: 1,
        UserId: 1,
        fullName: "John Doe",
      };

      Profile.findOne.mockResolvedValue(profile);

      await Controller.getProfile(req, res, next);

      expect(Profile.findOne).toHaveBeenCalledWith({
        where: {
          UserId: 1,
        },
      });

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        message: "Success read profile",
        profile,
      });

      expect(next).not.toHaveBeenCalled();
    });

    test("should return NotFound when profile does not exist", async () => {
      Profile.findOne.mockResolvedValue(null);

      await Controller.getProfile(req, res, next);

      expect(Profile.findOne).toHaveBeenCalledWith({
        where: {
          UserId: 1,
        },
      });

      expect(next).toHaveBeenCalledWith({
        name: "NotFound",
      });

      expect(res.status).not.toHaveBeenCalled();
    });

    test("should call next when database error occurs", async () => {
      const error = new Error("Database error");

      Profile.findOne.mockRejectedValue(error);

      await Controller.getProfile(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("updateProfile", () => {
    test("should update profile successfully", async () => {
      const profile = {
        id: 1,
        UserId: 1,
        update: jest.fn().mockResolvedValue(true),
      };

      Profile.findOne.mockResolvedValue(profile);

      await Controller.updateProfile(req, res, next);

      expect(Profile.findOne).toHaveBeenCalledWith({
        where: {
          UserId: 1,
        },
      });

      expect(profile.update).toHaveBeenCalledWith({
        fullName: "John Doe",
        address: "Jakarta",
        phone: "08123456789",
        birthDate: "1999-01-01",
        gender: "Male",
      });

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        message: "Profile updated successfully",
        profile,
      });

      expect(next).not.toHaveBeenCalled();
    });

    test("should return NotFound when profile does not exist", async () => {
      Profile.findOne.mockResolvedValue(null);

      await Controller.updateProfile(req, res, next);

      expect(next).toHaveBeenCalledWith({
        name: "NotFound",
      });

      expect(res.status).not.toHaveBeenCalled();
    });

    test("should call next when database error occurs", async () => {
      const error = new Error("Database error");

      Profile.findOne.mockRejectedValue(error);

      await Controller.updateProfile(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    test("should call next when profile update fails", async () => {
      const error = new Error("Update failed");

      const profile = {
        id: 1,
        UserId: 1,
        update: jest.fn().mockRejectedValue(error),
      };

      Profile.findOne.mockResolvedValue(profile);

      await Controller.updateProfile(req, res, next);

      expect(profile.update).toHaveBeenCalled();

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});