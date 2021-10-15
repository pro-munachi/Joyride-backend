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

router.route('/').get(protect, getAll)

router.route('/getOrders').get(protect, getAllById)

router.route('/:id').get(protect, getById)

router.route('/dispatch/:id').get(protect, admin, getByIdAndDispatch)

router.route('/user/:id').get(protect, getUserOrders)

router.route('/orderProducts').post(protect, placeOrder)

module.exports = router
