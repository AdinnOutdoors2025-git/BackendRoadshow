// const express = require('express');
// const app = express();
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const PORT = 3001;
// // VEHICLE UPLOAD SCHEMA 
// const vehicleData = require ('./Models/VehicleMainSchema');

// //Image upload requirements 
// const multer = require('multer');
// const path = require('path');


// // Enhanced CORS configuration
// app.use(cors({
//   origin: ['http://localhost:3000', 'http://192.168.2.159:3000'],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// app.use(bodyParser.json());
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// // // Handle preflight requests
// // app.options('*', cors());
// app.use("/images", express.static(path.join(__dirname, "../first-app/public/images")));
// app.use(express.static('public'));
// mongoose.connect("mongodb://127.0.0.1:27017/AdinnRoadshow")
//     .then(() => console.log('MongoDB connected successfully'))
//     .catch(err => console.error('MongoDB connection error:', err));

// app.use('/adminUserLogin', require('./UserAdminLogin'));
// app.use('/EmployeeLogin', require('./LoginMain'));


// // VEHICLE DETAILS STORED WITH CRUD OPERATIONS 
// //IMAGE UPLOAD CLOUDINARY CORRECTED CODE
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const { v2: cloudinary } = require('cloudinary');
// cloudinary.config({
//     cloud_name: 'dysuigknj',
//     api_key: '133679639417399',
//     api_secret: 'i4fzWaXH_32kQYkwWb3U-pLxKd4',
//     secure: true // Add this for HTTPS
// });


// // Configure storage for main image upload
// const imageStorage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: async (req, file) => {
//         return {
//             folder: 'VehicleMainImage',
//             allowed_formats: ['jpg', 'jpeg', 'png'],
//             // transformation: [
//             //     { width: 1600, height: 1200, crop: 'limit', quality: 'auto' }
//             // ]
//         };
//     }
// });

// const imageUpload = multer({
//     storage: imageStorage,
//     // limits: {
//     //     fileSize: 5 * 1024 * 1024 // 5MB limit
//     // }
// });

// app.post('/upload', imageUpload.single('file'), (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ error: 'No file uploaded' });
//         }
//         console.log("Main image URL:", req.file.path);
//         console.log("Main image public_id:", req.file.filename);
//         res.status(200).json({
//             message: 'Upload successful',
//             imageUrl: req.file.path,
//             public_id: req.file.filename,
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Upload failed' });
//     }
// });


// // Configure storage for additional files
// const additionalFileStorage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: async (req, file) => {
//         const isVideo = file.mimetype.startsWith('video/');
//         return {
//             folder: isVideo ? 'VehicleAddedVideos' : 'VehicleAddedImages',
//             resource_type: isVideo ? 'video' : 'image',
//             allowed_formats: isVideo ? ['mp4', 'mov', 'avi', 'mkv', 'webm'] : ['jpg', 'jpeg', 'png', 'gif'],
//             // format: isVideo ? 'mp4' : 'jpg',
//             // transformation: isVideo ? [] : [{ width: 800, height: 800, crop: 'limit' }]
//             // transformation: isVideo ?
//             //     { quality: 'auto', fetch_format: 'auto' } :
//             //     { width: 800, height: 600, crop: 'limit', quality: 'auto' }

//         };
//     }
// });

// const additionalFileUpload = multer({ 
//     storage: additionalFileStorage
//  });

// // Save files endpoint
// app.post('/save-videos', additionalFileUpload.array('files', 5), async (req, res) => {
//     try {
//         if (!req.files || req.files.length === 0) {
//             return res.status(400).json({ error: 'No files uploaded' });
//         }
//         const savedFiles = req.files.map(file => ({
//             url: file.path,
//             public_id: file.filename,
//             type: file.mimetype.startsWith('video/') ? 'video' : 'image'
//         }));
//         console.log('Saved files:', savedFiles);
//         res.status(200).json(savedFiles);
//     } catch (err) {
//         console.error('Error uploading additional files:', err);
//         res.status(500).json({ error: 'File save failed' });
//     }
// });

// // Delete endpoint
// app.post('/delete-video', async (req, res) => {
//     try {
//         const { public_id, resource_type } = req.body;

//         if (!public_id || !resource_type) {
//             return res.status(400).json({ error: 'Missing parameters' });
//         }

//         const result = await cloudinary.uploader.destroy(public_id, {
//             resource_type: resource_type
//         });

//         if (result.result === 'ok') {
//             res.status(200).json({ message: 'File deleted successfully' });
//         } else {
//             res.status(400).json({ error: 'File deletion failed' });
//         }
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Server error during file deletion' });
//     }
// });


// //PRODUCTS    Other routes (get, post, put, delete)
// app.get('/vehicles', async (req, res) => {
//     try {
//         const data = await vehicleData.find();
//         res.json(data);
//     } catch (err) {
//         res.status(500).json({ message: err });
//     }
// });


// //GET THE PRODUCT USING ID FOR SPECIFIC PRODUCT
// app.get('/vehicles/:id', async (req, res) => {
//     try {
//         const id = req.params.id;
//         const data = await vehicleData.findById(id);
//         if (!data) {
//             res.status(404).json({ message: "Product not found" });
//         }
//         // res.json(data);
//         const vehicle = data.toObject();
//         // Ensure complete image URL
//         if (vehicle.vehicleDetails.image && !vehicle.vehicleDetails.image.startsWith('http')) {
//             vehicle.vehicleDetails.image = `${req.protocol}://${req.get('host')}${vehicle.vehicleDetails.image}`;
//         }
//         res.json(vehicle);
//     }
//     catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });




// // app.get('/vehicles/similar/:prodCode', async (req, res) => {
// //     try {
// //         // First find the current product
// //         const currentProduct = await vehicleData.findOne({ prodCode: req.params.prodCode });
// //         if (!currentProduct || !currentProduct.similarProducts || currentProduct.similarProducts.length === 0) {
// //             return res.status(404).json({ message: "No similar products found" });
// //         }
// //         // Extract similar products' ProdCodes
// //         const prodCodes = currentProduct.similarProducts.map(p => p.ProdCode);
// //         // Fetch details of all similar products (excluding the current one)
// //         const similarProducts = await vehicleData.find({
// //             prodCode: { $in: prodCodes },
// //             _id: { $ne: currentProduct._id } // Exclude current product by ID instead of prodCode
// //         });
// //         // Map the results to match the frontend expectation
// //         const mappedResults = similarProducts.map(product => ({
// //             _id: product._id,
// //             name: product.name,
// //             location: `${product.location.district}, ${product.location.state}`,
// //             dimensions: `${product.height} x ${product.width}`,
// //             price: product.price,
// //             rating: product.rating,
// //             image: product.image,
// //             category: product.mediaType,
// //             sizeHeight: product.height,
// //             sizeWidth: product.width,
// //             district: product.location.district,
// //             state: product.location.state,
// //             printingCost: product.printingCost,
// //             mountingCost: product.mountingCost,
// //             prodCode: product.prodCode,
// //             prodLighting: product.lighting,
// //             productFrom: product.from,
// //             productTo: product.to,
// //             productFixedAmount: product.fixedAmount,
// //             productFixedOffer: product.fixedOffer,

// //         }));

// //         res.json(mappedResults);
// //     } catch (err) {
// //         console.error("Error fetching similar products:", err);
// //         res.status(500).json({ message: "Error fetching similar products" });
// //     }
// // });


// // Get similar vehicles endpoint
// app.get('/vehicles/similar/:vehicleId', async (req, res) => {
//     try {
//         const currentVehicle = await vehicleData.findOne({ 
//             'vehicleDetails.vehicleID': req.params.vehicleId 
//         });
        
//         if (!currentVehicle || !currentVehicle.similarVehicles || currentVehicle.similarVehicles.length === 0) {
//             return res.status(404).json({ message: "No similar vehicles found" });
//         }

//         // Extract similar vehicles' IDs
//         const vehicleIDs = currentVehicle.similarVehicles.map(v => v.VehicleID);
        
//         // Fetch details of all similar vehicles
//         const similarVehicles = await vehicleData.find({
//             'vehicleDetails.vehicleID': { $in: vehicleIDs }
//         });

//         res.json(similarVehicles);
//     } catch (err) {
//         console.error("Error fetching similar vehicles:", err);
//         res.status(500).json({ message: "Error fetching similar vehicles" });
//     }
// });

// app.post('/vehicles', async (req, res) => {
//     try {
//                 console.log('Creating vehicle with data:', req.body);
//         const vehicle = new vehicleData(req.body);
//         const saved = await vehicle.save();
//         console.log("Product saved to MongoDB:", saved);
//         res.json(saved);
//     } catch (err) {
//         console.error("Error saving product to MongoDB:", err);
//         res.status(500).json({
//             message: err,
//             details: err.errors // This will show validation errors
//         });
//     }
// });

// app.put('/vehicles/:id', async (req, res) => {
//     try {
//         // const id = req.params.id;
//         const updated = await vehicleData.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         if (!updated) {
//             return res.status(404).json({ message: "Vehicle not found" });
//         }
//         res.json(updated);
//     } catch (err) {
//         res.status(500).json({ message: err });
//     }
// });
// // app.patch("/vehicles/:id", async (req, res) => {
// //     const { id } = req.params;
// //     const { visible } = req.body;

// //     try {
// //         const updatedVehicle = await vehicleData.findByIdAndUpdate(
// //             id,
// //             { visible },
// //             { new: true }
// //         );
// //           if (!updatedVehicle) {
// //             return res.status(404).json({ message: "Vehicle not found" });
// //         }

// //         res.json(updatedProduct);
// //     } catch (err) {
// //         console.error("Update error:", err);
// //         res.status(500).json({ message: "Failed to update visibility" });
// //     }
// // });




// app.patch("/vehicles/:id", async (req, res) => {
//   const { id } = req.params;
  
//   try {
//     // Handle nested vehicleDetails.visible update
//     const updateFields = {};
//     if (req.body["vehicleDetails.visible"] !== undefined) {
//       updateFields["vehicleDetails.visible"] = req.body["vehicleDetails.visible"];
//     }
    
//     const updatedVehicle = await vehicleData.findByIdAndUpdate(
//       id,
//       { $set: updateFields },
//       { new: true, runValidators: true }
//     );
    
//     if (!updatedVehicle) {
//       return res.status(404).json({ message: "Vehicle not found" });
//     }

//     res.json(updatedVehicle);
//   } catch (err) {
//     console.error("Update error:", err);
//     res.status(500).json({ message: "Failed to update vehicle" });
//   }
// });

// app.patch("/vehicles/:id/remove-similar", async (req, res) => {
//     const { id } = req.params;
//     const { prodCode } = req.body;

//     try {
//         const updatedProduct = await vehicleData.findByIdAndUpdate(
//             id,
//             { $pull: { similarProducts: { ProdCode: prodCode } } },
//             { new: true }
//         );

//         res.json(updatedProduct);
//     } catch (err) {
//         console.error("Remove similar error:", err);
//         res.status(500).json({ message: "Failed to remove similar product" });
//     }
// });



// app.delete('/vehicles/:id', async (req, res) => {
//     try {
//         const vehicle = await vehicleData.findById(req.params.id);
//         if (!vehicle) {
//             return res.status(404).json({ message: "Product not found" });
//         }

//         // Delete main image from Cloudinary if it exists
//         if (vehicle.vehicleDetails.imagePublicId) {
//             await cloudinary.uploader.destroy(vehicle.vehicleDetails.imagePublicId);
//         }

//         // Delete additional files from Cloudinary
//         if (vehicle.vehicleDetails.additionalFiles && vehicle.vehicleDetails.additionalFiles.length > 0) {
//             for (const file of vehicle.vehicleDetails.additionalFiles) {
//                 if (file.public_id) {
//                     await cloudinary.uploader.destroy(file.public_id, {
//                         resource_type: file.type === 'video' ? 'video' : 'image'
//                     });
//                 }
//             }
//         }
//         // Delete from database
//         await vehicleData.findByIdAndDelete(req.params.id);
//         res.json({ message: "Product deleted successfully" });
//     }
//     catch (err) {
//         console.error("Delete error:", err);
//         res.status(500).json({ message: err });
//     }
// });



// app.listen(
//     PORT,
//     () => {
//         console.log(`Server running on port ${PORT}`);
//     }
// )



























const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const PORT = 3001;
// VEHICLE UPLOAD SCHEMA 
const vehicleData = require ('./Models/VehicleMainSchema');

//Image upload requirements 
const multer = require('multer');
const path = require('path');


// Enhanced CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
     'http://192.168.2.159:3000',
     'https://frontend-roadshow.vercel.app'
    ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization','X-Requested-With']
}));

app.use(bodyParser.json());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ✅ Explicitly handle preflight requests
// app.options('*', cors());

app.use("/images", express.static(path.join(__dirname, "../first-app/public/images")));
app.use(express.static('public'));
// mongoose.connect("mongodb://127.0.0.1:27017/AdinnRoadshow")
mongoose.connect("mongodb+srv://roadshowAdinn:doAztsUGMfooi5PY@roadshowadinn.sephmyg.mongodb.net/?appName=RoadshowAdinn"
//     , {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }
).then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use('/adminUserLogin', require('./UserAdminLogin'));
app.use('/EmployeeLogin', require('./LoginMain'));





// VEHICLE DETAILS STORED WITH CRUD OPERATIONS 
//IMAGE UPLOAD CLOUDINARY CORRECTED CODE
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { v2: cloudinary } = require('cloudinary');
cloudinary.config({
    cloud_name: 'dysuigknj',
    api_key: '133679639417399',
    api_secret: 'i4fzWaXH_32kQYkwWb3U-pLxKd4',
    secure: true // Add this for HTTPS
});


// Configure storage for main image upload
const imageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: 'VehicleMainImage',
            allowed_formats: ['jpg', 'jpeg', 'png'],
            // transformation: [
            //     { width: 1600, height: 1200, crop: 'limit', quality: 'auto' }
            // ]
        };
    }
});

const imageUpload = multer({
    storage: imageStorage,
    // limits: {
    //     fileSize: 5 * 1024 * 1024 // 5MB limit
    // }
});

app.post('/upload', imageUpload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        console.log("Main image URL:", req.file.path);
        console.log("Main image public_id:", req.file.filename);
        res.status(200).json({
            message: 'Upload successful',
            imageUrl: req.file.path,
            public_id: req.file.filename,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Upload failed' });
    }
});


// Configure storage for additional files
const additionalFileStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const isVideo = file.mimetype.startsWith('video/');
        return {
            folder: isVideo ? 'VehicleAddedVideos' : 'VehicleAddedImages',
            resource_type: isVideo ? 'video' : 'image',
            allowed_formats: isVideo ? ['mp4', 'mov', 'avi', 'mkv', 'webm'] : ['jpg', 'jpeg', 'png', 'gif'],
            // format: isVideo ? 'mp4' : 'jpg',
            // transformation: isVideo ? [] : [{ width: 800, height: 800, crop: 'limit' }]
            // transformation: isVideo ?
            //     { quality: 'auto', fetch_format: 'auto' } :
            //     { width: 800, height: 600, crop: 'limit', quality: 'auto' }

        };
    }
});

const additionalFileUpload = multer({ 
    storage: additionalFileStorage
 });

// Save files endpoint
app.post('/save-videos', additionalFileUpload.array('files', 5), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }
        const savedFiles = req.files.map(file => ({
            url: file.path,
            public_id: file.filename,
            type: file.mimetype.startsWith('video/') ? 'video' : 'image'
        }));
        console.log('Saved files:', savedFiles);
        res.status(200).json(savedFiles);
    } catch (err) {
        console.error('Error uploading additional files:', err);
        res.status(500).json({ error: 'File save failed' });
    }
});

// Delete endpoint
app.post('/delete-video', async (req, res) => {
    try {
        const { public_id, resource_type } = req.body;

        if (!public_id || !resource_type) {
            return res.status(400).json({ error: 'Missing parameters' });
        }

        const result = await cloudinary.uploader.destroy(public_id, {
            resource_type: resource_type
        });

        if (result.result === 'ok') {
            res.status(200).json({ message: 'File deleted successfully' });
        } else {
            res.status(400).json({ error: 'File deletion failed' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during file deletion' });
    }
});


//PRODUCTS    Other routes (get, post, put, delete)
app.get('/vehicles', async (req, res) => {
    try {
        const data = await vehicleData.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});


//GET THE PRODUCT USING ID FOR SPECIFIC PRODUCT
app.get('/vehicles/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await vehicleData.findById(id);
        if (!data) {
            res.status(404).json({ message: "Product not found" });
        }
        // res.json(data);
        const vehicle = data.toObject();
        // Ensure complete image URL
        if (vehicle.vehicleDetails.image && !vehicle.vehicleDetails.image.startsWith('http')) {
            vehicle.vehicleDetails.image = `${req.protocol}://${req.get('host')}${vehicle.vehicleDetails.image}`;
        }
        res.json(vehicle);
    }
    catch (err) {
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
app.get('/vehicles/similar/:vehicleId', async (req, res) => {
    try {
        const currentVehicle = await vehicleData.findOne({ 
            'vehicleDetails.vehicleID': req.params.vehicleId 
        });
        
        if (!currentVehicle || !currentVehicle.similarVehicles || currentVehicle.similarVehicles.length === 0) {
            return res.status(404).json({ message: "No similar vehicles found" });
        }

        // Extract similar vehicles' IDs
        const vehicleIDs = currentVehicle.similarVehicles.map(v => v.VehicleID);
        
        // Fetch details of all similar vehicles
        const similarVehicles = await vehicleData.find({
            'vehicleDetails.vehicleID': { $in: vehicleIDs }
        });

        res.json(similarVehicles);
    } catch (err) {
        console.error("Error fetching similar vehicles:", err);
        res.status(500).json({ message: "Error fetching similar vehicles" });
    }
});

app.post('/vehicles', async (req, res) => {
    try {
                console.log('Creating vehicle with data:', req.body);
        const vehicle = new vehicleData(req.body);
        const saved = await vehicle.save();
        console.log("Product saved to MongoDB:", saved);
        res.json(saved);
    } catch (err) {
        console.error("Error saving product to MongoDB:", err);
        res.status(500).json({
            message: err,
            details: err.errors // This will show validation errors
        });
    }
});

app.put('/vehicles/:id', async (req, res) => {
    try {
        // const id = req.params.id;
        const updated = await vehicleData.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
      updateFields["vehicleDetails.visible"] = req.body["vehicleDetails.visible"];
    }
    
    const updatedVehicle = await vehicleData.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
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
            { new: true }
        );

        res.json(updatedProduct);
    } catch (err) {
        console.error("Remove similar error:", err);
        res.status(500).json({ message: "Failed to remove similar product" });
    }
});



app.delete('/vehicles/:id', async (req, res) => {
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
        if (vehicle.vehicleDetails.additionalFiles && vehicle.vehicleDetails.additionalFiles.length > 0) {
            for (const file of vehicle.vehicleDetails.additionalFiles) {
                if (file.public_id) {
                    await cloudinary.uploader.destroy(file.public_id, {
                        resource_type: file.type === 'video' ? 'video' : 'image'
                    });
                }
            }
        }
        // Delete from database
        await vehicleData.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted successfully" });
    }
    catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ message: err });
    }
});



app.listen(
    PORT,
    () => {
        console.log(`Server running on port ${PORT}`);
    }
)