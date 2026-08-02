import { verifyToken } from "../utils/jwt.js";

export function authMiddleware(req, res, next) {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }

    const userId = decoded.userId || decoded.id || decoded._id;

    req.user = {
      ...decoded,
      userId,
      id: userId,
    };

    next();

  } catch (error) {
    console.error("Auth middleware error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}