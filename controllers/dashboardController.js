const asyncHandler = require('express-async-handler')
const moment = require('moment')
const Order = require('../models/orderModel')

// Get total price
// GET /dashboard/today

const totalPrice = asyncHandler(async (req, res) => {
  let orders = await Order.find({
    user: req.user._id,
    isDeleted: false,
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
    isDeleted: false,
  })
  res.json({ orders, long: orders.length, hasError: false })
})

// Get todays price
// GET /dashboard/today/price

const todaysPrice = asyncHandler(async (req, res) => {
  let orders = await Order.find({
    user: req.user._id,
    date: moment(new Date()).format('YYYYMMDD'),
    isDeleted: false,
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

// Get orders by month
// GET /dashboard/chart

const chartOrder = asyncHandler(async (req, res) => {
  let orders = await Order.find({
    user: req.user._id,
    isDeleted: false,
  })

  const months = []

  // January

  let jan = []

  for (let i = 0; i < orders.length; i++) {
    const date = new Date()
    let firstDay = moment(new Date(`${date.getFullYear()}-01-1`)).format(
      'YYYYMMDD'
    )

    let lastDay = moment(new Date(`${date.getFullYear()}-01-31`)).format(
      'YYYYMMDD'
    )
    if (orders[i].date >= firstDay && orders[i].date <= lastDay) {
      jan.push(orders[i])
    }
  }
  let january = jan.reduce(function (acc, curr) {
    return acc + curr.totalPrice
  }, 0)

  months.push(january)

  // February

  let feb = []
  for (let i = 0; i < orders.length; i++) {
    const date = new Date()

    const mon = date.getMonth()

    const endMonth = moment().endOf(`${mon}`)

    let firstDay = moment(new Date(`${date.getFullYear()}-02-1`)).format(
      'YYYYMMDD'
    )

    let lastDay = moment(
      new Date(`${date.getFullYear()}-02-${endMonth}`)
    ).format('YYYYMMDD')
    if (orders[i].date >= firstDay && orders[i].date <= lastDay) {
      feb.push(orders[i])
    }
  }
  let february = feb.reduce(function (acc, curr) {
    return acc + curr.totalPrice
  }, 0)

  months.push(february)

  // March

  let mar = []

  for (let i = 0; i < orders.length; i++) {
    const date = new Date()
    let firstDay = moment(new Date(`${date.getFullYear()}-03-1`)).format(
      'YYYYMMDD'
    )

    let lastDay = moment(new Date(`${date.getFullYear()}-03-31`)).format(
      'YYYYMMDD'
    )
    if (orders[i].date >= firstDay && orders[i].date <= lastDay) {
      mar.push(orders[i])
    }
  }
  let march = mar.reduce(function (acc, curr) {
    return acc + curr.totalPrice
  }, 0)

  months.push(march)

  // April

  let apr = []
  for (let i = 0; i < orders.length; i++) {
    const date = new Date()
    let firstDay = moment(new Date(`${date.getFullYear()}-04-1`)).format(
      'YYYYMMDD'
    )
    let lastDay = moment(new Date(`${date.getFullYear()}-04-30`)).format(
      'YYYYMMDD'
    )
    if (orders[i].date >= firstDay && orders[i].date <= lastDay) {
      apr.push(orders[i])
    }
  }
  let april = apr.reduce(function (acc, curr) {
    return acc + curr.totalPrice
  }, 0)

  months.push(april)

  // May

  let ma = []
  for (let i = 0; i < orders.length; i++) {
    const date = new Date()
    let firstDay = moment(new Date(`${date.getFullYear()}-05-1`)).format(
      'YYYYMMDD'
    )
    let lastDay = moment(new Date(`${date.getFullYear()}-05-31`)).format(
      'YYYYMMDD'
    )
    if (orders[i].date >= firstDay && orders[i].date <= lastDay) {
      ma.push(orders[i])
    }
  }
  let may = ma.reduce(function (acc, curr) {
    return acc + curr.totalPrice
  }, 0)

  months.push(may)

  // june

  let jun = []
  for (let i = 0; i < orders.length; i++) {
    const date = new Date()
    let firstDay = moment(new Date(`${date.getFullYear()}-06-1`)).format(
      'YYYYMMDD'
    )
    let lastDay = moment(new Date(`${date.getFullYear()}-06-30`)).format(
      'YYYYMMDD'
    )
    if (orders[i].date >= firstDay && orders[i].date <= lastDay) {
      jun.push(orders[i])
    }
  }
  let june = jun.reduce(function (acc, curr) {
    return acc + curr.totalPrice
  }, 0)

  months.push(june)

  //july

  let jul = []
  for (let i = 0; i < orders.length; i++) {
    const date = new Date()
    let firstDay = moment(new Date(`${date.getFullYear()}-07-1`)).format(
      'YYYYMMDD'
    )
    let lastDay = moment(new Date(`${date.getFullYear()}-07-31`)).format(
      'YYYYMMDD'
    )
    if (orders[i].date >= firstDay && orders[i].date <= lastDay) {
      jul.push(orders[i])
    }
  }
  let july = jul.reduce(function (acc, curr) {
    return acc + curr.totalPrice
  }, 0)

  months.push(july)

  // august

  let aug = []
  for (let i = 0; i < orders.length; i++) {
    const date = new Date()
    let firstDay = moment(new Date(`${date.getFullYear()}-08-1`)).format(
      'YYYYMMDD'
    )
    let lastDay = moment(new Date(`${date.getFullYear()}-08-31`)).format(
      'YYYYMMDD'
    )
    if (orders[i].date >= firstDay && orders[i].date <= lastDay) {
      aug.push(orders[i])
    }
  }
  let august = aug.reduce(function (acc, curr) {
    return acc + curr.totalPrice
  }, 0)

  months.push(august)

  // september

  let sept = []

  for (let i = 0; i < orders.length; i++) {
    const date = new Date()
    let firstDay = moment(new Date(`${date.getFullYear()}-09-1`)).format(
      'YYYYMMDD'
    )

    let lastDay = moment(new Date(`${date.getFullYear()}-09-30`)).format(
      'YYYYMMDD'
    )
    if (orders[i].date >= firstDay && orders[i].date <= lastDay) {
      sept.push(orders[i])
    }
  }
  let september = sept.reduce(function (acc, curr) {
    return acc + curr.totalPrice
  }, 0)

  months.push(september)

  // october

  let oct = []

  for (let i = 0; i < orders.length; i++) {
    const date = new Date()
    let firstDay = moment(new Date(`${date.getFullYear()}-10-1`)).format(
      'YYYYMMDD'
    )

    let lastDay = moment(new Date(`${date.getFullYear()}-10-31`)).format(
      'YYYYMMDD'
    )
    if (orders[i].date >= firstDay && orders[i].date <= lastDay) {
      oct.push(orders[i])
    }
  }
  let october = oct.reduce(function (acc, curr) {
    return acc + curr.totalPrice
  }, 0)

  months.push(october)

  // november

  let nov = []
  for (let i = 0; i < orders.length; i++) {
    const date = new Date()
    let firstDay = moment(new Date(`${date.getFullYear()}-11-1`)).format(
      'YYYYMMDD'
    )
    let lastDay = moment(new Date(`${date.getFullYear()}-11-30`)).format(
      'YYYYMMDD'
    )
    if (orders[i].date >= firstDay && orders[i].date <= lastDay) {
      nov.push(orders[i])
    }
  }
  let november = nov.reduce(function (acc, curr) {
    return acc + curr.totalPrice
  }, 0)

  months.push(november)

  // december

  let dec = []
  for (let i = 0; i < orders.length; i++) {
    const date = new Date()
    let firstDay = moment(new Date(`${date.getFullYear()}-12-1`)).format(
      'YYYYMMDD'
    )
    let lastDay = moment(new Date(`${date.getFullYear()}-12-31`)).format(
      'YYYYMMDD'
    )
    if (orders[i].date >= firstDay && orders[i].date <= lastDay) {
      dec.push(orders[i])
    }
  }
  let december = dec.reduce(function (acc, curr) {
    return acc + curr.totalPrice
  }, 0)

  months.push(december)

  // response

  res.json({
    hasError: false,
    months,
    jan,
    mar,
  })
})

module.exports = { todaysOrder, todaysPrice, totalPrice, chartOrder }
