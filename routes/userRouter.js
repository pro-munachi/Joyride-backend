const router = require('express').Router()
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')

const generateToken = require('../utils/generatetoken')
const User = require('../models/userModel')
const Role = require('../models/roleModel')

//Register users

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    let { email, password, passwordCheck, displayName, roles, profilePic } =
      req.body

    if (!email || !password || !passwordCheck) {
      res.status(400).json({ msg: 'Not all fields have been filled' })
    }

    if (password.length < 5) {
      res
        .status(400)
        .json({ msg: 'Password should be 5 characters and above ' })
    }

    if (password !== passwordCheck) {
      res.status(400).json({ msg: 'Enter the same password twice ' })
    }

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

    const user = await User.create({
      profilePic,
      displayName,
      email,
      password,
      roles,
    })

    if (user) {
      res.status(201).json({
        _id: user._id,
        displayName: user.displayName,
        email: user.email,
        roles: user.roles,
        token: generateToken(user._id),
        hasError: false,
        profilePic: user.profilePic,
      })
    } else {
      res.status(400)
      throw new Error('Invalid user data')
    }
  })
)

// Login

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        displayName: user.displayName,
        email: user.email,
        roles: user.roles,
        token: generateToken(user._id),
        hasError: false,
        profilePic: user.profilePic,
      })
    } else {
      res.json({
        error: 'Invalid email or password',
        hasError: true,
      })
    }
  })
)

//fetch users

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const allUsers = await User.find({})
    res.json(allUsers)
  })
)

// get user by id

router.get('/:userId', async (req, res) => {
  const user = await User.findById(req.params.userId)
  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// Post roles

router.post('/roles', async (req, res) => {
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

//fetch roles

router.get('/getRoles', async (req, res) => {
  const allRoles = await Role.find({})
  res.json(allRoles)
})

module.exports = router

// Forgot password

router.post(
  '/forgot',
  asyncHandler(async (req, res) => {
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

      let data = `
      <html lang="en-US">

      <head>
          <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
          <title>Reset Password Email Template</title>
          <meta name="description" content="Reset Password Email Template.">
          <style type="text/css">
              a:hover {text-decoration: underline !important;}
          </style>
      </head>
      
      <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
          <!--100% body table-->
          <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
              style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
              <tr>
                  <td>
                      <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                          align="center" cellpadding="0" cellspacing="0">
                          <tr>
                              <td style="height:80px;">&nbsp;</td>
                          </tr>
                          <tr>
                              <td style="text-align:center;">
                                <a href="https://rakeshmandal.com" title="logo" target="_blank">
                                  <img width="60" src="https://i.ibb.co/hL4XZp2/android-chrome-192x192.png" title="logo" alt="logo">
                                </a>
                              </td>
                          </tr>
                          <tr>
                              <td style="height:20px;">&nbsp;</td>
                          </tr>
                          <tr>
                              <td>
                                  <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                      style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                      <tr>
                                          <td style="height:40px;">&nbsp;</td>
                                      </tr>
                                      <tr>
                                          <td style="padding:0 35px;">
                                              <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                                  requested to reset your password</h1>
                                              <span
                                                  style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                              <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                  We cannot simply send you your old password. A unique link to reset your
                                                  password has been generated for you. To reset your password, click the
                                                  following link and follow the instructions.
                                              </p>
                                              <a href="http://localhost:3000auth/reset-password/${token}"
                                                  style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                                  Password</a>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td style="height:40px;">&nbsp;</td>
                                      </tr>
                                  </table>
                              </td>
                          <tr>
                              <td style="height:20px;">&nbsp;</td>
                          </tr>
                          <tr>
                              <td style="text-align:center;">
                                  <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>www.rakeshmandal.com</strong></p>
                              </td>
                          </tr>
                          <tr>
                              <td style="height:80px;">&nbsp;</td>
                          </tr>
                      </table>
                  </td>
              </tr>
          </table>
          <!--/100% body table-->
      </body>
      
      </html>
      `

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
)

router.post(
  '/reset',
  asyncHandler(async (req, res) => {
    const { token, password, resetPassword } = req.body

    const salt = await bcrypt.genSalt()
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
        error: 'error',
      })
    }
  })
)
