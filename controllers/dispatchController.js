const asyncHandler = require('express-async-handler')
const Dispatch = require('../models/dispatchModel')

// Get report

const create = asyncHandler(async (req, res) => {
  const { bikeNumber, displayName, phoneNumber } = req.body

  const dispatchers = await Dispatch.find({})

  if (
    dispatchers.length === 0 ||
    dispatchers === null ||
    dispatchers === undefined
  ) {
    const dispatcher = await Dispatch.create({
      bikeNumber,
      displayName,
      phoneNumber,
      idNumber: '01',
    })

    if (dispatcher) {
      res.json({
        dispatcher,
      })
    }
  } else {
    let dis = dispatchers[dispatchers.length - 1]

    let num = (parseInt(parseInt(dis.idNumber), 10) + 101).toString().substr(1)

    const dispatcher = await Dispatch.create({
      bikeNumber,
      displayName,
      phoneNumber,
      idNumber: num,
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

module.exports = {
  create,
  getDispatchers,
  suspend,
  remove,
  activeDispatchers,
  inactiveDispatchers,
  reactivate,
}
