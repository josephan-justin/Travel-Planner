const router = require('express').Router()

const profileRouter = require('./profile')
const travelPlanRouter = require('./travelPlan')
const itineraryRouter = require('./itinerary')
const Controller = require('../controllers/userController')
const authentication = require('../middlewares/authentication')

router.post('/register', Controller.register)
router.post('/login', Controller.login)
router.post('/google-login', Controller.googleLogin)

router.use(authentication)

router.use('/profile', profileRouter)
router.use('/travel-plan', travelPlanRouter)
router.use('/itinerary', itineraryRouter)


module.exports = router