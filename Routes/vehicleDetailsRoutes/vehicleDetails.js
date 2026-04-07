const express = require("express");
const router = express.Router();

const {
  createVehicle,
  getNewVehicles,
} = require("../../controllers/VehicleDetailsController/vehicledetails");



const vehicleUpload = require("../../Middleware/vehicleDetailsUpload");
// const { protect } = require("../../Middleware/authmiddleware"); 
const {
    protect
} = require('../../Middleware/rolemiddleware');

router.post("/createVehicle",protect, vehicleUpload, createVehicle);
router.get("/getNewVehicles",protect, getNewVehicles);

module.exports = router;