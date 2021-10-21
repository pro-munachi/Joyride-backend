const router = require('express').Router()
const {
  placeOrder,
  getById,
  getAll,
  getAllById,
  getByIdAndDispatch,
  getUserOrders,
  deleteOrder,
  getAllDeleted,
  deleteOrderByUser,
} = require('../controllers/orderController')
const { protect, admin } = require('../middleware/authMiddleware')

router.route('/').get(protect, admin, getAll)

router.route('/deleteByUser').get(protect, getAllDeleted)

router.route('/getOrders').get(protect, getAllById)

router.route('/:id').get(protect, getById)

router.route('/user/:id/delete').get(protect, deleteOrderByUser)

router.route('/dispatch/:id').get(protect, admin, getByIdAndDispatch)

router.route('/user/:id').get(protect, getUserOrders)

router.route('/orderProducts').post(protect, placeOrder)

router.route('/delete/:id').delete(protect, admin, deleteOrder)

module.exports = router
