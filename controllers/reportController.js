const asyncHandler = require('express-async-handler')
const moment = require('moment')
const Order = require('../models/orderModel')

// Get report

const getReports = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.body

  const orders = await Order.find({})

  if (orders) {
    const all = []

    const start = moment(new Date(startDate)).format('YYYYMMDD')
    const end = moment(new Date(endDate)).format('YYYYMMDD')

    for (let i = 0; i < orders.length; i++) {
      if (orders[i].date >= start && orders[i].date <= end) {
        all.push(orders[i])
      }
    }

    let total = all.reduce(function (acc, curr) {
      return acc + curr.totalPrice
    }, 0)

    res.json({
      all,
      total,
      hasError: false,
    })
  } else {
    res.json({
      hasError: true,
    })
  }
})

module.exports = { getReports }
