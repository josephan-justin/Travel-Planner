const { TravelPlan } = require("../models");

async function authorization(req, res, next) {
  try {
    const { userId } = req.loginInfo;

    const { id } = req.params;
    const travelPlan = await TravelPlan.findByPk(id);
    if (!travelPlan)
      throw {
        name: "NotFound",
      };

    if (travelPlan.UserId !== userId)
      throw {
        name: "Forbidden",
      };

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = authorization;
