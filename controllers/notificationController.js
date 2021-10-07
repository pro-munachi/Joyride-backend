const asyncHandler = require('express-async-handler')
const nodemailer = require('nodemailer')

const Notification = require('../models/notificationModel')

// Get all notifications of a single user
// GET /notifications/getUser

const getNotify = asyncHandler(async (req, res) => {
  const notification = await Notification.find({ user: req.user._id })

  if (notification) {
    const notify = notification.reverse()
    res.json({
      hasError: false,
      maessage: 'Notifications fetched successfully',
      notify,
    })
  } else {
    res.json({
      hasError: true,
    })
  }
})

// Get notification by id
// GET /notifications/:id

const getById = asyncHandler(async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(req.params.id, {
    isSeen: true,
  })

  const notify = await notification.save()

  if (notification) {
    res.json({
      notify,
      hasError: false,
      message: 'Notification has been read',
    })
  } else {
    res.json({
      hasError: true,
    })
  }
})

// Get all notifications of a single user and update all
// GET /notifications/updateUsers

const updateAllUsers = asyncHandler(async (req, res) => {
  const notify = await Notification.find({ user: req.user._id })
  console.log(notify.length)
  for (let i = 0; i < notify.length; i++) {
    if (notify[i].isSeen === false) {
      await Notification.findByIdAndUpdate(notify[i]._id, {
        isSeen: true,
      })
    }
  }
  res.json({
    hasError: false,
    message: 'update successfull',
    notify: notify.length,
  })
})

module.exports = { getNotify, getById, updateAllUsers }
