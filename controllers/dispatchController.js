const asyncHandler = require('express-async-handler')
const Dispatch = require('../models/dispatchModel')

// Get report

const create = asyncHandler(async (req, res) => {
  const { bikeNumber, displayName, phoneNumber } = req.body

  const dispatchers = await Dispatch.find({})

  const bike = await Dispatch.findOne({ bikeNumber: bikeNumber })

  if (bike) {
    res.json({
      hasError: true,
      message: 'bike number already exist',
    })
  }

  const phone = await Dispatch.findOne({ phoneNumber: phoneNumber })

  if (bike) {
    res.json({
      hasError: true,
      message: 'Phone number already exist',
    })
  }

  if (
    dispatchers.length === 0 ||
    dispatchers === null ||
    dispatchers === undefined
  ) {
    const dispatcher = await Dispatch.create({
      bikeNumber,
      displayName,
      phoneNumber,
      idNumber: 'DIS01',
    })

    if (dispatcher) {
      res.json({
        dispatcher,
      })
    }
  } else {
    let dis = dispatchers[dispatchers.length - 1]

    let slice = dis.idNumber.slice(4, 5)

    let num = (parseInt(parseInt(slice), 10) + 101).toString().substr(1)

    const dispatcher = await Dispatch.create({
      bikeNumber,
      displayName,
      phoneNumber,
      idNumber: `DIS${num}`,
    })

    if (dispatcher) {
      res.json({
        dispatcher,
      })
    }
  }
})

const getDispatchers = asyncHandler(async (req, res) => {
  const dispatchers = await Dispatch.find({})

  res.json({
    dispatchers,
  })
})

const suspend = asyncHandler(async (req, res) => {
  const dispatcher = await Dispatch.findByIdAndUpdate(req.params.id, {
    isDeleted: true,
  })

  res.json({
    hasError: false,
    message: 'dispatcher has been suspended',
  })
})

const reactivate = asyncHandler(async (req, res) => {
  const dispatcher = await Dispatch.findByIdAndUpdate(req.params.id, {
    isDeleted: false,
  })

  res.json({
    hasError: false,
    message: 'dispatcher has been suspended',
  })
})

const remove = asyncHandler(async (req, res) => {
  const dispatcher = await Dispatch.findByIdAndUpdate(req.params.id)
  if (dispatcher) {
    await dispatcher.remove()
    res.json({
      hasError: false,
      message: 'dispatcher has been deleted',
    })
  }
})

const activeDispatchers = asyncHandler(async (req, res) => {
  const dispatcher = await Dispatch.find({ isDeleted: false })
  if (dispatcher) {
    res.json({
      hasError: false,
      dispatcher,
    })
  }
})

const inactiveDispatchers = asyncHandler(async (req, res) => {
  const dispatcher = await Dispatch.find({ isDeleted: true })
  if (dispatcher) {
    res.json({
      hasError: false,
      dispatcher,
    })
  }
})

const searchActiveDispatchers = asyncHandler(async (req, res) => {
  const { id } = req.body
  const dispatcher = await Dispatch.find({ isDeleted: false, idNumber: id })
  if (dispatcher) {
    res.json({
      hasError: false,
      dispatcher,
    })
  }
})

const searchInactiveDispatchers = asyncHandler(async (req, res) => {
  const { id } = req.body
  const dispatcher = await Dispatch.find({ isDeleted: true, idNumber: id })
  if (dispatcher) {
    res.json({
      hasError: false,
      dispatcher,
    })
  }
})

module.exports = {
  create,
  getDispatchers,
  suspend,
  remove,
  activeDispatchers,
  inactiveDispatchers,
  reactivate,
  searchActiveDispatchers,
  searchInactiveDispatchers,
}
