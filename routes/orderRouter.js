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
  makeOrderTrue,
  dispatchOrder,
  deliverOrder,
  orderDispatcher,
} = require('../controllers/orderController')
const { protect, admin } = require('../middleware/authMiddleware')

router.route('/').get(protect, admin, getAll)

router.route('/deleteByUser').get(protect, getAllDeleted)

router.route('/getOrders').get(protect, getAllById)

router.route('/:id').get(protect, getById)

router.route('/user/:id/delete').get(protect, deleteOrderByUser)

router.route('/dispatch/:id').get(protect, admin, getByIdAndDispatch)

router.route('/deliver/:id').get(protect, admin, deliverOrder)

router.route('/dispatcher/:disp').get(protect, admin, orderDispatcher)

router.route('/user/:id').get(protect, getUserOrders)

router.route('/orderProduct').post(protect, placeOrder)

router.route('/orderIsPaid').post(protect, admin, makeOrderTrue)

router.route('/dispatchorder').post(protect, admin, dispatchOrder)

router.route('/delete/:id').delete(protect, admin, deleteOrder)

module.exports = router
