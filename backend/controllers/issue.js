import Issue from "../model/Issue.js";
import Property from "../model/Property.js";

// Create a new issue (user)
export const createIssue = async (req, res) => {
  try {
    const { propertyId, category, description } = req.body || {};
    if (!propertyId || !category) {
      return res.status(400).json({ message: "propertyId and category are required" });
    }

    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: "Property not found" });

    const issue = await Issue.create({
      property: propertyId,
      reporter: req.user._id,
      category,
      description: description || "",
    });

    const populated = await issue.populate([
      { path: "property", select: "title location price" },
      { path: "reporter", select: "name email" },
    ]);

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// List issues for admin with optional filters
export const getIssues = async (req, res) => {
  try {
    const { status, category, property } = req.query || {};
    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (property) query.property = property;

    const issues = await Issue.find(query)
      .sort({ createdAt: -1 })
      .populate({ path: "property", select: "title location price" })
      .populate({ path: "reporter", select: "name email" });

    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// List issues reported by the current user
export const getMyIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ reporter: req.user._id })
      .sort({ createdAt: -1 })
      .populate({ path: "property", select: "title location price" });

    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update status: pending -> under_review -> resolved (admin)
export const updateIssueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};
    const allowed = ["pending", "under_review", "resolved"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const issue = await Issue.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate({ path: "property", select: "title location price" })
      .populate({ path: "reporter", select: "name email" });

    if (!issue) return res.status(404).json({ message: "Issue not found" });

    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a note to an issue (admin or reporter)
export const addIssueNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body || {};
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Note text is required" });
    }

    const issue = await Issue.findById(id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    // Only admin or the original reporter can add a note
    const isAdmin = req.user?.role === "admin";
    const isReporter = issue.reporter?.toString() === req.user._id.toString();
    if (!isAdmin && !isReporter) {
      return res.status(403).json({ message: "Forbidden" });
    }

    issue.notes.push({ author: req.user._id, text: text.trim() });
    await issue.save();
    const populated = await issue
      .populate({ path: "property", select: "title location price" })
      .populate({ path: "reporter", select: "name email" })
      .populate({ path: "notes.author", select: "name email" });

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
