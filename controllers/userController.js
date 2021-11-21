const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')

const generateToken = require('../utils/generatetoken')
const User = require('../models/userModel')
const Notification = require('../models/notificationModel')
const { forgotPasswordTemplate, createdUser } = require('../utils/userUtil')

//@desc    Register user & get token
//@route   POST /api/users/register
//@access  Public

const registerUser = asyncHandler(async (req, res) => {
  let { email, password, passwordCheck, displayName, roles, phoneNumber } =
    req.body

  if (!displayName) {
    displayName = email
  }

  const salt = await bcrypt.genSalt()
  const passwordHash = await bcrypt.hash(password, salt)

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.json({
      hasError: true,
      message: 'user already exist',
    })
  }

  const number = await User.findOne({ phoneNumber })

  if (number) {
    res.json({
      hasError: true,
      message: 'Number already exist',
    })
  }

  const user = await User.create({
    displayName,
    email,
    password,
    roles,
    phoneNumber,
  })

  if (user) {
    const notify = await Notification.create({
      user: user._id,
      message: 'your account has been successfully created',
      isSeen: false,
    })

    var transporter = nodemailer.createTransport({
      host: 'mail.midraconsulting.com',
      port: 8889,
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: 'bobby@midraconsulting.com',
        pass: '1nt3n@t10n@l',
      },
    })

    let data = createdUser(user.displayName)

    const mailOptions = {
      from: 'bobby@midraconsulting.com', // sender address
      to: user.email, // list of receivers
      subject: 'Created an account', // Subject line
      html: data, // plain text body
    }

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) console.log(err)
      else console.log(info)
    })

    res.status(201).json({
      _id: user._id,
      displayName: user.displayName,
      email: user.email,
      roles: user.roles,
      token: generateToken(user._id),
      hasError: false,
      profilePic: user.profilePic,
      phoneNumber: user.phoneNumber,
      notify,
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

//@desc    Login user & get token
//@route   POST /api/users/login
//@access  Public

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      displayName: user.displayName,
      email: user.email,
      roles: user.roles,
      token: generateToken(user._id),
      isAdmin: user.isAdmin,
      hasError: false,
      profilePic: user.profilePic,
      phoneNumber: user.phoneNumber,
    })
  } else {
    res.json({
      error: 'Invalid email or password',
      hasError: true,
    })
  }
})

//desc fetch all users
//route GET /api/users/

const getAllUsers = asyncHandler(async (req, res) => {
  const allUsers = await User.find({})

  res.json({ allUsers, hasError: false })
})

// desc fetch user by id
// route GET /api/users/:userId

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId)
  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// desc post role
// route POST /api/users/roles

const postRole = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body

    // validate roles as not to post the same role twice

    const existingRole = await User.findOne({ name: name })
    if (existingRole) {
      res.status(400).json({ msg: 'Role already exist ' })
    }

    const newRole = new Role({
      name,
      hasError: false,
      message: 'role posted',
    })
    const savedRole = await newRole.save()
    res.json(savedRole)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// desc get all role
// route GET /api/users/getroles

const getAllRoles = asyncHandler(async (req, res) => {
  const allRoles = await Role.find({})
  res.json(allRoles)
})

// desc forgot password
// roue POST /api/users/forgot

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body

  const existingEmail = await User.findOne({ email })

  if (existingEmail) {
    var transporter = nodemailer.createTransport({
      host: 'mail.midraconsulting.com',
      port: 8889,
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: 'bobby@midraconsulting.com',
        pass: '1nt3n@t10n@l',
      },
    })

    const token = generateToken(existingEmail._id)

    let data = forgotPasswordTemplate(token)

    const mailOptions = {
      from: 'bobby@midraconsulting.com', // sender address
      to: email, // list of receivers
      subject: 'test mail', // Subject line
      html: data, // plain text body
    }

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) console.log(err)
      else console.log(info)
    })
    res.send({
      hasError: false,
      message: 'please check your email for reset link',
    })
  } else {
    res.json({
      message: 'server error',
      hasError: true,
    })
  }
})

// Desc Reset Password
// Route POST api/users/reset

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password, resetPassword } = req.body

  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash(password, salt)

  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findByIdAndUpdate(decoded.id, {
      password: passwordHash,
    })

    if (user) {
      res.json({
        hasError: false,
        user: user,
      })
    } else {
      res.json({
        hasError: true,
        message: 'update failed',
      })
    }
  } else {
    res.json({
      hasError: true,
      message: 'update failed',
    })
  }
})

// Desc Change Password
// Route POST api/users/change

const changePassword = asyncHandler(async (req, res) => {
  const { password, newPassword } = req.body

  const user = await User.findById(req.user._id)

  let match = await user.matchPassword(password)

  if (match) {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    const updatedPassword = await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
    })

    const changedPassword = await updatedPassword.save()

    res.json({
      changedPassword,
      message: 'password changed successfully',
      hasError: false,
    })
  } else {
    res.json({
      hasError: true,
      message: 'incorrect password',
    })
  }
})

// Desc Delete User
// Route Get api/users/delete/:id

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    const deletedUser = await user.remove()
    res.json({
      hasError: false,
      message: 'user deleted successfully',
      deletedUser,
    })
  }
})

// Desc Update User To Admin
// Route GET api/users/admin/:id

const adminUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, {
    isAdmin: true,
  })

  console.log(req.params.id)

  if (user) {
    res.json({
      hasError: false,
      message: 'User is now an admin',
    })
  } else {
    res.json({
      hasError: true,
    })
  }
})

// Desc Edit Profile
// Route POST api/users/edit

const editUser = asyncHandler(async (req, res) => {
  const { displayName, email, number } = req.body

  const user = await User.findByIdAndUpdate(req.user._id, {
    email: email ? email : req.user.email,
    displayName: displayName ? displayName : req.user.displayName,
    phoneNumber: number ? number : req.user.phoneNumber,
  })

  if (user) {
    res.json({
      hasError: false,
      message: 'Profile updated successfully',
    })
  } else {
    res.json({
      hasError: true,
      message: 'sorry something went wrong',
    })
  }
})

// Desc Change profile pic
// Desc POST /users/changepic

const changepic = asyncHandler(async (req, res) => {
  const { profilePic } = req.body

  const user = await User.findByIdAndUpdate(req.user._id, {
    profilePic: profilePic,
  })

  if (user) {
    res.json({
      hasError: false,
      message: 'Profile Picture has been updated',
      pic: profilePic,
    })
  } else {
    res.json({
      hasError: true,
      message: 'sorry something went wrong',
    })
  }
})

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  getAllRoles,
  postRole,
  forgotPassword,
  resetPassword,
  changePassword,
  deleteUser,
  adminUser,
  editUser,
  changepic,
}
