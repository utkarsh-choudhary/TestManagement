import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: "Account is not active" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    console.log(req.user.role);
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: "You do not have permission to perform this action" 
      });
    }
    next();
  };
};

// Specific role middleware
export const isAdmin = authorize("ADMIN");
export const isHR = authorize("HR", "ADMIN");
export const isUser = authorize("USER", "HR", "ADMIN");

// Legacy middleware for backward compatibility
export const isAdminOrHR = (req, res, next) => {
  if (!['ADMIN', 'HR'].includes(req.user.role)) {
    return res.status(403).json({ 
      message: 'Access denied. Only HR and Admin users can access this resource.' 
    });
  }
  next();
}; 