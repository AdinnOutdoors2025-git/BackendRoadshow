const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const PORT = 3001;
// VEHICLE UPLOAD SCHEMA
const vehicleData = require("./Models/VehicleMainSchema");
const Vehicle = require("./Models/entryVehicles");
const VehiclesAvailability = require("./Models/vehiclesAvailability");

//Image upload requirements
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const modelName = req.body.model;

    if (!modelName) {
      return cb(new Error("Model name required"), null);
    }

    const formattedModel = modelName.trim().replace(/\s+/g, "_");

    const uploadPath = path.join(__dirname, "public/uploads", formattedModel);

    // Create folder if not exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { files: 4 },
});



// // Enhanced CORS configuration
// app.use(cors({
//   origin: [
//     'http://localhost:3000',
//      'http://192.168.2.159:3000',
//      'https://frontend-roadshow.vercel.app'
//     ],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization','X-Requested-With']
// }));

// // Allow all origins for development
// app.use(cors({
//   origin: true,  // This allows any origin
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
// }));

const allowedOrigins = [
  "http://localhost:3000",
  "http://192.168.2.159:3000",
  "https://frontend-roadshow.vercel.app",
  "https://frontend-roadshow-97ae.vercel.app",
  "https://frontend-roadshow-*-your-username.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        // Allow any vercel.app subdomain for preview deployments
        if (origin.includes(".vercel.app")) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

app.use(bodyParser.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));




// ✅ Explicitly handle preflight requests
// app.options('*', cors());
app.use(
  "/uploads",
  express.static(path.join(__dirname, "public/uploads"))
);

app.use(
  "/images",
  express.static(path.join(__dirname, "../first-app/public/images")),
);

// mongoose.connect("mongodb://127.0.0.1:27017/AdinnRoadshow")
mongoose
  .connect(
    "mongodb+srv://roadshowAdinn:doAztsUGMfooi5PY@roadshowadinn.sephmyg.mongodb.net/?appName=RoadshowAdinn",
    //     , {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true
    // }

    // mongodb://localhost:27017
    //mongoose.connect("mongodb://127.0.0.1:27017/thendral"
    //  mongoose.connect("mongodb+srv://webdev_db_user:rJp012X4b29yFh0F@cluster0-dev.1utlbf7.mongodb.net/?appName=Cluster0-Dev"
  )
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/adminUserLogin", require("./UserAdminLogin"));
app.use("/EmployeeLogin", require("./LoginMain"));

// VEHICLE DETAILS STORED WITH CRUD OPERATIONS
//IMAGE UPLOAD CLOUDINARY CORRECTED CODE
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { v2: cloudinary } = require("cloudinary");
cloudinary.config({
  cloud_name: "dysuigknj",
  api_key: "133679639417399",
  api_secret: "i4fzWaXH_32kQYkwWb3U-pLxKd4",
  secure: true, // Add this for HTTPS
});

// Configure storage for main image upload
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "VehicleMainImage",
      allowed_formats: ["jpg", "jpeg", "png"],
      // transformation: [
      //     { width: 1600, height: 1200, crop: 'limit', quality: 'auto' }
      // ]
    };
  },
});

const imageUpload = multer({
  storage: imageStorage,
  // limits: {
  //     fileSize: 5 * 1024 * 1024 // 5MB limit
  // }
});

app.post("/upload", imageUpload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    console.log("Main image URL:", req.file.path);
    console.log("Main image public_id:", req.file.filename);
    res.status(200).json({
      message: "Upload successful",
      imageUrl: req.file.path,
      public_id: req.file.filename,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// Configure storage for additional files
const additionalFileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith("video/");
    return {
      folder: isVideo ? "VehicleAddedVideos" : "VehicleAddedImages",
      resource_type: isVideo ? "video" : "image",
      allowed_formats: isVideo
        ? ["mp4", "mov", "avi", "mkv", "webm"]
        : ["jpg", "jpeg", "png", "gif"],
      // format: isVideo ? 'mp4' : 'jpg',
      // transformation: isVideo ? [] : [{ width: 800, height: 800, crop: 'limit' }]
      // transformation: isVideo ?
      //     { quality: 'auto', fetch_format: 'auto' } :
      //     { width: 800, height: 600, crop: 'limit', quality: 'auto' }
    };
  },
});

const additionalFileUpload = multer({
  storage: additionalFileStorage,
});

// Save files endpoint
app.post(
  "/save-videos",
  additionalFileUpload.array("files", 5),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }
      const savedFiles = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
        type: file.mimetype.startsWith("video/") ? "video" : "image",
      }));
      console.log("Saved files:", savedFiles);
      res.status(200).json(savedFiles);
    } catch (err) {
      console.error("Error uploading additional files:", err);
      res.status(500).json({ error: "File save failed" });
    }
  },
);

// Delete endpoint
app.post("/delete-video", async (req, res) => {
  try {
    const { public_id, resource_type } = req.body;

    if (!public_id || !resource_type) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: resource_type,
    });

    if (result.result === "ok") {
      res.status(200).json({ message: "File deleted successfully" });
    } else {
      res.status(400).json({ error: "File deletion failed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during file deletion" });
  }
});

//PRODUCTS    Other routes (get, post, put, delete)
app.get("/vehicles", async (req, res) => {
  try {
    const data = await vehicleData.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

//GET THE PRODUCT USING ID FOR SPECIFIC PRODUCT
app.get("/vehicles/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await vehicleData.findById(id);
    if (!data) {
      res.status(404).json({ message: "Product not found" });
    }
    // res.json(data);
    const vehicle = data.toObject();
    // Ensure complete image URL
    if (
      vehicle.vehicleDetails.image &&
      !vehicle.vehicleDetails.image.startsWith("http")
    ) {
      vehicle.vehicleDetails.image = `${req.protocol}://${req.get("host")}${vehicle.vehicleDetails.image}`;
    }
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// app.get('/vehicles/similar/:prodCode', async (req, res) => {
//     try {
//         // First find the current product
//         const currentProduct = await vehicleData.findOne({ prodCode: req.params.prodCode });
//         if (!currentProduct || !currentProduct.similarProducts || currentProduct.similarProducts.length === 0) {
//             return res.status(404).json({ message: "No similar products found" });
//         }
//         // Extract similar products' ProdCodes
//         const prodCodes = currentProduct.similarProducts.map(p => p.ProdCode);
//         // Fetch details of all similar products (excluding the current one)
//         const similarProducts = await vehicleData.find({
//             prodCode: { $in: prodCodes },
//             _id: { $ne: currentProduct._id } // Exclude current product by ID instead of prodCode
//         });
//         // Map the results to match the frontend expectation
//         const mappedResults = similarProducts.map(product => ({
//             _id: product._id,
//             name: product.name,
//             location: `${product.location.district}, ${product.location.state}`,
//             dimensions: `${product.height} x ${product.width}`,
//             price: product.price,
//             rating: product.rating,
//             image: product.image,
//             category: product.mediaType,
//             sizeHeight: product.height,
//             sizeWidth: product.width,
//             district: product.location.district,
//             state: product.location.state,
//             printingCost: product.printingCost,
//             mountingCost: product.mountingCost,
//             prodCode: product.prodCode,
//             prodLighting: product.lighting,
//             productFrom: product.from,
//             productTo: product.to,
//             productFixedAmount: product.fixedAmount,
//             productFixedOffer: product.fixedOffer,

//         }));

//         res.json(mappedResults);
//     } catch (err) {
//         console.error("Error fetching similar products:", err);
//         res.status(500).json({ message: "Error fetching similar products" });
//     }
// });

// Get similar vehicles endpoint
app.get("/vehicles/similar/:vehicleId", async (req, res) => {
  try {
    const currentVehicle = await vehicleData.findOne({
      "vehicleDetails.vehicleID": req.params.vehicleId,
    });

    if (
      !currentVehicle ||
      !currentVehicle.similarVehicles ||
      currentVehicle.similarVehicles.length === 0
    ) {
      return res.status(404).json({ message: "No similar vehicles found" });
    }

    // Extract similar vehicles' IDs
    const vehicleIDs = currentVehicle.similarVehicles.map((v) => v.VehicleID);

    // Fetch details of all similar vehicles
    const similarVehicles = await vehicleData.find({
      "vehicleDetails.vehicleID": { $in: vehicleIDs },
    });

    res.json(similarVehicles);
  } catch (err) {
    console.error("Error fetching similar vehicles:", err);
    res.status(500).json({ message: "Error fetching similar vehicles" });
  }
});

app.post("/vehicles", async (req, res) => {
  try {
    console.log("Creating vehicle with data:", req.body);
    const vehicle = new vehicleData(req.body);
    const saved = await vehicle.save();
    console.log("Product saved to MongoDB:", saved);
    res.json(saved);
  } catch (err) {
    console.error("Error saving product to MongoDB:", err);
    res.status(500).json({
      message: err,
      details: err.errors, // This will show validation errors
    });
  }
});

app.put("/vehicles/:id", async (req, res) => {
  try {
    // const id = req.params.id;
    const updated = await vehicleData.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!updated) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});
// app.patch("/vehicles/:id", async (req, res) => {
//     const { id } = req.params;
//     const { visible } = req.body;

//     try {
//         const updatedVehicle = await vehicleData.findByIdAndUpdate(
//             id,
//             { visible },
//             { new: true }
//         );
//           if (!updatedVehicle) {
//             return res.status(404).json({ message: "Vehicle not found" });
//         }

//         res.json(updatedProduct);
//     } catch (err) {
//         console.error("Update error:", err);
//         res.status(500).json({ message: "Failed to update visibility" });
//     }
// });

app.patch("/vehicles/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Handle nested vehicleDetails.visible update
    const updateFields = {};
    if (req.body["vehicleDetails.visible"] !== undefined) {
      updateFields["vehicleDetails.visible"] =
        req.body["vehicleDetails.visible"];
    }

    const updatedVehicle = await vehicleData.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true },
    );

    if (!updatedVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.json(updatedVehicle);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Failed to update vehicle" });
  }
});

app.patch("/vehicles/:id/remove-similar", async (req, res) => {
  const { id } = req.params;
  const { prodCode } = req.body;

  try {
    const updatedProduct = await vehicleData.findByIdAndUpdate(
      id,
      { $pull: { similarProducts: { ProdCode: prodCode } } },
      { new: true },
    );

    res.json(updatedProduct);
  } catch (err) {
    console.error("Remove similar error:", err);
    res.status(500).json({ message: "Failed to remove similar product" });
  }
});

app.delete("/vehicles/:id", async (req, res) => {
  try {
    const vehicle = await vehicleData.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete main image from Cloudinary if it exists
    if (vehicle.vehicleDetails.imagePublicId) {
      await cloudinary.uploader.destroy(vehicle.vehicleDetails.imagePublicId);
    }

    // Delete additional files from Cloudinary
    if (
      vehicle.vehicleDetails.additionalFiles &&
      vehicle.vehicleDetails.additionalFiles.length > 0
    ) {
      for (const file of vehicle.vehicleDetails.additionalFiles) {
        if (file.public_id) {
          await cloudinary.uploader.destroy(file.public_id, {
            resource_type: file.type === "video" ? "video" : "image",
          });
        }
      }
    }
    // Delete from database
    await vehicleData.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: err });
  }
});

app.post("/entryVehicles", upload.array("images", 4), async (req, res) => {
  try {
    const { vehicleNumber, model } = req.body;

    if (!vehicleNumber || !model) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required",
      });
    }

    const regex = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/i;
    if (!regex.test(vehicleNumber)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid vehicle number format",
      });
    }

    // 🔹 Normalize input model
    const normalizedInputModel = model.trim().toUpperCase().replace(/\s+/g, " ");

    // 🔹 Find an existing model (case-insensitive)
    const existingModel = await Vehicle.findOne({
      model: { $regex: new RegExp(`^${normalizedInputModel}$`, "i") },
    });

    if (existingModel) {
      // Use the existing images folder from the first record
      const existingFolder = existingModel.images.length
        ? path.dirname(existingModel.images[0])
        : null;

      // Delete newly uploaded files if any
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => fs.unlinkSync(file.path));
      }

      return res.status(200).json({
        status: "success",
        message: `Vehicle model "${existingModel.model}" already exists. Using existing images.`,
        data: existingModel,
        folderUsed: existingFolder, // just for debugging
      });
    }

    // Model does not exist → save new images
    const folderName = normalizedInputModel.replace(/\s+/g, "_");
    const uploadFolder = path.join("public", "uploads", folderName);

    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }

    const imagePaths = req.files.map((file) => `${uploadFolder}/${file.filename}`);

    // Save new vehicle
    const newVehicle = new Vehicle({
      vehicleNumber,
      model: normalizedInputModel,
      images: imagePaths,
    });

    await newVehicle.save();

    res.status(201).json({
      status: "success",
      message: "Vehicle created successfully with images",
      data: newVehicle,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});
app.put("/updateVehicle/:id", upload.array("images", 4), async (req, res) => {
  try {
    const { vehicleNumber, model } = req.body;
    const vehicleId = req.params.id;

    if (!vehicleNumber || !model) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required",
      });
    }

    // Check if model exists in OTHER records
    const existingModel = await Vehicle.findOne({
      model,
      _id: { $ne: vehicleId },
    });

    let imagePaths = [];

    if (req.files && req.files.length > 0) {
      // New images uploaded → save new paths
      imagePaths = req.files.map(
        (file) =>
          `public/uploads/${model.trim().replace(/\s+/g, "_")}/${file.filename}`
      );

      console.log("New images uploaded:", imagePaths);

      // Update **all vehicles with this model** to use the new images
      await Vehicle.updateMany(
        { model },
        { $set: { images: imagePaths } }
      );
    } else if (existingModel) {
      // No new images uploaded → reuse existing model images
      imagePaths = existingModel.images || [];
    }

    // Update the single vehicle details
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      vehicleId,
      {
        vehicleNumber,
        model,
        images: imagePaths,
      },
      { new: true }
    );

    res.json({
      status: true,
      message: req.files && req.files.length > 0
        ? "Vehicle and model images updated successfully"
        : existingModel
        ? "Vehicle updated (images inherited from existing model)"
        : "Vehicle updated successfully",
      vehicle: updatedVehicle,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

app.get("/getVehicles", async (req, res) => {
  const vehicles = await Vehicle.find().sort({ createdAt: -1 });
  res.json({ status: true, data: vehicles });
});


app.delete("/deleteVehicle/:id", async (req, res) => {
  try {
    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ status: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

app.post("/saveVehiclesAvailability", async (req, res) => {
  try {
    const {
      vehicleId,
      vehicleNumber,
      model,
      location,
      isAvailable,
      statusReason,
    } = req.body;

    const cleanModel = model.trim();

    // ✅ Check vehicle exists
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    // ✅ Find another vehicle with SAME model (exclude current vehicle)
    const existingModelVehicle = await Vehicle.findOne({
      _id: { $ne: vehicleId }, // 🔥 exclude current
      model: { $regex: `^${cleanModel}$`, $options: "i" }, // case insensitive
      images: { $exists: true, $not: { $size: 0 } }, // ensure not empty
    });

    const updateData = {
      vehicleId,
      vehicleNumber,
      model: cleanModel,
      location,
      isAvailable,
      statusReason: isAvailable ? "" : statusReason,
    };

    // 🔥 If model found with images → force copy
    if (existingModelVehicle && existingModelVehicle.images.length > 0) {
      updateData.images = existingModelVehicle.images;
    }

    const updatedRecord = await VehiclesAvailability.findOneAndUpdate(
      { vehicleId },
      updateData,
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );

    res.json({ success: true, data: updatedRecord });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

app.put("/updateVehiclesAvailability/:id", async (req, res) => {
  try {
    const {
      vehicleId,
      vehicleNumber,
      model,
      location,
      isAvailable,
      statusReason,
    } = req.body;

    const cleanModel = model.trim();

    const existingAvailability = await VehiclesAvailability.findById(
      req.params.id,
    );

    if (!existingAvailability) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    // 🔥 Find another vehicle with same model (exclude current)
    const existingModelVehicle = await Vehicle.findOne({
      _id: { $ne: vehicleId },
      model: { $regex: `^${cleanModel}$`, $options: "i" },
      images: { $exists: true, $not: { $size: 0 } },
    });

    const updateData = {
      vehicleId,
      vehicleNumber,
      model: cleanModel,
      location,
      isAvailable,
      statusReason: isAvailable ? "" : statusReason,
    };

    // 🔥 Priority 1 → copy from model
    if (existingModelVehicle && existingModelVehicle.images.length > 0) {
      updateData.images = existingModelVehicle.images;
    }
    // 🔥 Priority 2 → keep old availability images
    else if (existingAvailability.images?.length > 0) {
      updateData.images = existingAvailability.images;
    }

    const updated = await VehiclesAvailability.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

app.get("/getVehiclesAvailability", async (req, res) => {
  try {
    const data = await VehiclesAvailability.find().populate(
      "vehicleId",
      "images",
    );

    const formatted = data.map((item) => ({
      _id: item._id,
      vehicleId: item.vehicleId, // ✅ FIXED
      vehicleNumber: item.vehicleNumber,
      model: item.model,
      location: item.location,
      status: item.status,
      isAvailable: item.isAvailable,
      statusReason: item.statusReason,
      images: item.vehicleId?.images || [],
    }));

    res.json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

app.delete("/deleteVehiclesAvailability/:id", async (req, res) => {
  try {
    await VehiclesAvailability.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
