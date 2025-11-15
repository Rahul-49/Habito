import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  images: {
    type: [String],
    validate: {
      validator: function (arr) { return Array.isArray(arr) && arr.length > 0; },
      message: "At least one image is required",
    },
    required: true,
  },
  isVerified: { type: Boolean, default: false },
  // New optional fields
  details: { type: String, required: true },
  propertyType: { type: String, required: true }, // e.g., Apartment, House, Villa, Plot, Office
  furnished: { type: String, required: true },    // e.g., Unfurnished, Semi-furnished, Furnished
  parking: { type: String, required: true },      // e.g., Yes/No or number of slots
  availableFrom: { type: Date, required: true },
  features: [String],
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  area: { type: Number, required: true },       // Sq.ft
  yearBuilt: { type: Number, required: true },
  ownerEmail: { type: String, required: true },
  ownerPhone: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export default mongoose.model("Property", propertySchema);