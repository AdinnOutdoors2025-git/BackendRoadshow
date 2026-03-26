const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    // ================= BASIC INFO =================
    vehicleName: { type: String, required: true },
    vehicleType: { type: String, required: true },
    model: {
      type: String,
      required: true,
      enum: ["2 Side LED", "3 Side Premium", "3 Side", "Ultra Single Side"],
    },
    vehicleNumber: { type: String, required: true },
    year: Number,
    fuelType: String,
    transmission: String,
    seatingCapacity: Number,

    // ================= CAMPAIGN =================
    campaignType: String,
    ledAvailable: String,
    ledSize: String,
    soundSystem: String,
    brandingSideSize: String,
    brandingBackSize: String,
    roofSetup: String,
    generatorAvailable: String,
    lighting: String,

    // ================= PRICING =================
    basePrice: { type: Number, required: true },
    pricingType: String,
    minBooking: String,
    extraHourCharge: Number,
    driverCharge: String,
    fuelPolicy: String,
    securityDeposit: Number,
    discountEligible: String,
    availability: String,

    // ================= LEGAL =================
    rcValidTill: Date,
    insuranceValidTill: Date,
    pollutionValidTill: Date,
    permitType: String,
    emergencyContact: String,

    // ================= ADMIN =================
    internalNotes: String,
    priorityLevel: String,
    internalRating: Number,
    featured: String,

    // ================= DRIVER & STAFF =================
    driverName: {
      type: String,
      default: "",
    },

    driverPhone: {
      type: String,
      default: "",
    },

    driverExperience: {
      type: Number,
      default: 0,
    },

    languagesKnown: {
      type: String,
      default: "",
    },

    helperAvailable: {
      type: String,
      default: "",
    },
    // Add this inside vehicleSchema

    city: {
      type: String,
      default: "",
    },


    // ================= MEDIA =================
    mainImage: [String],
    sideImages: [String],
    interiorImages: [String],
    ledDisplayImage: [String],
    brandingSample: [String],
    vehicleVideo: [String],
  },

  
  { timestamps: true },
);

module.exports = mongoose.model("vehicleDetails", vehicleSchema);
