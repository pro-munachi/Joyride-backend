const router = require('express').Router()
const {
  placeOrder,
  getById,
  getAll,
  getAllById,
  getByIdAndDispatch,
  getUserOrders,
} = require('../controllers/orderController')
const { protect, admin } = require('../middleware/authMiddleware')

router.route('/').get(protect, admin, getAll)
router.route('/getOrders').get(protect, admin, getAllById)
router.route('/getUser').get(protect, admin, getUserOrders)
router.route('/:id').get(protect, admin, getById)
router.route('/dispatch/:id').get(protect, admin, getByIdAndDispatch)
router.route('/orderProducts').post(protect, placeOrder)

module.exports = router
