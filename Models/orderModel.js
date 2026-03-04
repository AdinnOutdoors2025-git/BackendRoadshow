const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // ================= CUSTOMER DETAILS =================
     userId: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    email: String,

    companyName: String,

    designation: String,

    // ================= BOOKING DETAILS =================
    bookingItems: [
      {
        vehicleModel: String,
        city: String,
        quantity: Number,
        fromDate: Date,
        toDate: Date,
        totalDays: Number,
        pricePerDay: Number,
        totalAmount: Number,
      },
    ],

    grandTotal: {
      type: Number,
      required: true,
    },

    orderStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);