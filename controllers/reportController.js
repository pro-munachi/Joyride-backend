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
      if (orders[i].date <= end || orders[i].date >= start) {
        all.push(orders[i])
      }
    }

    res.json({
      all,
      hasError: false,
    })
  } else {
    res.json({
      hasError: true,
    })
  }
})

module.exports = { getReports }
