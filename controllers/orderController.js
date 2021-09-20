const asyncHandler = require('express-async-handler')
const Order = require('../models/orderModel')

// Order for a product
// POST /orders/orderProducts

const placeOrder = asyncHandler(async (req, res) => {
  const {
    addressFrom,
    addressTo,
    paymentMethod,
    paymentResult,
    orderItems,
    shippingPrice,
    taxPrice,
  } = req.body

  if (orderItems === [] || orderItems === null || orderItems === undefined) {
    res.json({
      message: 'No Order Item',
      hasError: true,
    })
  } else {
    const order = new Order({
      addressFrom,
      addressTo,
      user: req.user._id,
      paymentMethod,
      paymentResult,
      orderItems,
      shippingPrice,
      taxPrice,
    })
    const createdOrder = await order.save()

    res.json({
      createdOrder,
    })
  }
})

// Get all orders
// GET /orders/

const getAll = asyncHandler(async (req, res) => {
  const orders = await Order.find({})

  res.json({
    orders,
    hasError: false,
  })
})

// Fetch all orders by user id
// GET /orders/getOrders

const getAllById = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
  res.json({ orders })
})

// Get order by id
//GET /orders/:id

const getById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (order) {
    res.json({
      hasError: false,
      order,
    })
  } else {
    res.json({
      hasError: true,
    })
  }
})

module.exports = {
  placeOrder,
  getAll,
  getById,
  getAllById,
}
