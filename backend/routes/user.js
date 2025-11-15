import express from "express";
import { createProperty, getProperties,getUserProperties } from "../controllers/property.js";
import { protect } from "../middleware/auth.js";
import { getUserFavourite,addUserFavourite, removeUserFavourite } from "../controllers/property.js";

const router = express.Router();

router.get("/getUserProperties", protect, getUserProperties);
router.get("/getUserFavourite", protect, getUserFavourite);
router.post("/addUserFavourite", protect, addUserFavourite);
router.delete("/removeUserFavourite/:propertyId", protect, removeUserFavourite);
export default router;