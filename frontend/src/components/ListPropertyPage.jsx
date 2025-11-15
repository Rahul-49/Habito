import React, { useState, useEffect } from "react";
import { Home, Upload, MapPin, FileText, IndianRupee, Image, Calendar } from "lucide-react";
import axios from "axios";
import SidebarLayout from "./SidebarLayout.jsx";

const ListPropertyPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    details: "",
    propertyType: "",
    furnished: "",
    parking: "",
    availableFrom: "",
    features: [],
    featureInput: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    yearBuilt: "",
    ownerEmail: "",
    ownerPhone: ""
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [genLoading, setGenLoading] = useState(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const generateDescription = async () => {
    try {
      setGenLoading(true);
      setError("");
      const title = (formData.title || "").trim();
      const location = (formData.location || "").trim();
      const area = Number(formData.area || 0);
      const price = Number(formData.price || 0);
      if (!title || !location || !area || !price) {
        setError("Enter title, location, price and area to generate a description.");
        setGenLoading(false);
        return;
      }
      const res = await fetch("http://localhost:5000/ai/describe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, location, area, price })
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "AI generate failed");
      }
      const data = await res.json();
      const desc = (data?.description || "").trim();
      if (!desc) throw new Error("Empty description from AI");
      setFormData(prev => ({ ...prev, description: desc }));
    } catch (e) {
      setError("Failed to generate description. Please try again.");
    } finally {
      setGenLoading(false);
    }
  };

  // Features add/remove handlers
  const addFeature = () => {
    const value = (formData.featureInput || "").trim();
    if (!value) return;
    if (formData.features.includes(value)) {
      setFormData(prev => ({ ...prev, featureInput: "" }));
      return;
    }
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, value],
      featureInput: ""
    }));
  };

  const removeFeature = (idx) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== idx)
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedFiles(files);
      
      // Create previews for all selected files
      const previewUrls = [];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previewUrls.push(reader.result);
          if (previewUrls.length === files.length) {
            setPreviews(previewUrls);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Client-side validation for required fields
      const requiredFields = [
        'title','description','details','price','location','propertyType','furnished','parking',
        'availableFrom','bedrooms','bathrooms','area','yearBuilt','ownerEmail','ownerPhone'
      ];
      for (let i = 0; i < requiredFields.length; i++) {
        const k = requiredFields[i];
        const v = formData[k];
        if (v === undefined || v === null || String(v).trim() === "") {
          setLoading(false);
          setError("Please fill all required fields.");
          return;
        }
      }
      if (selectedFiles.length === 0) {
        setLoading(false);
        setError("Please upload at least one property image.");
        return;
      }
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', Number(formData.price));
      formDataToSend.append('location', formData.location);
      // New fields
      if (formData.details) formDataToSend.append('details', formData.details);
      if (formData.propertyType) formDataToSend.append('propertyType', formData.propertyType);
      if (formData.furnished) formDataToSend.append('furnished', formData.furnished);
      if (formData.parking) formDataToSend.append('parking', formData.parking);
      if (formData.availableFrom) formDataToSend.append('availableFrom', formData.availableFrom);
      if (formData.bedrooms !== "") formDataToSend.append('bedrooms', Number(formData.bedrooms));
      if (formData.bathrooms !== "") formDataToSend.append('bathrooms', Number(formData.bathrooms));
      if (formData.area !== "") formDataToSend.append('area', Number(formData.area));
      if (formData.yearBuilt !== "") formDataToSend.append('yearBuilt', Number(formData.yearBuilt));
      if (Array.isArray(formData.features) && formData.features.length) {
        formData.features.forEach(f => formDataToSend.append('features[]', f));
      }
      if (formData.ownerEmail) formDataToSend.append('ownerEmail', formData.ownerEmail);
      if (formData.ownerPhone) formDataToSend.append('ownerPhone', formData.ownerPhone);
      
      // Append all image files
      selectedFiles.forEach((file) => {
        formDataToSend.append('images', file);
      });

      const token = localStorage.getItem('token');
      const response = await axios.post("http://localhost:5000/properties", formDataToSend, {
        headers: {
          // Let the browser set the proper multipart/form-data boundary
          'Authorization': `Bearer ${token}`
        }
      });

      setSuccess(true);
      setFormData({
        title: "",
        description: "",
        price: "",
        location: "",
        images: "",
        details: "",
        propertyType: "",
        furnished: "",
        parking: "",
        availableFrom: "",
        features: [],
        featureInput: "",
        bedrooms: "",
        bathrooms: "",
        area: "",
        yearBuilt: "",
        ownerEmail: "",
        ownerPhone: ""
      });
      setSelectedFiles([]);
      setPreviews([]);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarLayout>
      <div className="container py-5 bg-light" style={{ minHeight: '100%' }}>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="text-center mb-4">
              <div className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle mb-3" style={{ width: '80px', height: '80px' }}>
                <Home size={40} />
              </div>
              <h2 className="fw-bold mb-2">List Your Property</h2>
              <p className="text-muted">Fill the form below to list your property on our platform</p>
            </div>

            {success && (
              <div className="alert alert-success alert-dismissible fade show" role="alert">
                <strong>Success!</strong> Your property has been listed successfully.
                <button type="button" className="btn-close" onClick={() => setSuccess(false)}></button>
              </div>
            )}

            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error!</strong> {error}
                <button type="button" className="btn-close" onClick={() => setError("")}></button>
              </div>
            )}

            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    <FileText size={18} className="me-2" />
                    Property Title *
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Spacious 3BHK Apartment in Downtown"
                  />
                </div>

                <div className="mb-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <label className="form-label fw-semibold mb-0">
                      <FileText size={18} className="me-2" />
                      Description *
                    </label>
                    <button
                      type="button"
                      className="btn btn-sm btn-primary d-flex align-items-center gap-2 mb-2 p-2"
                      onClick={generateDescription}
                      disabled={genLoading}
                      title="Auto-generate using AI"
                    >
                      {genLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm"></span>
                          Generating...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-stars"></i>
                          Generate with AI
                        </>
                      )}
                    </button>
                  </div>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="4"
                    placeholder="Describe your property in detail..."
                  ></textarea>
                  <div className="form-text">Include key features, amenities, and nearby facilities</div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    <FileText size={18} className="me-2" />
                    Property Details
                  </label>
                  <textarea
                    className="form-control"
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    required
                    rows="3"
                    placeholder="Extra details like facing, floor, society, landmarks, etc."
                  ></textarea>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      <IndianRupee size={18} className="me-2" />
                      Price *
                    </label>
                    <div className="input-group input-group-lg">
                      <span className="input-group-text">₹</span>
                      <input
                        type="number"
                        className="form-control"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        placeholder="123345"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      <MapPin size={18} className="me-2" />
                      Location *
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Mumbai, Maharashtra"
                    />
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Property Type</label>
                    <select
                      className="form-select form-select-lg"
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select type</option>
                      <option>Apartment</option>
                      <option>House</option>
                      <option>Villa</option>
                      <option>Plot</option>
                      <option>Office</option>
                      <option>Shop</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Furnished</label>
                    <select
                      className="form-select form-select-lg"
                      name="furnished"
                      value={formData.furnished}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select</option>
                      <option>Unfurnished</option>
                      <option>Semi-furnished</option>
                      <option>Furnished</option>
                    </select>
                  </div>
                </div>

                {/* Bedrooms / Bathrooms / Area / Year Built */}
                <div className="row g-3 mb-4">
                  <div className="col-6 col-md-3">
                    <label className="form-label fw-semibold">Bedrooms</label>
                    <input
                      type="number"
                      className="form-control form-control-lg"
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleChange}
                      min="0"
                      required
                      placeholder="e.g., 3"
                    />
                  </div>
                  <div className="col-6 col-md-3">
                    <label className="form-label fw-semibold">Bathrooms</label>
                    <input
                      type="number"
                      className="form-control form-control-lg"
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleChange}
                      min="0"
                      required
                      placeholder="e.g., 2"
                    />
                  </div>
                  <div className="col-6 col-md-3">
                    <label className="form-label fw-semibold">Sq.ft</label>
                    <input
                      type="number"
                      className="form-control form-control-lg"
                      name="area"
                      value={formData.area}
                      onChange={handleChange}
                      min="0"
                      required
                      placeholder="e.g., 1200"
                    />
                  </div>
                  <div className="col-6 col-md-3">
                    <label className="form-label fw-semibold">Built (Year)</label>
                    <input
                      type="number"
                      className="form-control form-control-lg"
                      name="yearBuilt"
                      value={formData.yearBuilt}
                      onChange={handleChange}
                      min="1800"
                      max="2100"
                      required
                      placeholder="e.g., 2018"
                    />
                  </div>
                </div>

                {/* Features & Amenities */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Features & Amenities</label>
                  <div className="input-group input-group-lg mb-2">
                    <input
                      type="text"
                      className="form-control"
                      name="featureInput"
                      value={formData.featureInput}
                      onChange={handleChange}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
                      placeholder="e.g., Pool, Gym, Lift, Garden"
                    />
                    <button type="button" className="btn btn-outline-primary" onClick={addFeature}>
                      Add
                    </button>
                  </div>
                  {Array.isArray(formData.features) && formData.features.length > 0 && (
                    <div className="d-flex flex-wrap gap-2">
                      {formData.features.map((f, idx) => (
                        <span key={`${f}-${idx}`} className="badge bg-secondary d-inline-flex align-items-center" style={{ fontSize: '0.9rem' }}>
                          <span className="me-2">{f}</span>
                          <button type="button" className="btn-close btn-close-white" aria-label="Remove" onClick={() => removeFeature(idx)} style={{ fontSize: '0.6rem' }} />
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Parking</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      name="parking"
                      value={formData.parking}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Yes, 1 covered + 1 open"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      <Calendar size={18} className="me-2" />
                      Available From
                    </label>
                    <input
                      type="date"
                      className="form-control form-control-lg"
                      name="availableFrom"
                      value={formData.availableFrom}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Owner Email</label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      name="ownerEmail"
                      value={formData.ownerEmail}
                      onChange={handleChange}
                      required
                      placeholder="owner@example.com"
                    />
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Owner Contact</label>
                    <input
                      type="tel"
                      className="form-control form-control-lg"
                      name="ownerPhone"
                      value={formData.ownerPhone}
                      onChange={handleChange}
                      required
                      placeholder="e.g., +91 9876543210"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    <Image size={18} className="me-2" />
                    Property Images *
                  </label>
                  <input
                    type="file"
                    className="form-control form-control-lg"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    required={previews.length === 0}
                  />
                  <div className="form-text">Upload multiple property images (JPG, PNG, etc.)</div>
                  
                  {previews.length > 0 && (
                    <div className="mt-3">
                      <p className="small text-muted mb-2">Selected Images ({previews.length}):</p>
                      <div className="row g-2">
                        {previews.map((preview, index) => (
                          <div key={index} className="col-6 col-md-4 col-lg-3">
                            <div className="position-relative">
                              <img 
                                src={preview} 
                                alt={`Property preview ${index + 1}`} 
                                className="img-thumbnail w-100"
                                style={{ height: '150px', objectFit: 'cover' }}
                              />
                              <button
                                type="button"
                                className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                                onClick={() => removeImage(index)}
                                style={{ padding: '2px 8px' }}
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="d-grid gap-2">
                  <button 
                    onClick={handleSubmit}
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Listing Property...
                      </>
                    ) : (
                      <>
                        <Upload size={20} className="me-2" />
                        List Property
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default ListPropertyPage;