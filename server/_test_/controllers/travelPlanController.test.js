const Controller = require("../../controllers/travelPlanController");

const { TravelPlan, Itinerary, sequelize } = require("../../models");
const { GoogleGenAI } = require("@google/genai");
const puppeteer = require("puppeteer");
const ejs = require("ejs");

jest.mock("../../models", () => ({
  TravelPlan: {
    findAll: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    destroy: jest.fn(),
  },
  Itinerary: {
    create: jest.fn(),
  },
  sequelize: {
    transaction: jest.fn(),
  },
}));

jest.mock("../../helpers/formatDestination", () =>
  jest.fn((destination) => `Formatted ${destination}`),
);

jest.mock("../../helpers/formatBuget", () =>
  jest.fn((budget) => `Rp ${budget}`),
);

jest.mock("@google/genai", () => ({
  GoogleGenAI: jest.fn(),
}));

jest.mock("puppeteer", () => ({
  launch: jest.fn(),
}));

jest.mock("ejs", () => ({
  renderFile: jest.fn(),
}));

describe("TravelPlan Controller", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      loginInfo: {
        userId: 1,
      },
      params: {},
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      setHeader: jest.fn(),
      send: jest.fn(),
    };

    next = jest.fn();
  });

  // =========================================================
  // GET TRAVEL PLANS
  // =========================================================

  describe("getTravelPlans", () => {
    test("should get travel plans successfully", async () => {
      const travelPlan = [
        {
          id: 1,
          UserId: 1,
          title: "Bali Trip",
        },
      ];

      TravelPlan.findAll.mockResolvedValue(travelPlan);

      await Controller.getTravelPlans(req, res, next);

      expect(TravelPlan.findAll).toHaveBeenCalledWith({
        where: {
          UserId: 1,
        },
        order: [["destination", "ASC"]],
      });

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        message: "Success read travel plans",
        travelPlan,
      });

      expect(next).not.toHaveBeenCalled();
    });

    test("should call next when findAll fails", async () => {
      const error = new Error("Database error");

      TravelPlan.findAll.mockRejectedValue(error);

      await Controller.getTravelPlans(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // =========================================================
  // CREATE TRAVEL PLAN
  // =========================================================

  describe("createTravelPlan", () => {
    test("should create travel plan successfully", async () => {
      req.body = {
        title: "Bali Trip",
        destination: "Bali",
        duration: 5,
        budget: 5000000,
        travelStyle: "Relax",
        budgetBreakdown: {
          accommodation: 2000000,
        },
        travelTips: ["Bring sunscreen"],
      };

      const travelPlan = {
        id: 1,
        UserId: 1,
        title: "Bali Trip",
      };

      TravelPlan.create.mockResolvedValue(travelPlan);

      await Controller.createTravelPlan(req, res, next);

      expect(TravelPlan.create).toHaveBeenCalledWith({
        UserId: 1,
        title: "Bali Trip",
        destination: "Formatted Bali",
        duration: 5,
        budget: 5000000,
        travelStyle: "Relax",
        budgetBreakdown: {
          accommodation: 2000000,
        },
        travelTips: ["Bring sunscreen"],
      });

      expect(res.status).toHaveBeenCalledWith(201);

      expect(res.json).toHaveBeenCalledWith({
        message: "Success create new Travel Plan",
        travelPlan,
      });
    });

    test("should call next when create fails", async () => {
      const error = new Error("Create failed");

      TravelPlan.create.mockRejectedValue(error);

      await Controller.createTravelPlan(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // =========================================================
  // GENERATE
  // =========================================================

  describe("generate", () => {
    test("should generate travel plan in English", async () => {
      req.body = {
        destination: "Bali",
        duration: 5,
        budget: 5000000,
        travelStyle: "Relax",
        language: "en",
      };

      const generatedPlan = {
        trip_title: "Bali Adventure",
        destination: "Bali",
        duration: "5 days",
        travel_style: "Relax",
        itinerary: [],
        budget_breakdown: {
          currency: "IDR",
          total_budget: 5000000,
          categories: [],
        },
        travel_tips: [],
      };

      const mockInteraction = {
        output_text: JSON.stringify(generatedPlan),
      };

      const mockCreate = jest.fn().mockResolvedValue(mockInteraction);

      GoogleGenAI.mockImplementation(() => ({
        interactions: {
          create: mockCreate,
        },
      }));

      await Controller.generate(req, res, next);

      expect(GoogleGenAI).toHaveBeenCalledWith({
        apiKey: process.env.GEMINI_API_KEY,
      });

      expect(mockCreate).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        message: "Success generate travel plan",
        travelPlan: {
          ...generatedPlan,
          language: "en",
        },
      });
    });

    test("should generate travel plan in Indonesian", async () => {
      req.body = {
        destination: "Bali",
        duration: 3,
        budget: 3000000,
        travelStyle: "Culture",
        language: "id",
      };

      const generatedPlan = {
        trip_title: "Liburan Bali",
        destination: "Bali",
        duration: "3 days",
        travel_style: "Culture",
        itinerary: [],
        budget_breakdown: {
          currency: "IDR",
          total_budget: 3000000,
          categories: [],
        },
        travel_tips: [],
      };

      GoogleGenAI.mockImplementation(() => ({
        interactions: {
          create: jest.fn().mockResolvedValue({
            output_text: JSON.stringify(generatedPlan),
          }),
        },
      }));

      await Controller.generate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        message: "Success generate travel plan",
        travelPlan: {
          ...generatedPlan,
          language: "id",
        },
      });
    });

    test("should call next when AI generation fails", async () => {
      const error = new Error("AI error");

      GoogleGenAI.mockImplementation(() => ({
        interactions: {
          create: jest.fn().mockRejectedValue(error),
        },
      }));

      await Controller.generate(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    test("should call next when generated JSON is invalid", async () => {
      GoogleGenAI.mockImplementation(() => ({
        interactions: {
          create: jest.fn().mockResolvedValue({
            output_text: "invalid json",
          }),
        },
      }));

      await Controller.generate(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  // =========================================================
  // SAVE
  // =========================================================

  describe("save", () => {
    test("should save generated travel plan and itineraries successfully", async () => {
      req.body = {
        trip_title: "Bali Adventure",
        destination: "Bali",
        duration: "5",
        travel_style: "Relax",
        language: "en",
        itinerary: [
          {
            day: 1,
            title: "Beach Day",
            activities: [
              {
                time: "10:00",
                activity: "Visit beach",
              },
            ],
          },
          {
            day: 2,
            title: "Temple Day",
            activities: [],
          },
        ],
        budget_breakdown: {
          total_budget: 5000000,
        },
        travel_tips: ["Bring sunscreen"],
      };

      const travelPlan = {
        id: 10,
        UserId: 1,
        title: "Bali Adventure",
      };

      TravelPlan.create.mockResolvedValue(travelPlan);

      sequelize.transaction.mockImplementation(async (callback) => {
        return callback("transaction");
      });

      Itinerary.create.mockResolvedValue({});

      await Controller.save(req, res, next);

      expect(TravelPlan.create).toHaveBeenCalledWith(
        {
          UserId: 1,
          title: "Bali Adventure",
          destination: "Formatted Bali",
          duration: 5,
          budget: 5000000,
          travelStyle: "Relax",
          language: "en",
          budgetBreakdown: {
            total_budget: 5000000,
          },
          travelTips: ["Bring sunscreen"],
        },
        {
          transaction: "transaction",
        },
      );

      expect(Itinerary.create).toHaveBeenCalledTimes(2);

      expect(res.status).toHaveBeenCalledWith(201);

      expect(res.json).toHaveBeenCalledWith({
        message: "Success save generated travel plan",
        travelPlan,
      });
    });

    test("should call next when save transaction fails", async () => {
      const error = new Error("Transaction failed");

      sequelize.transaction.mockRejectedValue(error);

      await Controller.save(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    test("should call next when itinerary creation fails", async () => {
      const error = new Error("Itinerary failed");

      req.body = {
        trip_title: "Bali Adventure",
        destination: "Bali",
        duration: "5",
        travel_style: "Relax",
        language: "en",
        itinerary: [
          {
            day: 1,
            title: "Beach Day",
            activities: [],
          },
        ],
        budget_breakdown: {
          total_budget: 5000000,
        },
        travel_tips: [],
      };

      TravelPlan.create.mockResolvedValue({
        id: 10,
      });

      sequelize.transaction.mockImplementation(async (callback) => {
        return callback("transaction");
      });

      Itinerary.create.mockRejectedValue(error);

      await Controller.save(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // =========================================================
  // GET BY ID
  // =========================================================

  describe("getById", () => {
    test("should get travel plan by id successfully", async () => {
      req.params.id = 1;

      const travelPlan = {
        id: 1,
        title: "Bali Trip",
        Itineraries: [],
      };

      TravelPlan.findByPk.mockResolvedValue(travelPlan);

      await Controller.getById(req, res, next);

      expect(TravelPlan.findByPk).toHaveBeenCalledWith(1, {
        include: {
          model: Itinerary,
        },
      });

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        travelPlan,
      });
    });

    test("should return NotFound when travel plan does not exist", async () => {
      req.params.id = 999;

      TravelPlan.findByPk.mockResolvedValue(null);

      await Controller.getById(req, res, next);

      expect(next).toHaveBeenCalledWith({
        name: "NotFound",
      });
    });

    test("should call next when findByPk fails", async () => {
      const error = new Error("Database error");

      TravelPlan.findByPk.mockRejectedValue(error);

      await Controller.getById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // =========================================================
  // EXPORT PDF
  // =========================================================

  describe("exportPDF", () => {
    test("should export travel plan as PDF successfully", async () => {
      req.params.id = 1;

      const travelPlan = {
        id: 1,
        title: "Bali Trip",
      };

      TravelPlan.findByPk.mockResolvedValue(travelPlan);

      ejs.renderFile.mockResolvedValue("<html>Bali Trip</html>");

      const mockPdf = Buffer.from("PDF DATA");

      const mockPage = {
        setContent: jest.fn().mockResolvedValue(),
        pdf: jest.fn().mockResolvedValue(mockPdf),
      };

      const mockBrowser = {
        newPage: jest.fn().mockResolvedValue(mockPage),
        close: jest.fn().mockResolvedValue(),
      };

      puppeteer.launch.mockResolvedValue(mockBrowser);

      await Controller.exportPDF(req, res, next);

      expect(TravelPlan.findByPk).toHaveBeenCalledWith(1, {
        include: {
          model: Itinerary,
        },
      });

      expect(ejs.renderFile).toHaveBeenCalled();

      expect(puppeteer.launch).toHaveBeenCalled();

      expect(mockPage.setContent).toHaveBeenCalledWith(
        "<html>Bali Trip</html>",
        {
          waitUntil: "networkidle0",
        },
      );

      expect(mockPage.pdf).toHaveBeenCalledWith({
        format: "A4",
        printBackground: true,
      });

      expect(mockBrowser.close).toHaveBeenCalled();

      expect(res.setHeader).toHaveBeenCalledWith(
        "Content-Type",
        "application/pdf",
      );

      expect(res.setHeader).toHaveBeenCalledWith(
        "Content-Disposition",
        'attachment; filename="Bali Trip.pdf"',
      );

      expect(res.send).toHaveBeenCalledWith(mockPdf);
    });

    test("should return NotFound when travel plan does not exist", async () => {
      req.params.id = 999;

      TravelPlan.findByPk.mockResolvedValue(null);

      await Controller.exportPDF(req, res, next);

      expect(next).toHaveBeenCalledWith({
        name: "NotFound",
      });
    });

    test("should call next when PDF generation fails", async () => {
      const error = new Error("PDF error");

      TravelPlan.findByPk.mockResolvedValue({
        id: 1,
        title: "Bali Trip",
      });

      ejs.renderFile.mockRejectedValue(error);

      await Controller.exportPDF(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // =========================================================
  // UPDATE
  // =========================================================

  describe("update", () => {
    test("should update travel plan successfully", async () => {
      req.params.id = 1;

      req.body = {
        title: "Updated Bali Trip",
        destination: "Bali",
        duration: 7,
        budget: 7000000,
        travelStyle: "Adventure",
        budgetBreakdown: {
          accommodation: 3000000,
        },
        travelTips: ["Bring water"],
      };

      const travelPlan = {
        id: 1,
        update: jest.fn().mockResolvedValue(),
      };

      TravelPlan.findByPk.mockResolvedValue(travelPlan);

      await Controller.update(req, res, next);

      expect(TravelPlan.findByPk).toHaveBeenCalledWith(1);

      expect(travelPlan.update).toHaveBeenCalledWith({
        title: "Updated Bali Trip",
        destination: "Formatted Bali",
        duration: 7,
        budget: 7000000,
        travelStyle: "Adventure",
        budgetBreakdown: {
          accommodation: 3000000,
        },
        travelTips: ["Bring water"],
      });

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        message: "Success update Travel Plan",
        travelPlan,
      });
    });

    test("should return NotFound when travel plan does not exist", async () => {
      req.params.id = 999;

      TravelPlan.findByPk.mockResolvedValue(null);

      await Controller.update(req, res, next);

      expect(next).toHaveBeenCalledWith({
        name: "NotFound",
      });
    });

    test("should call next when update fails", async () => {
      const error = new Error("Update failed");

      TravelPlan.findByPk.mockResolvedValue({
        id: 1,
        update: jest.fn().mockRejectedValue(error),
      });

      await Controller.update(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // =========================================================
  // DELETE
  // =========================================================

  describe("delete", () => {
    test("should delete travel plan successfully", async () => {
      req.params.id = 1;

      TravelPlan.findByPk.mockResolvedValue({
        id: 1,
      });

      TravelPlan.destroy.mockResolvedValue(1);

      await Controller.delete(req, res, next);

      expect(TravelPlan.findByPk).toHaveBeenCalledWith(1);

      expect(TravelPlan.destroy).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
      });

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        message: "Success delete Travel Plan",
      });
    });

    test("should return NotFound when travel plan does not exist", async () => {
      req.params.id = 999;

      TravelPlan.findByPk.mockResolvedValue(null);

      await Controller.delete(req, res, next);

      expect(next).toHaveBeenCalledWith({
        name: "NotFound",
      });
    });

    test("should call next when delete fails", async () => {
      const error = new Error("Delete failed");

      TravelPlan.findByPk.mockResolvedValue({
        id: 1,
      });

      TravelPlan.destroy.mockRejectedValue(error);

      await Controller.delete(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});