const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to authenticate users based on JWT tokens
exports.authenticate = async (req, res, next) => {
  try {
    // Get token from cookies, headers, or request body
    const token = 
      req.cookies?.token || 
      req.headers.authorization?.replace("Bearer ", "") || 
      req.body.token;
    
    // If no token found, deny access
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please login."
      });
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(
        token, 
        process.env.JWT_SECRET || "pizza-delivery-secret"
      );
      
      // Find user by ID
      const user = await User.findById(decoded.id)
        .select("-password")
        .lean()
        .exec();
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid token: User not found"
        });
      }
      
      // Attach user info to request object
      req.user = decoded;
      next();
    } catch (error) {
      // Handle token verification errors
      console.error("Token verification error:", error.message);
      
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Session expired. Please login again."
        });
      }
      
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token"
      });
    }
  } catch (error) {
    console.error("Authentication middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication"
    });
  }
};

// Check if user is an admin
exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Admin privileges required"
      });
    }
    next();
  } catch (error) {
    console.error("Admin authorization error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during authorization"
    });
  }
};