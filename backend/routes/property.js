import express from "express";
import { createProperty, getProperties, getUserProperties, verifyProperty, deleteProperty } from "../controllers/property.js";
import { protect } from "../middleware/auth.js";
import multer from "multer";
import { storage } from "../config/cloudinary.js";

const router = express.Router();
const upload = multer({ storage });

router.route("/")
  .post(protect, upload.array("images", 10), createProperty)
  .get(getProperties);

router.get("/getUserProperties", protect, getUserProperties);

// Verify a property
router.put("/:id/verify", protect, verifyProperty);

// Delete a property
router.delete("/:id", protect, deleteProperty);
export default router;