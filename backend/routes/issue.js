import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import { createIssue, getIssues, getMyIssues, updateIssueStatus, addIssueNote } from "../controllers/issue.js";

const router = express.Router();

// Create an issue (user)
router.post("/", protect, createIssue);

// List all issues (admin)
router.get("/", protect, authorize("admin"), getIssues);

// Current user's issues
router.get("/mine", protect, getMyIssues);

// Update issue status (admin)
router.patch("/:id/status", protect, authorize("admin"), updateIssueStatus);

// Add a note to an issue (admin or original reporter)
router.post("/:id/notes", protect, addIssueNote);

export default router;
