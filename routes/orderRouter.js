const router = require('express').Router()
const {
  placeOrder,
  getById,
  getAll,
  getAllById,
} = require('../controllers/orderController')
const { protect } = require('../middleware/authMiddleware')

router.route('/').get(protect, getAll)
router.route('/getOrders').get(protect, getAllById)
router.route('/:id').get(protect, getById)
router.route('/orderProducts').post(protect, placeOrder)

module.exports = router
