const router = require("express").Router();
const Controller = require("../controllers/travelPlanController");
const authorization = require("../middlewares/authorization");

router.get("/", Controller.getTravelPlans);
router.post("/", Controller.createTravelPlan);
router.post("/generate", Controller.generate);
router.post("/save", Controller.save);
router.get("/:id/export", authorization,Controller.exportPDF);
router.get("/:id", authorization, Controller.getById);
router.put("/:id", authorization, Controller.update);
router.delete("/:id", authorization, Controller.delete);

module.exports = router;
