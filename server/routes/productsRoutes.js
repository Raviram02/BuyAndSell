import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import Product from "../models/productModel.js";
import cloudinary from "../config/cloudinaryConfig.js";
import multer from "multer";
import User from "../models/userModel.js";
import Notification from "../models/notificationModel.js";
import { sendEmail } from "../utils/sendEmail.js";

const router = express.Router();

// add a new product
router.post("/add-product", authMiddleware, async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();

    // find all admins
    const admins = await User.find({ role: "admin" });

    admins.forEach(async (admin) => {
      // App notification
      const newNotification = new Notification({
        user: admin._id,
        message: `New product added${req.user?.name ? " by " + req.user.name : ""}.`,
        title: "New product",
        onClick: "/admin",
        read: false,
      });
      await newNotification.save();

      // Email notification
      if (admin.email) {
        await sendEmail({
          to: admin.email,
          subject: "New Product Added on BiTKiT",
          html: `
            <p>Hello ${admin.name},</p>
            <p>A new product has been added to BiTKiT${req.user?.name ? ` by <strong>${req.user.name}</strong>` : ""}.</p>
            <p>Visit <a href="http://localhost:5173/admin">BiTKiT Admin Panel</a> to review it.</p>
            <br/>
            <p>– Team BiTKiT</p>
          `,
        });
      }
    });

    res.send({
      success: true,
      message: "Product added successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// get all products
router.post("/get-products", async (req, res) => {
  try {
    const { seller, category = [], age = [], status, search } = req.body || {};
    let filters = {};
    if (seller) {
      filters.seller = seller;
    }
    if (status) {
      filters.status = status;
    }
    // filter by category
    if (category.length > 0) {
      filters.category = { $in: category };
    }
    // search by name, category, or description
    if (search && search.trim() !== "") {
      filters.$or = [
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    const products = await Product.find(filters)
      .populate("seller")
      .sort({ createdAt: -1 });
    res.send({
      success: true,
      data: products,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// get product by id
router.get("/get-product-by-id/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("seller");
    res.send({
      success: true,
      data: product,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// edit a product
router.put("/edit-product/:id", authMiddleware, async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, req.body);
    res.send({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// delete a product
router.delete("/delete-product/:id", authMiddleware, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// get image from pc
const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});

router.post(
  "/upload-image-to-product",
  authMiddleware,
  multer({ storage: storage }).single("file"),
  async (req, res) => {
    try {
      //upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "BuyAndSell",
      });
      const productId = req.body.productId;
      await Product.findByIdAndUpdate(productId, {
        $push: { images: result.secure_url },
      });
      res.send({
        success: true,
        message: "Image uploaded successfully",
        data: result.secure_url,
      });
    } catch (error) {
      res.send({
        success: false,
        message: error.message,
      });
    }
  }
);

// update product status
router.put("/update-product-status/:id", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true } // return updated product
    ).populate("seller"); 

    if (!updatedProduct || !updatedProduct.seller?.email) {
      return res.send({
        success: false,
        message: "Product or seller not found",
      });
    }

    // App notification to seller
    const newNotification = new Notification({
      user: updatedProduct.seller._id,
      message: `Your product ${updatedProduct.name} has been ${status}.`,
      title: "Product status updated",
      onClick: "/profile",
      read: false,
    });
    await newNotification.save();

    // Send email to seller
    await sendEmail({
      to: updatedProduct.seller.email,
      subject: `Your Product Status Has Been Updated`,
      html: `
        <p>Hello ${updatedProduct.seller.name},</p>
        <p>Your product <strong>${updatedProduct.name}</strong> has been <strong>${status}</strong> by BiTKiT admin team.</p>
        <p>Visit your <a href="http://localhost:5173/profile">profile</a> to view details.</p>
        <br/>
        <p>– Team BiTKiT</p>
      `,
    });

    res.send({
      success: true,
      message: "Product status updated successfully",
    });
  } catch (error) {
    console.error("Error updating product status:", error);
    res.send({
      success: false,
      message: error.message,
    });
  }
});

export default router;
