import express from "express";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authMiddleware from "../middlewares/authMiddleware.js";
import { sendEmail } from "../utils/sendEmail.js";

const router = express.Router();

// new user registration
router.post("/register", async (req, res) => {
  try {
    // check if user already exists
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      throw new Error("User already exists");
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    // save user
    const newUser = new User(req.body);
    await newUser.save();
    res.send({
      success: true,
      message: "User created  successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// user login
router.post("/login", async (req, res) => {
  try {
    // check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new Error("User does not exist");
    }

    // check if user is blocked
    if (user.status === "blocked") {
      throw new Error("User is blocked! Please contact admin.");
    }

    //compare password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      throw new Error("Invalid password");
    }

    //create and assign token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // sned response
    res.send({
      success: true,
      message: "User logged in successfully",
      data: token,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// get current user
router.get("/get-current-user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.send({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// get all users
router.get("/get-users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find();
    res.send({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// update user status
router.put("/update-user-status/:id", authMiddleware, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // return the updated document
    );

    if (!updatedUser) {
      return res.send({
        success: false,
        message: "User not found",
      });
    }

    // ✅ Send email to the user
    if (updatedUser.email) {
      await sendEmail({
        to: updatedUser.email,
        subject: "Your Account Status has been Updated",
        html: `
          <p>Hello ${updatedUser.name},</p>
          <p>Your account status on <strong>BiTKiT</strong> has been updated to: 
          <strong>${req.body.status}</strong>.</p>
          <p>If you believe this is a mistake or need further help, please contact support.</p>
          <br/>
          <p>– Team BiTKiT</p>
        `,
      });
    }

    res.send({
      success: true,
      message: "User status updated successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

export default router;
