import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/errorHandler.js";

dotenv.config();

export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return errorHandler(res, 401, "Unauthorized");

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (!decoded) return errorHandler(res, 401, "Unauthorized - Invalid token");

    const user = await User.findById(decoded.id).select("-password");

    if (!user) return errorHandler(res, 404, "user not found");
    req.user = user;
    next();
  } catch (error) {
    const status =
      error.name === "JsonWebTokenError" || error.name === "TokenExpiredError"
        ? 401
        : 500;
    const message = "Unauthorized - Invalid token or expired";

    return errorHandler(res, status, message);
  }
};
