const asyncHandler = require('express-async-handler')
const nodemailer = require('nodemailer')

const create = require('../utils/userUtil')
const Order = require('../models/orderModel')
const Notification = require('../models/notificationModel')

// Order for a product
// POST /orders/orderProducts

const placeOrder = asyncHandler(async (req, res) => {
  const {
    addressFrom,
    addressTo,
    paymentMethod,
    paymentResult,
    orderItems,
    shippingPrice,
    taxPrice,
  } = req.body

  if (orderItems === [] || orderItems === null || orderItems === undefined) {
    res.json({
      message: 'No Order Item',
      hasError: true,
    })
  } else {
    const orders = await Order.create({
      addressFrom,
      addressTo,
      user: req.user._id,
      paymentMethod,
      paymentResult,
      orderItems,
      shippingPrice,
      taxPrice,
    })

    if (orders) {
      const notify = await Notification.create({
        user: req.user._id,
        message: 'your order/orders has/have been created successfully',
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

      let data = `
      <html lang="en-US">

        <head>
            <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
            <title>Reset Password Email Template</title>
            <meta name="description" content="Reset Password Email Template." />
            <style type="text/css">
            a:hover {
                text-decoration: underline !important;
            }
            </style>
        </head>

        <body
            marginheight="0"
            topmargin="0"
            marginwidth="0"
            style="margin: 0px; background-color: #f2f3f8"
            leftmargin="0"
        >
            <!--100% body table-->
            <table
            cellspacing="0"
            border="0"
            cellpadding="0"
            width="100%"
            bgcolor="#f2f3f8"
            style="
                @import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700);
                font-family: 'Open Sans', sans-serif;
            "
            >
            <tr>
                <td>
                <table
                    style="background-color: #f2f3f8; max-width: 670px; margin: 0 auto"
                    width="100%"
                    border="0"
                    align="center"
                    cellpadding="0"
                    cellspacing="0"
                >
                    <tr>
                    <td style="height: 80px">&nbsp;</td>
                    </tr>
                    <tr>
                    <td style="text-align: center">
                        <a href="https://rakeshmandal.com" title="logo" target="_blank">
                        <img
                            width="60"
                            src="https://i.ibb.co/hL4XZp2/android-chrome-192x192.png"
                            title="logo"
                            alt="logo"
                        />
                        </a>
                    </td>
                    </tr>
                    <tr>
                    <td style="height: 20px">&nbsp;</td>
                    </tr>
                    <tr>
                    <td>
                        <table
                        width="95%"
                        border="0"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                        style="
                            max-width: 670px;
                            background: #fff;
                            border-radius: 3px;
                            text-align: center;
                            -webkit-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                            -moz-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                            box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                        "
                        >
                        <tr>
                            <td style="height: 40px">&nbsp;</td>
                        </tr>
                        <tr>
                            <td style="padding: 0 35px">
                            <h1
                                style="
                                color: #1e1e2d;
                                font-weight: 500;
                                margin: 0;
                                font-size: 32px;
                                font-family: 'Rubik', sans-serif;
                                "
                            >
                                Orders have been received
                            </h1>
                            <span
                                style="
                                display: inline-block;
                                vertical-align: middle;
                                margin: 29px 0 26px;
                                border-bottom: 1px solid #cecece;
                                width: 100px;
                                "
                            ></span>
                            <p
                                style="
                                color: #455056;
                                font-size: 15px;
                                line-height: 24px;
                                margin: 0;
                                "
                            >
                                Hello ${
                                  req.user.displayName
                                }, you have placed the following orders <br /> ${orderItems.map(
        (item) =>
          `  <table style="margin: auto; width: 60%; ">
                                      <tr style="border: #1e1e2d 2px solid;">
                                          <tr style="margin-right: 10px;">
                                              <th>Name</th>
                                              <th>Price</th>
                                          </tr>
                                          <br />
                                          <tr>
                                              <td>${item.name}</td>
                                              <td>${item.price}</td>
                                          </tr>
                                      </tr>
                                   </table>`
      )}

                            </p>
                            </td>
                        </tr>
                        <tr>
                            <td style="height: 40px">&nbsp;</td>
                        </tr>
                        </table>
                    </td>
                    </tr>

                    <tr>
                    <td style="height: 20px">&nbsp;</td>
                    </tr>
                    <tr>
                    <td style="text-align: center">
                        <p
                        style="
                            font-size: 14px;
                            color: rgba(69, 80, 86, 0.7411764705882353);
                            line-height: 18px;
                            margin: 0 0 0;
                        "
                        >
                        &copy; <strong>www.rakeshmandal.com</strong>
                        </p>
                    </td>
                    </tr>
                    <tr>
                    <td style="height: 80px">&nbsp;</td>
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
        to: req.user.email, // list of receivers
        subject: 'Orders you placed', // Subject line
        html: data, // plain text body
      }

      transporter.sendMail(mailOptions, function (err, info) {
        if (err) console.log(err)
        else console.log(info)
      })
      res.json({
        notify,
        hasError: false,
        message: 'Order has been sent to your email',
        orders,
        dispatchOrder: orders.dispatchOrder,
        _id: orders._id,
      })
    } else {
      res.json({
        message: 'server error',
        hasError: true,
      })
    }
  }
})

// Get all orders
// GET /orders/

const getAll = asyncHandler(async (req, res) => {
  const orders = await Order.find({})

  res.json({
    orders,
    hasError: false,
  })
})

// Fetch all orders by user id
// GET /orders/getOrders

const getAllById = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
  res.json({ orders })
})

// Get order by id
//GET /orders/:id

const getById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (order) {
    res.json({
      hasError: false,
      order,
    })
  } else {
    res.json({
      hasError: true,
    })
  }
})

// Get order by id and dispatch
//GET /orders/dispatch/:id

const getByIdAndDispatch = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, {
    dispatchOrder: true,
  })

  const saveOrder = await order.save()
  if (saveOrder) {
    res.json({
      hasError: false,
      saveOrder,
    })
  } else {
    res.json({
      hasError: true,
    })
  }
})

// Get all orders of a single user
// GET /orders/getUser

const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.params.id })

  if (orders) {
    const order = orders.reverse()
    const slice = order.slice(0, 5)
    res.json({
      hasError: false,
      maessage: 'Orders fetched successfully',
      slice,
    })
  } else {
    res.json({
      hasError: true,
    })
  }
})

// Delete an order
// Delete

const deleteOrder = asyncHandler(async (req, res) => {
  const orders = await Order.findById(req.params.id)

  if (orders) {
    const order = await orders.remove()
    res.json({
      hasError: false,
      maessage: 'Orders fetched successfully',
      order,
    })
  } else {
    res.json({
      hasError: true,
    })
  }
})

module.exports = {
  placeOrder,
  getAll,
  getById,
  getAllById,
  getByIdAndDispatch,
  getUserOrders,
  deleteOrder,
}
