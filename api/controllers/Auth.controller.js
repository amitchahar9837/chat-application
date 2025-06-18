import User from "../models/user.model.js";
import { errorHandler } from "../utils/errorHandler.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { generateToken } from "../utils/generateToken.js";
import cloudinary from "../lib/cloudinary.js";

dotenv.config();

//SIGNUP Controller
export const signup = async (req, res) => {
  const { email, password, fullName } = req.body;

  if (!email) {
    return errorHandler(res, 404, "Validation error.", {
      email: ["The email field is required."],
    });
  }
  if (!password) {
    return errorHandler(res, 404, "Validation error.", {
      password: ["The password field is required."],
    });
  }
  if (!fullName) {
    return errorHandler(res, 404, "Validation error.", {
      fullName: ["The fullname field is required."],
    });
  }
  if (fullName.length < 3) {
    return errorHandler(res, 404, "Validation error.", {
      fullName: ["The fullname field must be at least 3 characters long."],
    });
  }
  if (!fullName) {
    return errorHandler(res, 404, "Validation error.", {
      fullName: ["The fullname field is required."],
    });
  }
  if (password.length < 6) {
    return errorHandler(res, 404, "Validation error.", {
      password: ["The password must be at least 6 characters long."],
    });
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return errorHandler(res, 404, "Validation error.", {
      email: ["The email is not valid."],
    });
  }
  if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password)) {
    return errorHandler(res, 404, "Validation error.", {
      password: [
        "The password must contain at least one letter and one number.",
      ],
    });
  }
  if (!/^[a-zA-Z ]+$/.test(fullName)) {
    return errorHandler(res, 404, "Validation error.", {
      fullName: ["The fullname field must contain only letters."],
    });
  }
  if (fullName.length > 30) {
    return errorHandler(res, 404, "Validation error.", {
      fullName: ["The fullname field must be at most 30 characters long."],
    });
  }
  try {
    const existUser = await User.findOne({ email });
    if (existUser)
      return errorHandler(res, 400, "Email already in use.", {
        email: ["A user with this email already exists."],
      });

    const newUser = new User({
      email,
      password,
      fullName,
    });

    await newUser.save();

    generateToken(newUser._id, res);
    const { password: _, ...rest } = newUser._doc;
    res.status(201).json({
      success: true,
      message: "Signup Successful",
      data: {
        user: rest,
      },
    });
  } catch (error) {
    errorHandler(res, error.statusCode, error.message);
  }
};

//LOGIN Controller
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return errorHandler(res, 404, "Validation error.", {
      email: ["The email field is required."],
    });
  }
  if (!password) {
    return errorHandler(res, 404, "Validation error.", {
      password: ["The password field is required."],
    });
  }
  try {
    const existUser = await User.findOne({ email });
    if (!existUser) return errorHandler(res, 404, "User not found.");
    if (!(await bcrypt.compare(password, existUser.password)))
      return errorHandler(res, 404, "Wrong credentials.");

    generateToken(existUser._id, res);
    const { password: _, ...rest } = existUser._doc;
    res.status(200).json({
      success: true,
      message: "Login Successful",
      data: {
        user: rest,
      },
    });
  } catch (error) {
    errorHandler(res, error.statusCode, error.message);
  }
};

//LOGOUT Controller
export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({
      success: true,
      message: "Logout Successful",
      data: {},
    });
  } catch (error) {
    errorHandler(res, error.statusCode, error.message);
  }
};

//UPDATE-PROFILE CONTROLLER
export const updateProfile = async (req, res) => {
  try {
    const { proflePic } = req.body;
    const userId = req.user._id;

    if (!proflePic)
      return errorHandler(res, 400, "validation error.", {
        proflePic: ["Profile Pic is required"],
      });

    const uploadResponse = await cloudinary.uploader.upload(proflePic);
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updateUser);
  } catch (error) {
    errorHandler(res, error.statusCode, error.message);
  }
};

//   CHECK THE AUTHORIZATION HANDLER

export const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    errorHandler(res, error.statusCode, error.message);
  }
};
