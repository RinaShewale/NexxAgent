import { SendAuthNotification } from "../config/mq.js";
import User from "../models/user.model.js";


// Google OAuth Callback Controller
export const googleCallback = async (req, res) => {
  try {

    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "Google authentication failed"
      });
    }


    await SendAuthNotification({
      userId: user._id,
      action: "google_login",
      timestamp: new Date(),
      email: user.email,
      name: user.name,
      avatar: user.avatar
    });


    return res.redirect(
      `${process.env.CLIENT_URL}/dashboard`
    );


  } catch (error) {

    console.log("Google Callback Error:", error);

    return res.status(500).json({
      message: "Internal server error"
    });

  }
};



// Logout Controller
export const logout = async (req, res) => {

  try {

    req.logout((err) => {

      if (err) {
        return res.status(500).json({
          message: "Logout failed"
        });
      }


      req.session.destroy((err) => {

        if (err) {
          return res.status(500).json({
            message: "Session destroy failed"
          });
        }


        res.clearCookie("connect.sid");


        return res.status(200).json({
          success: true,
          message: "Logged out successfully"
        });

      });

    });


  } catch (error) {

    console.log("Logout Error:", error);

    return res.status(500).json({
      message: "Server error"
    });

  }
};



// Authentication Failed Controller
export const authFailed = (req, res) => {

  res.status(401).json({
    success: false,
    message: "Google Authentication Failed"
  });

};