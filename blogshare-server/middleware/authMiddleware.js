import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async (req, res, next) => {
  const token = req.cookies?.token; 
  console.log(req.cookies);
  console.log("Token from cookie:", token);
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "Invalid user" });

    req.user = user; // Attach user to req
    req.userId = user._id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid Token" });
  }
};