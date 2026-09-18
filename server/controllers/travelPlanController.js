const formatBudget = require("../helpers/formatBuget");
const formatDestination = require("../helpers/formatDestination");
const { TravelPlan, Itinerary, sequelize } = require("../models");
const { GoogleGenAI } = require("@google/genai");
const puppeteer = require("puppeteer");
const ejs = require("ejs");
const path = require("path");

class Controller {
  static async getTravelPlans(req, res, next) {
    try {
      const { userId } = req.loginInfo;
      const travelPlan = await TravelPlan.findAll({
        where: {
          UserId: userId,
        },
        order: [["destination", "ASC"]],
      });

      res.status(200).json({
        message: "Success read travel plans",
        travelPlan,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async createTravelPlan(req, res, next) {
    try {
      const { userId } = req.loginInfo;
      const {
        title,
        destination,
        duration,
        budget,
        travelStyle,
        budgetBreakdown,
        travelTips,
      } = req.body;

      const travelPlan = await TravelPlan.create({
        UserId: userId,
        title,
        destination: formatDestination(destination),
        duration,
        budget,
        travelStyle,
        budgetBreakdown,
        travelTips,
      });

      res.status(201).json({
        message: "Success create new Travel Plan",
        travelPlan,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async generate(req, res, next) {
    try {
      const { destination, duration, budget, travelStyle, language } = req.body;

      const prompt = `
      Create a travel itinerary with the following details:

      Destination: ${destination}
      Duration: ${duration} days
      Budget: ${budget}
      Travel style: ${travelStyle}

      Write the entire travel plan in ${
        language === "id" ? "Indonesian" : "English"
      }.

      Give me:
      - Trip title
      - Itinerary for each day
      - Budget breakdown
      - Travel tips

      Return the result in JSON format.

      The JSON structure must be exactly:
      {
        "trip_title": "string",
        "destination": "string",
        "duration": "string",
        "travel_style": "string",
        "itinerary": [
          {
            "day": 1,
            "title": "string",
            "activities": [
              {
                "time": "string",
                "activity": "string",
                "location": "string",
                "description": "string",
                "estimated_cost_idr": 0
              }
            ]
          }
        ],
        "budget_breakdown": {
          "currency": "IDR",
          "total_budget": 0,
          "categories": [
            {
              "category": "string",
              "estimated_cost": 0,
              "details": "string"
            }
          ]
        },
        "travel_tips": [
          "string"
        ]
      }
    `;

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
      });

      const interaction = await ai.interactions.create({
        model: "gemini-3.6-flash",
        input: prompt,
      });

      const result = interaction.output_text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const travelPlan = JSON.parse(result);

      // language dari request
      travelPlan.language = language;

      res.status(200).json({
        message: "Success generate travel plan",
        travelPlan,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async save(req, res, next) {
    try {
      const { userId } = req.loginInfo;

      const {
        trip_title,
        destination,
        duration,
        travel_style,
        language,
        itinerary,
        budget_breakdown,
        travel_tips,
      } = req.body;

      const travelPlan = await sequelize.transaction(async (transaction) => {
        const newTravelPlan = await TravelPlan.create(
          {
            UserId: userId,
            title: trip_title,
            destination: formatDestination(destination),
            duration: parseInt(duration),
            budget: budget_breakdown.total_budget,
            travelStyle: travel_style,
            language,
            budgetBreakdown: budget_breakdown,
            travelTips: travel_tips,
          },
          { transaction },
        );

        for (const item of itinerary) {
          await Itinerary.create(
            {
              TravelPlanId: newTravelPlan.id,
              day: item.day,
              title: item.title,
              activities: item.activities,
            },
            { transaction },
          );
        }

        return newTravelPlan;
      });

      res.status(201).json({
        message: "Success save generated travel plan",
        travelPlan,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const travelPlan = await TravelPlan.findByPk(id, {
        include: {
          model: Itinerary,
        },
      });

      if (!travelPlan)
        throw {
          name: "NotFound",
        };

      res.status(200).json({
        travelPlan,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async exportPDF(req, res, next) {
    try {
      const { id } = req.params;
      const travelPlan = await TravelPlan.findByPk(id, {
        include: {
          model: Itinerary,
        },
      });

      if (!travelPlan)
        throw {
          name: "NotFound",
        };

      const html = await ejs.renderFile(
        path.join(__dirname, "../views/travelPlanPDF.ejs"),
        { travelPlan },
      );

      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      const page = await browser.newPage();

      await page.setContent(html, {
        waitUntil: "networkidle0",
      });

      const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
      });

      await browser.close();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${travelPlan.title}.pdf"`,
      );

      res.send(pdf);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const {
        title,
        destination,
        duration,
        budget,
        travelStyle,
        budgetBreakdown,
        travelTips,
      } = req.body;

      const travelPlan = await TravelPlan.findByPk(id);

      if (!travelPlan)
        throw {
          name: "NotFound",
        };

      await travelPlan.update({
        title,
        destination: formatDestination(destination),
        duration,
        budget,
        travelStyle,
        budgetBreakdown,
        travelTips,
      });

      res.status(200).json({
        message: "Success update Travel Plan",
        travelPlan,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const travelPlan = await TravelPlan.findByPk(id);

      if (!travelPlan)
        throw {
          name: "NotFound",
        };

      await TravelPlan.destroy({
        where: {
          id,
        },
      });

      res.status(200).json({
        message: "Success delete Travel Plan",
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

module.exports = Controller;
