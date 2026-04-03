const VehicleModel = require("../../Models/VehicleModel");

// Save Vehicle Model
const saveVehicleModel = async (req, res) => {
  try {
    const { modelName } = req.body;

    if (!modelName || modelName.trim() === "") {
      return res.status(400).json({
        status: false,
        message: "Model name is required",
      });
    }

    const existing = await VehicleModel.findOne({
      modelName: modelName.toUpperCase(),
    });

    if (existing) {
      return res.status(400).json({
        status: false,
        message: "Model already exists",
      });
    }

    const newModel = new VehicleModel({
      modelName: modelName.toUpperCase(),
    });

    await newModel.save();

    res.status(201).json({
      status: true,
      message: "Model saved successfully",
      data: newModel,
    });
  } catch (error) {
    console.log("Model not saved", error);
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

// Get Vehicle Models
const getVehicleModels = async (req, res) => {
  try {
    const models = await VehicleModel.find().sort({ createdAt: -1 });

    res.json({
      status: true,
      data: models,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

module.exports = {
  saveVehicleModel,
  getVehicleModels,
};