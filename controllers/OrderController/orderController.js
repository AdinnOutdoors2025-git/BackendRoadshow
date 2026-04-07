
const Order = require("../../Models/orderModel");
const Cart = require("../../Models/Cartmodel/cart");
const vehicleDetails = require("../../Models/vehicleDetails");
require('dotenv').config();
const { calculateOfferDetails } = require("../../ReusableComponents/reusableOfferLogic"); // correct path போடு

// ================= CREATE ORDER =================
// exports.createOrder = async (req, res) => {
//   try {

//     const userId = req.user._id;
//     const { name, phone, email, companyName, designation } = req.body;

   
//     if (!name || !phone)
//       return res.status(400).json({ message: "Name and Phone required" });

 

//     // ── Phone validation — only 10 digits ───
//     const phoneStr = phone.toString().trim();
//     if (!/^\d{10}$/.test(phoneStr)) {
//       return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
//     }
    
//     const cart = await Cart.findOne({ userId });

//     if (!cart || cart.items.length === 0) {
//       return res.status(400).json({ message: "Cart is empty for this user" });
//     }

//     // ── Latest offer check — recalculate all items before order ───
//     const recalculatedItems = [];

//     for (const item of cart.items) {
//       const offerDetails = await calculateOfferDetails({
//         vehicleModel: item.vehicleModel,
//         fromDate: item.fromDate,
//         toDate: item.toDate,
//         quantity: item.quantity,
//         pricePerDay: item.pricePerDay,
//       });

//       recalculatedItems.push({
//         vehicleModel: item.vehicleModel,
//         city: item.city,
//         quantity: item.quantity,
//         fromDate: item.fromDate,
//         toDate: item.toDate,
//         pricePerDay: item.pricePerDay,
//         totalDays: offerDetails.totalDays,
//         discountDays: offerDetails.discountDays,
//         noDiscountDays: offerDetails.noDiscountDays,
//         discountPercentage: offerDetails.discountPercentage,
//         discountAmount: offerDetails.discountAmount,
//         noDiscountAmount: offerDetails.noDiscountAmount,
//         actualAmount: offerDetails.actualAmount,
//         totalAmount: offerDetails.totalAmount,
//       });
//     }

//     const grandTotal = recalculatedItems.reduce(
//       (sum, item) => sum + item.totalAmount,
//       0
//     );

//     // ── Order ID generation ───
//     const today = new Date();
//     const year = today.getFullYear();
//     const month = String(today.getMonth() + 1).padStart(2, "0");
//     const day = String(today.getDate()).padStart(2, "0");
//     const datePrefix = `${year}${month}${day}`;

//     const startOfDay = new Date(year, today.getMonth(), today.getDate());
//     const endOfDay = new Date(year, today.getMonth(), today.getDate() + 1);

//     const todayOrdersCount = await Order.countDocuments({
//       createdAt: { $gte: startOfDay, $lt: endOfDay },
//     });

//     const orderId = `${datePrefix}UO#${todayOrdersCount + 1}`;

//     // ── Create order with recalculated items ───
//     const order = new Order({
//       orderId,
//       userId,
//       name,
//       phone,
//       email,
//       companyName,
//       designation,
//       bookingItems: recalculatedItems,
//       grandTotal,
//       pipelineLogs: [
//         {
//           fromStage: null,
//           toStage: "newOrder",
//           movedBy: "System",
//           movedAt: new Date(),
//         },
//       ],
//     });

//     await order.save();

//     // ── Update vehicle availability ───
//     for (const item of recalculatedItems) {
//       const vehiclesToBook = await vehicleDetails
//         .find({
//           modelType: item.vehicleModel,
//           city: item.city,
//           availability: "Available",
//         })
//         .limit(item.quantity);

//       for (const vehicle of vehiclesToBook) {
//         vehicle.availability = "Booked";
//         await vehicle.save();
//       }
//     }

//     await Cart.deleteOne({ userId });

//     return res.status(200).json({
//       message: "Order created successfully",
//       order,
//     });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, phone, email, companyName, designation } = req.body;

    if (!name || !phone)
      return res.status(400).json({ message: "Name and Phone required" });

    const phoneStr = phone.toString().trim();
    if (!/^\d{10}$/.test(phoneStr)) {
      return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty for this user" });
    }

    const recalculatedItems = [];

    for (const item of cart.items) {
      const offerDetails = await calculateOfferDetails({
        vehicleModel: item.vehicleModel,
        fromDate: item.fromDate,
        toDate: item.toDate,
        quantity: item.quantity,
        pricePerDay: item.pricePerDay,
      });

      recalculatedItems.push({
        vehicleModel: item.vehicleModel,
        vehicleImage:item.vehicleImage,
        city: item.city,
        quantity: item.quantity,
        fromDate: item.fromDate,
        toDate: item.toDate,
        pricePerDay: item.pricePerDay,
        totalDays: offerDetails.totalDays,
        discountDays: offerDetails.discountDays,
        noDiscountDays: offerDetails.noDiscountDays,
        discountPercentage: offerDetails.discountPercentage,
        discountAmount: offerDetails.discountAmount,
        noDiscountAmount: offerDetails.noDiscountAmount,
        actualAmount: offerDetails.actualAmount,
        totalAmount: offerDetails.totalAmount,
      });
    }

    const grandTotal = recalculatedItems.reduce(
      (sum, item) => sum + item.totalAmount,
      0
    );

    // ── Order ID generation ───
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const datePrefix = `${year}${month}${day}`;

    const startOfDay = new Date(year, today.getMonth(), today.getDate());
    const endOfDay = new Date(year, today.getMonth(), today.getDate() + 1);

    const todayOrdersCount = await Order.countDocuments({
      createdAt: { $gte: startOfDay, $lt: endOfDay },
    });

    const orderId = `${datePrefix}UO#${todayOrdersCount + 1}`;

    const order = new Order({
      orderId,
      userId,
      name,
      phone,
      email,
      companyName,
      designation,
      bookingItems: recalculatedItems,
      grandTotal,
      pipelineLogs: [
        {
          fromStage: null,
          toStage: "newOrder",
          movedBy: "System",
          movedAt: new Date(),
        },
      ],
    });

    await order.save();

    // ── Update vehicle availability ───
    for (const item of recalculatedItems) {
      const vehiclesToBook = await vehicleDetails
        .find({
          modelType: item.vehicleModel,
          city: item.city,
          availability: "Available",
        })
        .limit(item.quantity);

      for (const vehicle of vehiclesToBook) {
        vehicle.availability = "Booked";
        await vehicle.save();
      }
    }

    await Cart.deleteOne({ userId });

    // ── Send order notification to external API ───
    try {
      const orderDate = `${String(today.getDate()).padStart(2, "0")}-${month}-${year}`;

      const subtotal = recalculatedItems.reduce(
        (sum, item) => sum + item.actualAmount,
        0
      );

      const totalDiscount = recalculatedItems.reduce(
        (sum, item) => sum + item.discountAmount,
        0
      );

      // GST 18% on grandTotal
      const gst = Math.round(grandTotal * 0.18);
      const totalWithGst = grandTotal + gst;

      const externalPayload = {
        mailtype: "roadshowOrder",
        orderId: orderId,
        orderDate: orderDate,
        subtotal: subtotal,
        discount: totalDiscount,
        gst: gst,
        totalAmount: totalWithGst,
        orders: recalculatedItems.map((item) => ({
          vehicleType: item.vehicleModel,
          productId: item.vehicleModel,         
          vehicleCount: item.quantity,
          pricePerDay: String(item.pricePerDay),
          location: item.city,
          startDate: new Date(item.fromDate).toISOString().split("T")[0],
          endDate: new Date(item.toDate).toISOString().split("T")[0],
        })),
      };

      console.log(externalPayload)

      await fetch(process.env.EXTERNAL_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(externalPayload),
      });

    } catch (mailError) {
      // Mail fail ஆனாலும் order response block ஆகாது
      console.error("External API notification failed:", mailError.message);
    }

    return res.status(200).json({
      message: "Order created successfully",
      order,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= GET ALL ORDERS =================
// All users data 

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: orders.length,
      orders,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// particular users data 

// exports.getOrders = async (req, res) => {
//   try {
//     const userId = req.user._id; // logged-in user id

//     const orders = await Order.find({ userId }) // filter here
//       .sort({ createdAt: -1 });

//     return res.status(200).json({
//       success: true,
//       total: orders.length,
//       orders,
//     });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// ================= UPDATE PIPELINE =================
exports.updateOrderPipeline = async (req, res) => {
  try {
    const { pipelineStatus, movedBy, handlername, reasonDescription } = req.body;

    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const oldStage = order.pipelineStatus;
    order.pipelineStatus = pipelineStatus;

    if (handlername !== undefined) order.handlername = handlername;
    if (reasonDescription) order.reasonDescription = reasonDescription;

    order.pipelineLogs.push({
      fromStage: oldStage,
      toStage: pipelineStatus,
      movedBy: movedBy || "Admin",
      movedAt: new Date(),
    });

    await order.save();

    return res.status(200).json({
      message: "Pipeline updated successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};