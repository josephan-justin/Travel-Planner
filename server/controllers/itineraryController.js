const { Itinerary, TravelPlan } = require("../models");

class Controller {
  static async getItineraries(req, res, next) {
    try {
      const { travelPlanId } = req.params;

      const travelPlan = await TravelPlan.findByPk(travelPlanId);

      if (!travelPlan) {
        throw {
          name: "NotFound",
        };
      }

      if (travelPlan.UserId !== req.loginInfo.userId) {
        throw {
          name: "Forbidden",
        };
      }

      const itineraries = await Itinerary.findAll({
        where: {
          TravelPlanId: travelPlanId,
        },
        order: [["day", "ASC"]],
      });

      res.status(200).json({
        message: "Success read itineraries",
        itineraries,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async createItinerary(req, res, next) {
    try {
      const { travelPlanId } = req.params;
      const { day, title, activities } = req.body;
      
      const travelPlan = await TravelPlan.findByPk(travelPlanId);

      if (!travelPlan) {
        throw {
          name: "NotFound",
        };
      }

      if (travelPlan.UserId !== req.loginInfo.userId) {
        throw {
          name: "Forbidden",
        };
      }

      const itinerary = await Itinerary.create({
        TravelPlanId: travelPlanId,
        day,
        title,
        activities,
      });

      res.status(201).json({
        message: "Success create itinerary",
        itinerary,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async updateItinerary(req, res, next) {
    try {
      const { id } = req.params;
      const { day, title, activities } = req.body;

      const itinerary = await Itinerary.findByPk(id);

      if (!itinerary) {
        throw {
          name: "NotFound",
        };
      }

      const travelPlan = await TravelPlan.findByPk(itinerary.TravelPlanId);

      if (!travelPlan) {
        throw {
          name: "NotFound",
        };
      }

      if (travelPlan.UserId !== req.loginInfo.userId) {
        throw { name: "Forbidden" };
      }

      await itinerary.update({
        day,
        title,
        activities,
      });

      res.status(200).json({
        message: "Success update itinerary",
        itinerary,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async deleteItinerary(req, res, next) {
    try {
      const { id } = req.params;

      const itinerary = await Itinerary.findByPk(id);

      if (!itinerary) {
        throw {
          name: "NotFound",
        };
      }

      const travelPlan = await TravelPlan.findByPk(itinerary.TravelPlanId);

      if (!travelPlan) {
        throw {
          name: "NotFound",
        };
      }

      if (travelPlan.UserId !== req.loginInfo.userId) {
        throw { name: "Forbidden" };
      }

      await itinerary.destroy();

      res.status(200).json({
        message: "Success delete itinerary",
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

module.exports = Controller;
