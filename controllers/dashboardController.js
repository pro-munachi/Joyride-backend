const asyncHandler = require('express-async-handler')
const moment = require('moment')
const Order = require('../models/orderModel')

// Get total price
// GET /dashboard/today

const totalPrice = asyncHandler(async (req, res) => {
  let orders = await Order.find({
    user: req.user._id,
  })

  if (orders) {
    // Total Order

    let total = orders.reduce(function (acc, curr) {
      return acc + curr.totalPrice
    }, 0)

    // Yearly total order

    let test = []

    for (let i = 0; i < orders.length; i++) {
      const d = new Date()
      const year = d.getFullYear()
      let startYear = `${year}0101`
      let endYear = `${year}1231`

      if (orders[i].date >= startYear && orders[i].date <= endYear) {
        test.push(orders[i])
      }
    }
    let totalYear = test.reduce(function (acc, curr) {
      return acc + curr.totalPrice
    }, 0)

    // Monthly Total Orders

    let mon = []

    for (let i = 0; i < orders.length; i++) {
      const date = new Date()
      var firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
      var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)

      if (
        orders[i].date >= moment(new Date(firstDay)).format('YYYYMMDD') &&
        orders[i].date <= moment(new Date(lastDay)).format('YYYYMMDD')
      ) {
        mon.push(orders[i])
      }
    }
    let totalMonth = mon.reduce(function (acc, curr) {
      return acc + curr.totalPrice
    }, 0)

    res.json({
      hasError: false,
      totalYear,
      totalYearLength: test.length,
      totalMonth,
      totalMonthLength: mon.length,
      total,
      totalLength: orders.length,
    })
  } else {
    res.json({
      hasError: true,
    })
  }
})
// Get todays order
// GET /dashboard/today

const todaysOrder = asyncHandler(async (req, res) => {
  let orders = await Order.find({
    user: req.user._id,
    date: moment(new Date()).format('YYYYMMDD'),
  })
  res.json({ orders, hasError: false })
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
    res.json({ test, hasError: false })
  } else {
    res.json({ hasError: true })
  }
})

module.exports = { todaysOrder, todaysPrice, totalPrice }
