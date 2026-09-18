const request = require("supertest");
const app = require("../app");
const {
  sequelize,
  User,
  Profile,
  TravelPlan,
  Itinerary,
} = require("../models");
const bcrypt = require("bcryptjs");
const { signToken } = require("../helpers/jwt");

jest.mock("@google/genai", () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    interactions: {
      create: jest.fn().mockResolvedValue({
        output_text: JSON.stringify({
          trip_title: "AI Generated Trip",
          destination: "Bali",
          duration: "3",
          travel_style: "Adventure",
          itinerary: [{ day: 1, title: "Day 1", activities: [] }],
          budget_breakdown: {
            currency: "IDR",
            total_budget: 1000000,
            categories: [],
          },
          travel_tips: ["Drink lots of water"],
        }),
      }),
    },
  })),
}));

let userToken;
let userId;
let travelPlanId;
let itineraryId;
let otherUserId;

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

const otherUser = {
  username: "otheruser",
  email: "other@mail.com",
  password: "password123",
  fullName: "Other User",
};

const validTravelPlan = {
  title: "Bali Trip",
  destination: "bali indonesia",
  duration: 5,
  budget: 5000000,
  travelStyle: "Adventure",
  language: "en",
};

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Authentication & User", () => {
  test("POST /register - success", async () => {
    const res = await request(app).post("/register").send(testUser).expect(201);

    expect(res.body.message).toBe("Success create new user");
    expect(res.body.user.username).toBe("testuser");
    expect(res.body.user.email).toBe("test@mail.com");
    expect(res.body.user.password).toBeUndefined();
    userId = res.body.user.id;
  });

  test("POST /register - missing fields returns 400", async () => {
    const res = await request(app)
      .post("/register")
      .send({ username: "", email: "", password: "" })
      .expect(400);

    expect(res.body.message).toBe("Please input email or password");
  });

  test("POST /login - success", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: testUser.email, password: testUser.password })
      .expect(200);

    expect(res.body.access_token).toBeDefined();
    userToken = res.body.access_token;
  });

  test("POST /login - missing fields returns 400", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: "", password: "" })
      .expect(400);

    expect(res.body.message).toBe("Please input email or password");
  });

  test("POST /login - wrong password returns 401", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: testUser.email, password: "wrongpass123" })
      .expect(401);

    expect(res.body.message).toBe("Invalid email or password");
  });

  test("POST /login - nonexistent email returns 401", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: "nonexistent@mail.com", password: "password123" })
      .expect(401);

    expect(res.body.message).toBe("Invalid email or password");
  });
});

describe("Authentication middleware", () => {
  test("No token returns 401", async () => {
    const res = await request(app).get("/profile").expect(401);
    expect(res.body.message).toBe("Please login first");
  });

  test("Invalid token returns 401", async () => {
    const res = await request(app)
      .get("/profile")
      .set("Authorization", "Bearer invalid.token.here")
      .expect(401);
    expect(res.body.message).toBe("Please login first");
  });
});

describe("Profile", () => {
  test("GET /profile - success", async () => {
    const res = await request(app)
      .get("/profile")
      .set("Authorization", `Bearer ${userToken}`)
      .expect(200);

    expect(res.body.message).toBe("Success read profile");
    expect(res.body.profile.fullName).toBe("Test User");
  });

  test("GET /profile - not found when profile missing", async () => {
    const noProfileUser = await User.create({
      username: "noprofile",
      email: "noprofile@mail.com",
      password: bcrypt.hashSync("password123", 10),
    });
    const token = signToken({
      id: noProfileUser.id,
      email: noProfileUser.email,
    });

    const res = await request(app)
      .get("/profile")
      .set("Authorization", `Bearer ${token}`)
      .expect(404);

    expect(res.body.message).toBe("Data not found");
  });

  test("PUT /profile - success", async () => {
    const res = await request(app)
      .put("/profile")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        fullName: "Updated Name",
        address: "Bandung",
        phone: "08987654321",
        birthDate: "1996-02-02",
        gender: "Female",
      })
      .expect(200);

    expect(res.body.message).toBe("Profile updated successfully");
    expect(res.body.profile.fullName).toBe("Updated Name");
  });

  test("PUT /profile - not found when profile missing", async () => {
    const noProfileUser = await User.create({
      username: "noprofile2",
      email: "noprofile2@mail.com",
      password: bcrypt.hashSync("password123", 10),
    });
    const token = signToken({
      id: noProfileUser.id,
      email: noProfileUser.email,
    });

    const res = await request(app)
      .put("/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        fullName: "No Profile",
      })
      .expect(404);

    expect(res.body.message).toBe("Data not found");
  });
});

describe("Travel Plan", () => {
  test("POST /travel-plan - success", async () => {
    const res = await request(app)
      .post("/travel-plan")
      .set("Authorization", `Bearer ${userToken}`)
      .send(validTravelPlan)
      .expect(201);

    expect(res.body.message).toBe("Success create new Travel Plan");
    expect(res.body.travelPlan.destination).toBe("Bali Indonesia");
    travelPlanId = res.body.travelPlan.id;
  });

  test("GET /travel-plan - success", async () => {
    const res = await request(app)
      .get("/travel-plan")
      .set("Authorization", `Bearer ${userToken}`)
      .expect(200);

    expect(res.body.message).toBe("Success read travel plans");
    expect(res.body.travelPlan.length).toBeGreaterThan(0);
  });

  test("GET /travel-plan/:id - success", async () => {
    const res = await request(app)
      .get(`/travel-plan/${travelPlanId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .expect(200);

    expect(res.body.travelPlan.title).toBe("Bali Trip");
    expect(res.body.travelPlan.Itineraries).toBeDefined();
  });

  test("GET /travel-plan/:id - not found returns 404", async () => {
    const res = await request(app)
      .get("/travel-plan/999999")
      .set("Authorization", `Bearer ${userToken}`)
      .expect(404);

    expect(res.body.message).toBe("Data not found");
  });

  test("PUT /travel-plan/:id - success", async () => {
    const res = await request(app)
      .put(`/travel-plan/${travelPlanId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        ...validTravelPlan,
        title: "Bali Trip Updated",
        destination: "bali",
      })
      .expect(200);

    expect(res.body.message).toBe("Success update Travel Plan");
    expect(res.body.travelPlan.title).toBe("Bali Trip Updated");
  });

  test("PUT /travel-plan/:id - not found returns 404", async () => {
    const res = await request(app)
      .put("/travel-plan/999999")
      .set("Authorization", `Bearer ${userToken}`)
      .send(validTravelPlan)
      .expect(404);

    expect(res.body.message).toBe("Data not found");
  });

  test("DELETE /travel-plan/:id - not found returns 404", async () => {
    const res = await request(app)
      .delete("/travel-plan/999999")
      .set("Authorization", `Bearer ${userToken}`)
      .expect(404);

    expect(res.body.message).toBe("Data not found");
  });
});

describe("Authorization middleware (owner)", () => {
  test("Cannot get travel plan owned by another user", async () => {
    const other = await User.create({
      username: otherUser.username,
      email: otherUser.email,
      password: bcrypt.hashSync(otherUser.password, 10),
    });
    otherUserId = other.id;

    const res = await request(app)
      .get(`/travel-plan/${travelPlanId}`)
      .set(
        "Authorization",
        `Bearer ${signToken({ id: otherUserId, email: otherUser.email })}`,
      )
      .expect(403);

    expect(res.body.message).toBe("You dont have any access");
  });

  test("Cannot delete travel plan owned by another user", async () => {
    const res = await request(app)
      .delete(`/travel-plan/${travelPlanId}`)
      .set(
        "Authorization",
        `Bearer ${signToken({ id: otherUserId, email: otherUser.email })}`,
      )
      .expect(403);

    expect(res.body.message).toBe("You dont have any access");
  });
});

describe("Itinerary", () => {
  test("POST /itinerary/:travelPlanId - success", async () => {
    const res = await request(app)
      .post(`/itinerary/${travelPlanId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        day: 1,
        title: "Beach Day",
        activities: [
          {
            time: "09:00",
            activity: "Visit beach",
            location: "Kuta",
            description: "Enjoy the beach",
            estimated_cost_idr: 50000,
          },
        ],
      })
      .expect(201);

    expect(res.body.message).toBe("Success create itinerary");
    itineraryId = res.body.itinerary.id;
  });

  test("POST /itinerary/:travelPlanId - not found returns 404", async () => {
    const res = await request(app)
      .post("/itinerary/999999")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ day: 1, title: "Test" })
      .expect(404);

    expect(res.body.message).toBe("Data not found");
  });

  test("GET /itinerary/:travelPlanId - success", async () => {
    const res = await request(app)
      .get(`/itinerary/${travelPlanId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .expect(200);

    expect(res.body.message).toBe("Success read itineraries");
    expect(res.body.itineraries.length).toBeGreaterThan(0);
  });

  test("GET /itinerary/:travelPlanId - not found returns 404", async () => {
    const res = await request(app)
      .get("/itinerary/999999")
      .set("Authorization", `Bearer ${userToken}`)
      .expect(404);

    expect(res.body.message).toBe("Data not found");
  });

  test("PUT /itinerary/:id - success", async () => {
    const res = await request(app)
      .put(`/itinerary/${itineraryId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        day: 2,
        title: "Temple Visit",
        activities: [
          {
            time: "10:00",
            activity: "Visit temple",
            location: "Uluwatu",
            description: "See the temple",
            estimated_cost_idr: 75000,
          },
        ],
      })
      .expect(200);

    expect(res.body.message).toBe("Success update itinerary");
    expect(res.body.itinerary.title).toBe("Temple Visit");
  });

  test("PUT /itinerary/:id - not found returns 404", async () => {
    const res = await request(app)
      .put("/itinerary/999999")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ day: 1, title: "Test" })
      .expect(404);

    expect(res.body.message).toBe("Data not found");
  });

  test("PUT /itinerary/:id - forbidden for other user", async () => {
    const res = await request(app)
      .put(`/itinerary/${itineraryId}`)
      .set(
        "Authorization",
        `Bearer ${signToken({ id: otherUserId, email: otherUser.email })}`,
      )
      .send({ day: 1, title: "Hacked" })
      .expect(403);

    expect(res.body.message).toBe("You dont have any access");
  });

  test("DELETE /itinerary/:id - forbidden for other user", async () => {
    const res = await request(app)
      .delete(`/itinerary/${itineraryId}`)
      .set(
        "Authorization",
        `Bearer ${signToken({ id: otherUserId, email: otherUser.email })}`,
      )
      .expect(403);

    expect(res.body.message).toBe("You dont have any access");
  });

  test("DELETE /itinerary/:id - success", async () => {
    const res = await request(app)
      .delete(`/itinerary/${itineraryId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .expect(200);

    expect(res.body.message).toBe("Success delete itinerary");
  });

  test("DELETE /itinerary/:id - not found returns 404", async () => {
    const res = await request(app)
      .delete("/itinerary/999999")
      .set("Authorization", `Bearer ${userToken}`)
      .expect(404);

    expect(res.body.message).toBe("Data not found");
  });
});

describe("Travel Plan generate & save", () => {
  test("POST /travel-plan/generate - success", async () => {
    const res = await request(app)
      .post("/travel-plan/generate")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        destination: "bali",
        duration: 3,
        budget: 1000000,
        travelStyle: "Adventure",
        language: "en",
      })
      .expect(200);

    expect(res.body.message).toBe("Success generate travel plan");
    expect(res.body.travelPlan.trip_title).toBe("AI Generated Trip");
  });

  test("POST /travel-plan/generate - parses JSON with code fences", async () => {
    const { GoogleGenAI } = require("@google/genai");
    GoogleGenAI.mockImplementation(() => ({
      interactions: {
        create: jest.fn().mockResolvedValue({
          output_text:
            '```json\n{"trip_title": "Fenced Trip", "destination": "Bali", "duration": "2", "travel_style": "Relaxation", "itinerary": [], "budget_breakdown": {"currency": "IDR", "total_budget": 500000, "categories": []}, "travel_tips": []}\n```',
        }),
      },
    }));

    const res = await request(app)
      .post("/travel-plan/generate")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        destination: "bali",
        duration: 2,
        budget: 500000,
        travelStyle: "Relaxation",
        language: "id",
      })
      .expect(200);

    expect(res.body.travelPlan.trip_title).toBe("Fenced Trip");
  });

  test("POST /travel-plan/save - success", async () => {
    const res = await request(app)
      .post("/travel-plan/save")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        trip_title: "Saved AI Trip",
        destination: "bali",
        duration: "3",
        travel_style: "Adventure",
        language: "en",
        itinerary: [{ day: 1, title: "Day 1", activities: [] }],
        budget_breakdown: {
          currency: "IDR",
          total_budget: 1000000,
          categories: [],
        },
        travel_tips: ["tip"],
      })
      .expect(201);

    expect(res.body.message).toBe("Success save generated travel plan");
  });
});

describe("Cleanup", () => {
  test("DELETE /travel-plan/:id - success", async () => {
    const res = await request(app)
      .delete(`/travel-plan/${travelPlanId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .expect(200);

    expect(res.body.message).toBe("Success delete Travel Plan");
  });
});
