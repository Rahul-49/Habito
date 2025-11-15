import express from "express";
import { registerUser, loginUser } from "../controllers/auth.js";
import passport from "passport";
import jwt from "jsonwebtoken";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth` }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    const redirectUrl = `${process.env.FRONTEND_URL}/login?token=${token}`;
    res.redirect(redirectUrl);
  }
);

export default router;