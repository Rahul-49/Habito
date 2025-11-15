import React, { useEffect, useState, useContext } from "react";
import { 
  Search, Home, Heart, User, Menu, X, MapPin, 
  IndianRupee, Building, ArrowLeft, Phone, Mail,
  Bed, Bath, Square, Calendar, Share2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PropertyDetailPage = () => {
  const [summary, setSummary] = useState("");
const [genLoading, setGenLoading] = useState(false);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const formatDMY = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d)) return "";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const style = document.createElement('style');
    style.textContent = `
      .properties-sidebar {
        width: 280px;
        height: 100vh;
        top: 0;
        left: 0;
        z-index: 1040;
        transition: transform 0.3s ease;
      }
      
      .properties-sidebar.d-none {
        transform: translateX(-100%);
      }
      
      .properties-overlay {
        z-index: 1030;
      }
      
      .properties-main {
        margin-left: 0;
        transition: margin-left 0.3s ease;
      }
      
      .hover-bg-secondary:hover {
        background-color: rgba(255, 255, 255, 0.1) !important;
      }
      
      .property-hero-image {
        height: 500px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        position: relative;
        overflow: hidden;
      }
      
      .property-hero-icon {
        opacity: 0.3;
      }
      
      .property-detail-card {
        border-radius: 12px;
        transition: transform 0.2s;
      }
      
      .property-detail-card:hover {
        transform: translateY(-2px);
      }
      
      .stat-badge {
        background-color: #f8f9fa;
        padding: 12px 20px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .owner-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 12px;
        padding: 24px;
        color: white;
      }
      
      .action-btn {
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        transition: all 0.2s;
      }
      
      .action-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }

      @media (max-width: 768px) {
        .property-hero-image {
          height: 300px;
        }
      }
    `;
    document.head.appendChild(style);

    const fetchPropertyDetail = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const propertyId = urlParams.get('id');
        if (!propertyId) {
          setError("Missing property id");
          setLoading(false);
          return;
        }

        // Fetch all properties then select the one matching id
        const res = await fetch("http://localhost:5000/properties");
        if (!res.ok) throw new Error('Failed to fetch');
        const list = await res.json();
        const found = (list || []).find((p) => p._id === propertyId);
        if (!found) {
          setError("Property not found");
          setLoading(false);
          return;
        }

        // Determine favourite state
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const favRes = await fetch("http://localhost:5000/user/getUserFavourite", { headers: { Authorization: `Bearer ${token}` } });
            if (favRes.ok) {
              const favData = await favRes.json();
              const isFav = (favData || []).some((f) => f._id === propertyId);
              setIsFavorite(isFav);
            }
          } catch (e) { /* ignore */ }
        }

        setProperty(found);
      } catch (err) {
        setError("Failed to load property details");
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetail();

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
    };
  }, []);

  // Auto advance slideshow when images are present
  useEffect(() => {
    const imgs = Array.isArray(property?.images) ? property.images : [];
    if (!imgs.length || !autoPlay) return;
    const id = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % imgs.length);
    }, 3000);
    return () => clearInterval(id);
  }, [property?.images, autoPlay]);

  const toggleFavorite = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first!");

    // Optimistic UI update
    setIsFavorite(!isFavorite);

    try {
      const options = {
        method: isFavorite ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      if (!isFavorite) {
        options.body = JSON.stringify({ propertyId: property._id });
      }

      const url = isFavorite 
        ? `http://localhost:5000/user/removeUserFavourite/${property._id}`
        : "http://localhost:5000/user/addUserFavourite";

      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error('Failed to toggle favorite');
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      // Revert on error
      setIsFavorite(!isFavorite);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title,
        text: `Check out this property: ${property?.title}`,
        url: window.location.href,
      }).catch(err => console.log("Error sharing:", err));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

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
      const res = await fetch("http://localhost:5000/ai/summarize", {
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
  const generateSummary = async () => {
    try {
      setGenLoading(true);
      setError("");

      if (!property) {
        setError("Property data not loaded yet. Please try again in a moment.");
        setGenLoading(false);
        return;
      }

      const { title, location, area, price, bedrooms, bathrooms, features = [] } = property;

      // Validate required fields
      if (!title || !location || area === undefined || price === undefined) {
        setError("Insufficient property details to generate a summary.");
        setGenLoading(false);
        return;
      }

      const payload = {
        title,
        location,
        area: Number(area),
        price: Number(price),
        ...(bedrooms && { bedrooms: Number(bedrooms) }),
        ...(bathrooms && { bathrooms: Number(bathrooms) }),
        ...(features && { features: Array.isArray(features) ? features : [features] })
      };

      const res = await fetch("http://localhost:5000/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to generate summary");
      }

      const data = await res.json();
      const text = (data?.summary || data?.description || "").trim();
      
      if (!text) {
        throw new Error("Received empty response from AI service");
      }

      setSummary(text);
    } catch (err) {
      console.error("Summary generation error:", err);
      setError(err.message || "Failed to generate summary. Please try again.");
    } finally {
      setGenLoading(false);
    }
  };


  return (
    <div className={`d-flex ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Sidebar */}
      <div 
        className={`bg-dark text-white position-fixed properties-sidebar ${sidebarOpen ? '' : 'd-none'}`}
      >
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom border-secondary">
          <h4 className="mb-0 fw-bold">Habito</h4>
          <button 
            className="btn btn-link text-white p-0"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="p-3">
          <a href="/properties" className="d-flex align-items-center gap-3 text-white text-decoration-none p-3 rounded mb-2 hover-bg-secondary">
            <Home size={20} />
            <span>Properties</span>
          </a>
          <a href="/favourites" className="d-flex align-items-center gap-3 text-white text-decoration-none p-3 rounded mb-2 hover-bg-secondary">
            <Heart size={20} />
            <span>Favorites</span>
          </a>
          <a href="/profile" className="d-flex align-items-center gap-3 text-white text-decoration-none p-3 rounded mb-2 hover-bg-secondary">
            <User size={20} />
            <span>Profile</span>
          </a>
          <a href="/list-property" className="d-flex align-items-center gap-3 text-white text-decoration-none p-3 rounded mb-2 hover-bg-secondary">
            <Building size={20} />
            <span>List a Property</span>
          </a>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 properties-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-fill d-flex flex-column properties-main">
        {/* Header */}
        <header className="bg-white border-bottom p-3">
          <div className="d-flex align-items-center gap-3">
            <button 
              className="btn btn-outline-secondary"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            
            <a href="/properties" className="btn btn-outline-primary d-flex align-items-center gap-2">
              <ArrowLeft size={20} />
              <span className="d-none d-sm-inline">Back to Properties</span>
            </a>

            <div className="ms-auto d-flex gap-2 align-items-center position-relative" style={{ userSelect: 'none' }}>
              <div
                className="d-flex align-items-center justify-content-center rounded-circle border"
                style={{ width: 40, height: 40, cursor: 'pointer' }}
                onClick={() => setProfileOpen((s) => !s)}
              >
                <User size={20} />
              </div>
              {profileOpen && (
                <div className="position-absolute end-0 mt-2 bg-white border rounded shadow-sm" style={{ minWidth: 160, zIndex: 1060, top: '100%' }}>
                  <Link to="/profile" className="d-block px-3 py-2 text-decoration-none text-dark" onClick={() => setProfileOpen(false)}>
                    Profile
                  </Link>
                  <button
                    className="d-block w-100 text-start px-3 py-2 btn btn-link text-decoration-none"
                    style={{ color: '#dc3545' }}
                    onClick={() => { setProfileOpen(false); logout(); navigate('/'); }}
                  >
                    Logout
                  </button>
                </div>
              )}
              <button 
                className="btn btn-outline-secondary"
                onClick={handleShare}
              >
                <Share2 size={20} />
              </button>
              <button 
                className="btn btn-outline-danger"
                onClick={toggleFavorite}
              >
                <Heart 
                  size={20} 
                  fill={isFavorite ? "red" : "none"}
                  color={isFavorite ? "red" : "currentColor"}
                />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-fill overflow-auto">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="container mt-4">
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            </div>
          ) : property ? (
            <>
              {/* Hero Image / Slideshow */}
              <div className="property-hero-image position-relative d-flex align-items-center justify-content-center bg-dark">
                {Array.isArray(property.images) && property.images.length > 0 ? (
                  <>
                    <img
                      src={property.images[currentImage]}
                      alt={property.title || "Property image"}
                      className="w-100 h-100"
                      style={{ objectFit: 'cover' }}
                      onMouseEnter={() => setAutoPlay(false)}
                      onMouseLeave={() => setAutoPlay(true)}
                    />
                    {/* Prev/Next Controls */}
                    <button
                      className="btn btn-light position-absolute"
                      style={{ left: 16 }}
                      onClick={() => setCurrentImage((prev) => (prev - 1 + property.images.length) % property.images.length)}
                    >
                      ‹
                    </button>
                    <button
                      className="btn btn-light position-absolute"
                      style={{ right: 16 }}
                      onClick={() => setCurrentImage((prev) => (prev + 1) % property.images.length)}
                    >
                      ›
                    </button>
                    {/* Dots */}
                    <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3 d-flex gap-2">
                      {property.images.map((_, idx) => (
                        <button
                          key={idx}
                          className={`btn p-1 ${idx === currentImage ? 'btn-primary' : 'btn-light'}`}
                          style={{ width: 10, height: 10, borderRadius: '50%' }}
                          onClick={() => setCurrentImage(idx)}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <Home size={120} className="text-white property-hero-icon" />
                )}
              </div>

              {/* Thumbnails */}
              {Array.isArray(property.images) && property.images.length > 1 && (
                <div className="container mt-3">
                  <div className="d-flex gap-2 overflow-auto">
                    {property.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`thumb-${idx+1}`}
                        onClick={() => setCurrentImage(idx)}
                        className={`img-thumbnail ${idx === currentImage ? 'border-primary' : ''}`}
                        style={{ width: 100, height: 70, objectFit: 'cover', cursor: 'pointer' }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="container py-4">
                <div className="row g-4">
                  {/* Main Content */}
                  <div className="col-lg-8">
                    {/* Title and Price */}
                    <div className="mb-4">
                      <h1 className="fw-bold mb-3">{property.title}</h1>
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <MapPin size={20} className="text-muted" />
                        <span className="text-muted fs-5">{property.location}</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <IndianRupee size={28} className="text-success" />
                        <span className="fw-bold display-5 text-success">
                          {property.price?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="card property-detail-card shadow-sm mb-4">
  <div className="card-body">
    <div className="d-flex align-items-center justify-content-between">
      <h4 className="fw-bold mb-3">AI Summary</h4>
      <button
        className="btn btn-sm btn-primary d-flex align-items-center gap-2 p-2"
        onClick={generateSummary}
        disabled={genLoading || !property || !property.title || !property.location || property.area === undefined || property.price === undefined}
        title={!property ? "Loading property data..." : (property.title && property.location && property.area !== undefined && property.price !== undefined ? "Generate a summary of this property" : "Please fill in all required property details")}
      >
        {genLoading ? (
          <>
            <span className="spinner-border spinner-border-sm"></span>
            Generating...
          </>
        ) : (
          <>
            <i className="bi bi-magic"></i>
            Generate Summary
          </>
        )}
      </button>
    </div>

    {error && (
      <div className="alert alert-warning mt-2" role="alert">
        <i className="bi bi-exclamation-triangle me-2"></i>
        {error}
      </div>
    )}

    {summary ? (
      <p className="text-muted lh-lg mt-3">{summary}</p>
    ) : (
      <p className="text-secondary small fst-italic mt-3">
        {property && property.title && property.location && property.area !== undefined && property.price !== undefined
          ? "No summary generated yet. Click the button above to create one."
          : "Fill in the required property details (title, location, area, and price) to generate a summary."}
      </p>
    )}
  </div>
</div>


                    {/* Property Stats */}
                    <div className="row g-3 mb-4">
                      <div className="col-6 col-md-3">
                        <div className="stat-badge">
                          <Bed size={24} className="text-primary" />
                          <div>
                            <div className="fw-bold">{property.bedrooms}</div>
                            <small className="text-muted">Bedrooms</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-6 col-md-3">
                        <div className="stat-badge">
                          <Bath size={24} className="text-primary" />
                          <div>
                            <div className="fw-bold">{property.bathrooms}</div>
                            <small className="text-muted">Bathrooms</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-6 col-md-3">
                        <div className="stat-badge">
                          <Square size={24} className="text-primary" />
                          <div>
                            <div className="fw-bold">{property.area}</div>
                            <small className="text-muted">Sq.ft</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-6 col-md-3">
                        <div className="stat-badge">
                          <Calendar size={24} className="text-primary" />
                          <div>
                            <div className="fw-bold">{property.yearBuilt}</div>
                            <small className="text-muted">Built</small>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="card property-detail-card shadow-sm mb-4">
                      <div className="card-body">
                        <h4 className="fw-bold mb-3">Description</h4>
                        <p className="text-muted lh-lg">{property.description}</p>
                      </div>
                    </div>

                    {/* Property Details */}
                    <div className="card property-detail-card shadow-sm mb-4">
                      <div className="card-body">
                        <h4 className="fw-bold mb-3">Property Details</h4>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <div className="d-flex justify-content-between py-2 border-bottom">
                              <span className="text-muted">Property Type</span>
                              <span className="fw-semibold">{property.propertyType}</span>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="d-flex justify-content-between py-2 border-bottom">
                              <span className="text-muted">Furnished</span>
                              <span className="fw-semibold">{property.furnished}</span>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="d-flex justify-content-between py-2 border-bottom">
                              <span className="text-muted">Parking</span>
                              <span className="fw-semibold">{property.parking}</span>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="d-flex justify-content-between py-2 border-bottom">
                              <span className="text-muted">Available From</span>
                              <span className="fw-semibold">{formatDMY(property.availableFrom)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Features & Amenities */}
                    <div className="card property-detail-card shadow-sm mb-4">
                      <div className="card-body">
                        <h4 className="fw-bold mb-3">Features & Amenities</h4>
                        <div className="row g-2">
                          {(property.features || []).map((feature, index) => (
                            <div key={index} className="col-md-6">
                              <div className="d-flex align-items-center gap-2 p-2">
                                <div className="bg-success bg-opacity-10 rounded-circle p-1">
                                  <div className="bg-success rounded-circle" style={{width: '8px', height: '8px'}}></div>
                                </div>
                                <span>{feature}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="col-lg-4">
                    {/* Owner Contact Card */}
                    <div className="owner-card shadow-sm mb-4">
                      <h5 className="fw-bold mb-3">Contact Owner</h5>
                      <div className="mb-3">
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <User size={20} />
                          <span className="fw-semibold">{property.owner?.name || 'Owner'}</span>
                        </div>
                      </div>
                      <div className="d-grid gap-2">
                        <a 
                          href={(property.owner?.phone || property.ownerPhone) ? `tel:${property.owner?.phone || property.ownerPhone}` : '#'}
                          className="btn btn-light action-btn d-flex align-items-center justify-content-center gap-2"
                        >
                          <Phone size={20} />
                          Call Now
                        </a>
                        <a 
                          href={(property.owner?.email || property.ownerEmail) ? `mailto:${property.owner?.email || property.ownerEmail}` : '#'}
                          className="btn btn-outline-light action-btn d-flex align-items-center justify-content-center gap-2"
                        >
                          <Mail size={20} />
                          Send Email
                        </a>
                      </div>
                    </div>

                    {/* Schedule Visit Card */}
                    <div className="card property-detail-card shadow-sm">
                      <div className="card-body">
                        <h5 className="fw-bold mb-3">Schedule a Visit</h5>
                        <p className="text-muted small mb-3">
                          Interested in this property? Schedule a visit to see it in person.
                        </p>
                        <button className="btn btn-primary w-100 action-btn">
                          Request Visit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </main>
      </div>
    </div>
  );
};

export default PropertyDetailPage;