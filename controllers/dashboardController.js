const asyncHandler = require('express-async-handler')
const moment = require('moment')
const Order = require('../models/orderModel')

// Get todays order
// GET /dashboard/today

const todaysOrder = asyncHandler(async (req, res) => {
  let orders = await Order.find({
    user: req.user._id,
    date: moment(new Date()).format('YYYYMMDD'),
  })
  res.json(orders)
})

// Get todays price
// GET /dashboard/today/price

const todaysPrice = asyncHandler(async (req, res) => {
  let orders = await Order.find({
    user: req.user._id,
    date: moment(new Date()).format('YYYYMMDD'),
  })
  if (orders) {
    let test = orders.reduce(function (acc, curr) {
      return acc + curr.totalPrice
    }, 0)

    console.log(test)
    res.json({ test, hasError: false })
  } else {
    res.json({ hasError: true })
  }
})

module.exports = { todaysOrder, todaysPrice }
