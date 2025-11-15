import Property from "../model/Property.js";
import User from "../model/User.js";

export const createProperty = async (req, res) => {
  try {
    const fileUrls = Array.isArray(req.files) ? req.files.map((f) => f.path) : [];
    const isVerified = req.body?.isVerified === "true" || req.body?.isVerified === true;
    const price = req.body?.price !== undefined ? Number(req.body.price) : undefined;
    const bedrooms = req.body?.bedrooms !== undefined && req.body.bedrooms !== "" ? Number(req.body.bedrooms) : undefined;
    const bathrooms = req.body?.bathrooms !== undefined && req.body.bathrooms !== "" ? Number(req.body.bathrooms) : undefined;
    const area = req.body?.area !== undefined && req.body.area !== "" ? Number(req.body.area) : undefined;
    const yearBuilt = req.body?.yearBuilt !== undefined && req.body.yearBuilt !== "" ? Number(req.body.yearBuilt) : undefined;

    // Normalize features from either 'features' or 'features[]'
    const featuresRaw = req.body?.features !== undefined ? req.body.features : req.body?.["features[]"];
    let features = [];
    if (Array.isArray(featuresRaw)) {
      features = featuresRaw;
    } else if (typeof featuresRaw === "string" && featuresRaw.trim()) {
      features = [featuresRaw];
    }

    const payload = {
      ...req.body,
      ...(price !== undefined ? { price } : {}),
      ...(bedrooms !== undefined ? { bedrooms } : {}),
      ...(bathrooms !== undefined ? { bathrooms } : {}),
      ...(area !== undefined ? { area } : {}),
      ...(yearBuilt !== undefined ? { yearBuilt } : {}),
      ...(req.body?.availableFrom ? { availableFrom: new Date(req.body.availableFrom) } : {}),
      ...(features.length ? { features } : {}),
      ...(req.body?.isVerified !== undefined ? { isVerified } : {}),
      ...(fileUrls.length ? { images: fileUrls } : {}),
      owner: req.user._id,
    };
    const property = await Property.create(payload);
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProperties = async (req, res) => {
  try {
    const { location, minPrice, maxPrice } = req.query;
    const query = {};

    if (location) query.location = { $regex: location, $options: "i" };
    if (minPrice || maxPrice)
      query.price = { ...(minPrice && { $gte: minPrice }), ...(maxPrice && { $lte: maxPrice }) };

    const properties = await Property.find(query).populate("owner", "name email");
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProperties = async (req, res) => {
  try {
    const query = { owner: req.user._id };

    const properties = await Property.find(query).populate("owner", "name email");
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserFavourite = async (req, res) => {
  try {
    // Find the user and populate their favourite properties
    const user = await User.findById(req.user._id).populate({
      path: "favourites",
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.favourites || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addUserFavourite = async (req, res) => {
  try {
    const { propertyId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Ensure favourites array exists
    if (!Array.isArray(user.favourites)) user.favourites = [];

    // Check if already in favourites
    const exists = user.favourites.some((fav) => fav?.toString() === propertyId);
    if (exists) {
      return res.status(400).json({ message: "Property already in favourites" });
    }

    // Add to favourites
    user.favourites.push(propertyId);
    await user.save();

    res.status(200).json({
      message: "Property added to favourites",
      favourites: user.favourites,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeUserFavourite = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (!Array.isArray(user.favourites)) user.favourites = [];

    user.favourites = user.favourites.filter((fav) => fav?.toString() !== propertyId);
    await user.save();

    res.status(200).json({
      message: "Property removed from favourites",
      favourites: user.favourites,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify a property (set isVerified true/false)
export const verifyProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body || {};

    if (typeof isVerified !== "boolean") {
      return res.status(400).json({ message: "isVerified must be a boolean" });
    }

    const property = await Property.findByIdAndUpdate(
      id,
      { isVerified },
      { new: true }
    ).populate("owner", "name email");

    if (!property) return res.status(404).json({ message: "Property not found" });

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a property
export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Property.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Property not found" });
    res.status(200).json({ message: "Property deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
