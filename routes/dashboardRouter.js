const router = require('express').Router()
const {
  todaysOrder,
  todaysPrice,
} = require('../controllers/dashboardController')
const { protect, admin } = require('../middleware/authMiddleware')

router.route('/today').get(protect, todaysOrder)
router.route('/today/price').get(protect, todaysPrice)

module.exports = router
