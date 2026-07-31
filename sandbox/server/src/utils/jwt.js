import jwt from "jsonwebtoken";

export function generateToken(payload) {
  try {
    return jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
  } catch (err) {
    console.error("Token generation failed:", err);
    return null;
  }
}


export function verifyToken(token) {
  try {
    return jwt.verify(
      token,
      process.env.JWT_SECRET
    );
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return null;
  }
}