const router = require('express').Router()
const Controller = require('../controllers/profileController');
const authorization = require('../middlewares/authorization');

router.get("/", Controller.getProfile);
router.put("/", Controller.updateProfile);

module.exports = router