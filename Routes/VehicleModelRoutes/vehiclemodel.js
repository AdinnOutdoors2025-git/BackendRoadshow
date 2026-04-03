const express = require("express");
const router = express.Router();

const {
  saveVehicleModel,
  getVehicleModels,
} = require("../../controllers/VehicleModelController/vehiclemodel");
// const { protect } = require("../../Middleware/authmiddleware"); 
const {
    protect,
    isAdmin,
    verifyAdminExists,
} = require('../../Middleware/rolemiddleware');

// router.post("/saveVehicleModel",protect, saveVehicleModel);
// router.get("/getVehicleModels",protect, getVehicleModels);

router.post("/saveVehicleModel",protect, saveVehicleModel);
router.get("/getVehicleModels",protect, getVehicleModels);

module.exports = router;