const vehicleDetails = require("../../Models/vehicleDetails");


// Create Vehicle
const createVehicle = async (req, res) => {
  try {
    const files = req.files || {};

    const vehicleData = {
      ...req.body,
      model: req.body.model,
      city: req.body.city,

      mainImage: files.mainImage?.map((file) => file.filename) || [],
      sideImages: files.sideImages?.map((file) => file.filename) || [],
      interiorImages: files.interiorImages?.map((file) => file.filename) || [],
      ledDisplayImage:
        files.ledDisplayImage?.map((file) => file.filename) || [],
      brandingSample:
        files.brandingSample?.map((file) => file.filename) || [],
      vehicleVideo:
        files.vehicleVideo?.map((file) => file.filename) || [],
    };

    const newVehicle = new vehicleDetails(vehicleData);
    const savedVehicle = await newVehicle.save();

    res.status(201).json({
      success: true,
      message: "Vehicle Created Successfully",
      data: savedVehicle,
    });
  } catch (error) {
    console.error("Create Vehicle Error:", error);

    res.status(500).json({
      success: false,
      message: "Error Creating Vehicle",
      error: error.message,
    });
  }
};

// Get Vehicles
const getNewVehicles = async (req, res) => {
  try {
    const vehicles = await vehicleDetails.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles,
    });
  } catch (error) {
    console.error("Get Vehicles Error:", error);

    res.status(500).json({
      success: false,
      message: "Error Fetching Vehicles",
      error: error.message,
    });
  }
};

module.exports = {
  createVehicle,
  getNewVehicles,
};