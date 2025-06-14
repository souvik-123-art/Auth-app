import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res
      .status(400)
      .json({ success: false, message: "unauthorized - no token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    if (!decoded)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized invalid token" });

    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
