const request = require("supertest");
const app = require("../../app");
const { sequelize, User, Profile } = require("../../models");
const bcrypt = require("bcryptjs");

const mockVerifyIdToken = jest.fn();

jest.mock("google-auth-library", () => ({
  OAuth2Client: jest.fn().mockImplementation(() => ({
    verifyIdToken: mockVerifyIdToken,
  })),
}));

const testUser = {
  username: "testuser",
  email: "test@mail.com",
  password: "password123",
  fullName: "Test User",
  address: "Jakarta",
  phone: "08123456789",
  birthDate: "1995-01-01",
  gender: "Male",
};

describe("User Controller", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe("POST /register", () => {
    test("should register user successfully", async () => {
      const res = await request(app)
        .post("/register")
        .send(testUser)
        .expect(201);

      expect(res.body.message).toBe("Success create new user");
      expect(res.body.user.username).toBe("testuser");
      expect(res.body.user.email).toBe("test@mail.com");
      expect(res.body.user.password).toBeUndefined();

      const profile = await Profile.findOne({
        where: {
          UserId: res.body.user.id,
        },
      });

      expect(profile).not.toBeNull();
      expect(profile.fullName).toBe("Test User");
    });

    test("should return 400 when required fields are missing", async () => {
      const res = await request(app)
        .post("/register")
        .send({
          username: "",
          email: "",
          password: "",
        })
        .expect(400);

      expect(res.body.message).toBe("Please input email or password");
    });
  });

  describe("POST /login", () => {
    test("should login successfully", async () => {
      const res = await request(app)
        .post("/login")
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(res.body.access_token).toBeDefined();
      expect(typeof res.body.access_token).toBe("string");
    });

    test("should return 400 when email or password is missing", async () => {
      const res = await request(app)
        .post("/login")
        .send({
          email: "",
          password: "",
        })
        .expect(400);

      expect(res.body.message).toBeDefined();
    });

    test("should return login error when email does not exist", async () => {
      const res = await request(app)
        .post("/login")
        .send({
          email: "notfound@mail.com",
          password: "password123",
        })
        .expect(401);

      expect(res.body.message).toBeDefined();
    });

    test("should return login error when password is wrong", async () => {
      const res = await request(app)
        .post("/login")
        .send({
          email: testUser.email,
          password: "wrongpassword",
        })
        .expect(401);

      expect(res.body.message).toBeDefined();
    });
  });

  describe("POST /google-login", () => {
    beforeEach(() => {
      mockVerifyIdToken.mockReset();
    });

    test("should login successfully with existing Google user", async () => {
      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => ({
          email: testUser.email,
        }),
      });

      const res = await request(app)
        .post("/google-login")
        .set("token", "fake-google-token")
        .expect(200);

      expect(res.body.access_token).toBeDefined();
    });

    test("should create new user and profile with Google login", async () => {
      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => ({
          email: "googleuser@gmail.com",
          name: "Google User",
        }),
      });

      const res = await request(app)
        .post("/google-login")
        .set("token", "fake-google-token")
        .expect(200);

      expect(res.body.access_token).toBeDefined();

      const user = await User.findOne({
        where: {
          email: "googleuser@gmail.com",
        },
      });

      expect(user).not.toBeNull();
    });

    test("should return error when Google token is invalid", async () => {
      mockVerifyIdToken.mockRejectedValue(new Error("Invalid Google token"));

      const res = await request(app)
        .post("/google-login")
        .set("token", "invalid-token")
        .expect(500);

      expect(res.body.message).toBeDefined();
    });
  });
});
