const asyncHandler = require('express-async-handler')
const nodemailer = require('nodemailer')

const create = require('../utils/userUtil')
const Order = require('../models/orderModel')
const User = require('../models/userModel')
const Dispatch = require('../models/dispatchModel')
const Notification = require('../models/notificationModel')
const { findById } = require('../models/orderModel')

// Order for a product
// POST /orders/orderProducts

const placeOrder = asyncHandler(async (req, res) => {
  const { addressFrom, addressTo, paymentMethod, orderItems } = req.body

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
      orderItems,
      number: req.user.phoneNumber,
      userName: req.user.displayName,
    })

    if (orders) {
      const notify = await Notification.create({
        user: req.user._id,
        message: 'your order/orders has/have been created successfully ',
        isSeen: false,
      })

      const user = await User.find({ isAdmin: true })

      for (let i = 0; i < user.length; i++) {
        await Notification.create({
          user: user[i]._id,
          message: `${req.user.displayName} created an order`,
          isSeen: false,
        })
      }

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

// Get all orders
// GET /orders/

const getAllDeleted = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })

  let order = orders.filter((orde) => orde.isDeleted === false)
  res.json({
    order,
  })
})

// Fetch all orders by user id
// GET /orders/getOrders

const getAllById = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })

  const reverse = orders.reverse()
  res.json({ reverse, hasError: false, message: 'these are the orders' })
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

// Get all orders of a single user with params
// GET /orders/getUser

const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.params.id })

  if (orders) {
    const order = orders.reverse()
    const slice = order.slice(0, 5)
    res.json({
      hasError: false,
      maessage: 'Orders deleted successfully',
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

// User delete order

const deleteOrderByUser = asyncHandler(async (req, res) => {
  const orders = await Order.findByIdAndUpdate(req.params.id, {
    isDeleted: true,
  })

  if (orders) {
    res.json({
      hasError: false,
      maessage: 'Orders deleted successfully',
    })
  } else {
    res.json({
      hasError: true,
    })
  }
})

// Make an order true by an admin

const makeOrderTrue = asyncHandler(async (req, res) => {
  const { id, amount } = req.body

  const theOrder = await Order.findById(id)

  if (theOrder.totalPrice !== 0) {
    res.json({
      hasError: true,
      message: 'Price has already been added by an admin',
    })
  } else {
    const paid = await Order.findByIdAndUpdate(id, {
      isPaid: true,
      totalPrice: amount,
    })

    if (paid) {
      const order = await Order.findById(id)

      let use = order.user

      await Notification.create({
        user: use,
        message: 'Your order has been confirmed',
        isSeen: false,
      })

      res.json({
        hasError: false,
        message: 'it has been updated',
      })
    } else {
      res.json({
        hasError: true,
      })
    }
  }
})

// Dispatch an order by an admin

const dispatchOrder = asyncHandler(async (req, res) => {
  const { id, amount, dispatcherId } = req.body

  const theOrder = await Order.findById(id)

  if (theOrder.shippingPrice !== 0) {
    res.json({
      hasError: true,
      message: 'Order has already been dispatched by an admin',
    })
  } else {
    const dispatcher = await Dispatch.findById(dispatcherId)

    const order = await Order.findByIdAndUpdate(id, {
      shippingPrice: amount,
      dispatcher: dispatcher.displayName,
      dispatcherId: dispatcherId,
      dispatchOrder: true,
    })

    if (order) {
      const order = await Order.findById(id)

      let use = order.user

      await Notification.create({
        user: use,
        message: 'Your order has been dispatched',
        isSeen: false,
      })

      res.json({
        hasError: false,
        message: 'order has been Dispatched',
      })
    } else {
      res.json({
        hasError: true,
        message: 'sorry something went wrong',
      })
    }
  }
})

// Mark an order as delivered

const deliverOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, {
    isDelivered: true,
  })

  if (order) {
    const orde = await Order.findById(req.params.id)

    let use = orde.user

    await Notification.create({
      user: use,
      message: 'Your order has been delivered',
      isSeen: false,
    })

    res.json({
      hasError: false,
      message: 'order has been delivered',
      order,
    })
  } else {
    res.json({
      hasError: true,
      message: 'sorry something went wrong',
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
  getAllDeleted,
  deleteOrderByUser,
  makeOrderTrue,
  dispatchOrder,
  deliverOrder,
}
