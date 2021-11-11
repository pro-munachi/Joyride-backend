const mongoose = require('mongoose')
const moment = require('moment')

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },

    number: {
      type: String,
      required: true,
    },

    userName: {
      type: String,
      required: true,
    },

    orderItems: [
      {
        name: { type: String, required: true },
        image: { type: String, required: false },
        price: { type: Number, required: false },
      },
    ],
    addressFrom: {
      type: String,
      required: true,
    },
    addressTo: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    date: {
      type: String,
      required: true,
      default: moment(new Date()).format('YYYYMMDD'),
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    dispatchOrder: {
      type: Boolean,
      required: true,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
)

const Order = mongoose.model('Order', orderSchema)

module.exports = Order
