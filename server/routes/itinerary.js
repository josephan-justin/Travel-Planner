const router = require('express').Router()
const Controller = require('../controllers/itineraryController');

router.get("/:travelPlanId", Controller.getItineraries);
router.post("/:travelPlanId", Controller.createItinerary);
router.put("/:id", Controller.updateItinerary);
router.delete("/:id", Controller.deleteItinerary);

module.exports = router