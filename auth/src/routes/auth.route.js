import express from "express";
import passport from "passport";

import {
  googleCallback,
  logout,
  authFailed
} from "../controllers/auth.controller.js";


const router = express.Router();



// Continue With Google
router.get(
  "/google",
  passport.authenticate("google",{
    scope:[
      "profile",
      "email"
    ]
  })
);



// Google Callback
router.get(
  "/google/callback",

  passport.authenticate("google",{
    failureRedirect:"/auth/fail"
  }),

  googleCallback
);



// Logout
router.get(
  "/logout",
  logout
);



// Failed Auth
router.get(
  "/fail",
  authFailed
);



export default router;