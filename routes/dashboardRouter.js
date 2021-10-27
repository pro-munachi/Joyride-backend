const router = require('express').Router()
const {
  todaysOrder,
  todaysPrice,
  totalPrice,
  chartOrder,
} = require('../controllers/dashboardController')
const { protect, admin } = require('../middleware/authMiddleware')

router.route('/totalprice').get(protect, totalPrice)
router.route('/today').get(protect, todaysOrder)
router.route('/today/price').get(protect, todaysPrice)
router.route('/chart').get(protect, chartOrder)

module.exports = router
