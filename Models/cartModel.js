const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  vehicleModel: {
    type: String,
    required: true,
  },

  city: {
    type: String,
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
  },

  fromDate: {
    type: Date,
    required: true,
  },

  toDate: {
    type: Date,
    required: true,
  },

  totalDays: {
    type: Number,
    required: true,
  },

  pricePerDay: {
    type: Number,
    required: true,
  },

  totalAmount: {
    type: Number,
    required: true,
  },
});

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true, // one cart per user
    },

    items: [cartItemSchema],

    grandTotal: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);