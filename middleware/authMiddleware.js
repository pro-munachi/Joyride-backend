const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const protect = asyncHandler(async (req, res, next) => {
  let token

  console.log(req.headers)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]
      console.log(token)

      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decoded)

        req.user = await User.findById(decoded.id)

        next()
      } else {
        res.json({
          hasError: 'Not authorized, no token',
        })
        console.log('ewo')
      }
    } catch (error) {
      console.error(error)
      res.json({
        hasError: 'Not authorized, token failed',
      })
    }
  }
})

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(401)
    throw new Error('Not authorized as an admin')
  }
}

module.exports = { protect, admin }
