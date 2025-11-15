import React, { useEffect, useState, useContext } from "react";
import { Search, Home, Heart, User, Settings, Menu, X, MapPin, IndianRupee, Building, CheckCircle } from "lucide-react";
import "./PropertiesPage.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [slideIndex, setSlideIndex] = useState({});
  const [hovering, setHovering] = useState({});
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [filters, setFilters] = useState({
    types: [],
    furnished: [],
    verifiedOnly: false,
    hasParking: false,
    availableFromOnOrAfter: "",
    features: [],
    featureInput: "",
  });
  const [reportOpen, setReportOpen] = useState(false);
  const [reportFor, setReportFor] = useState(null);
  const [reportCategory, setReportCategory] = useState("fraud");
  const [reportDescription, setReportDescription] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);

  const openReport = (property) => {
    setReportFor(property);
    setReportCategory("fraud");
    setReportDescription("");
    setReportOpen(true);
  };

  const submitReport = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to report an issue.");
      return;
    }
    if (!reportFor) return;
    try {
      setReportSubmitting(true);
      const res = await fetch("http://localhost:5000/issues", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId: reportFor._id,
          category: reportCategory,
          description: reportDescription,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit report");
      setReportOpen(false);
      setReportFor(null);
      setReportDescription("");
      setReportCategory("fraud");
      alert("Report submitted. Thank you.");
    } catch (e) {
      alert("Failed to submit report");
    } finally {
      setReportSubmitting(false);
    }
  };

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const fetchProps = async (paramsFromUrl) => {
      try {
        let apiUrl = "http://localhost:5000/properties?";
        const params = paramsFromUrl || {};
        
        if (params.location) {
          apiUrl = apiUrl + "location=" + params.location + "&";
        }
        if (params.minPrice) {
          apiUrl = apiUrl + "minPrice=" + params.minPrice + "&";
        }
        if (params.maxPrice) {
          apiUrl = apiUrl + "maxPrice=" + params.maxPrice + "&";
        }

        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();

        const token = localStorage.getItem('token');
        if (token) {
          try {
            const favRes = await fetch("http://localhost:5000/user/getUserFavourite", {
              headers: { Authorization: "Bearer " + token }
            });
            if (favRes.ok) {
              const favData = await favRes.json();
              const favIds = [];
              for (let i = 0; i < favData.length; i++) {
                favIds.push(favData[i]._id);
              }
              
              const merged = [];
              for (let i = 0; i < data.length; i++) {
                const property = data[i];
                const isFav = favIds.includes(property._id);
                merged.push({ ...property, isFav: isFav });
              }
              setProperties(merged);
              return;
            }
          } catch (e) {
            console.log("Favourites fetch failed");
          }
        }

        setProperties(data || []);
      } catch (err) {
        setError("Failed to load properties");
      } finally {
        setLoading(false);
      }
    };


    
    const search = new URLSearchParams(window.location.search);
    const initLocation = search.get('location') || "";
    const initMin = search.get('minPrice') || "";
    const initMax = search.get('maxPrice') || "";
    setLocationFilter(initLocation);
    setMinPrice(initMin);
    setMaxPrice(initMax);
    fetchProps({ location: initLocation, minPrice: initMin, maxPrice: initMax });

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    if (!Array.isArray(properties) || properties.length === 0) return;
    
    const id = setInterval(() => {
      setSlideIndex((prev) => {
        const next = { ...prev };
        for (let i = 0; i < properties.length; i++) {
          const p = properties[i];
          const imgs = Array.isArray(p.images) ? p.images : [];
          if (imgs.length > 1 && !hovering[p._id]) {
            const cur = prev[p._id] || 0;
            next[p._id] = (cur + 1) % imgs.length;
          }
        }
        return next;
      });
    }, 3000);
    
    return () => clearInterval(id);
  }, [properties, hovering]);

  const filteredProperties = properties.filter((p) => {
    if (filters.types.length > 0) {
      let typeMatch = false;
      for (let i = 0; i < filters.types.length; i++) {
        if (p.propertyType === filters.types[i]) {
          typeMatch = true;
          break;
        }
      }
      if (!typeMatch) return false;
    }
    
    if (filters.furnished.length > 0) {
      let furnishedMatch = false;
      for (let i = 0; i < filters.furnished.length; i++) {
        if (p.furnished === filters.furnished[i]) {
          furnishedMatch = true;
          break;
        }
      }
      if (!furnishedMatch) return false;
    }
    
    if (filters.verifiedOnly && !p.isVerified) return false;
    
    if (filters.hasParking) {
      const val = (p.parking || "").toString().trim().toLowerCase();
      if (!val || val === "no") return false;
    }
    
    if (filters.availableFromOnOrAfter) {
      const pf = p.availableFrom ? new Date(p.availableFrom).getTime() : NaN;
      const ff = new Date(filters.availableFromOnOrAfter).getTime();
      if (isFinite(pf) && isFinite(ff)) {
        if (pf < ff) return false;
      }
    }
    
    if (filters.features.length > 0) {
      const pfeats = Array.isArray(p.features) ? p.features : [];
      let allMatch = true;
      for (let i = 0; i < filters.features.length; i++) {
        let found = false;
        const needFeature = filters.features[i].toLowerCase();
        for (let j = 0; j < pfeats.length; j++) {
          const propFeature = (pfeats[j] || "").toString().toLowerCase();
          if (propFeature === needFeature) {
            found = true;
            break;
          }
        }
        if (!found) {
          allMatch = false;
          break;
        }
      }
      if (!allMatch) return false;
    }
    
    return true;
  });

  const handleApplyFilters = async () => {
    setLoading(true);
    const params = {
      location: locationFilter,
      minPrice: minPrice,
      maxPrice: maxPrice,
    };
    
    const next = new URL(window.location.href);
    if (params.location) {
      next.searchParams.set('location', params.location);
    } else {
      next.searchParams.delete('location');
    }
    if (params.minPrice) {
      next.searchParams.set('minPrice', params.minPrice);
    } else {
      next.searchParams.delete('minPrice');
    }
    if (params.maxPrice) {
      next.searchParams.set('maxPrice', params.maxPrice);
    } else {
      next.searchParams.delete('maxPrice');
    }
    window.history.replaceState({}, "", next.toString());
    
    try {
      let apiUrl = "http://localhost:5000/properties?";
      if (params.location) apiUrl = apiUrl + "location=" + params.location + "&";
      if (params.minPrice) apiUrl = apiUrl + "minPrice=" + params.minPrice + "&";
      if (params.maxPrice) apiUrl = apiUrl + "maxPrice=" + params.maxPrice + "&";
      
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const favRes = await fetch("http://localhost:5000/user/getUserFavourite", { 
            headers: { Authorization: "Bearer " + token } 
          });
          if (favRes.ok) {
            const favData = await favRes.json();
            const favIds = [];
            for (let i = 0; i < favData.length; i++) {
              favIds.push(favData[i]._id);
            }
            const merged = [];
            for (let i = 0; i < data.length; i++) {
              const property = data[i];
              merged.push({ ...property, isFav: favIds.includes(property._id) });
            }
            setProperties(merged);
          } else {
            setProperties(data || []);
          }
        } catch { 
          setProperties(data || []); 
        }
      } else { 
        setProperties(data || []); 
      }
    } catch { 
      setError("Failed to load properties"); 
    } finally { 
      setLoading(false); 
    }
  };

  const addFav = async (propertyId, isFav) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first!");

    const updatedProperties = [];
    for (let i = 0; i < properties.length; i++) {
      if (properties[i]._id === propertyId) {
        updatedProperties.push({ ...properties[i], isFav: !isFav });
      } else {
        updatedProperties.push(properties[i]);
      }
    }
    setProperties(updatedProperties);

    try {
      if (isFav) {
        await axios.delete(
          "http://localhost:5000/user/removeUserFavourite/" + propertyId,
          {
            headers: { Authorization: "Bearer " + token },
          }
        );
        console.log("Removed from favorites");
      } else {
        await axios.post(
          "http://localhost:5000/user/addUserFavourite",
          { propertyId: propertyId },
          {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Added to favourites");
      }
    } catch (error) {
      const detail = error?.response?.data || error?.message || error;
      console.error("Error toggling favorite:", detail);
      
      const revertedProperties = [];
      for (let i = 0; i < properties.length; i++) {
        if (properties[i]._id === propertyId) {
          revertedProperties.push({ ...properties[i], isFav: isFav });
        } else {
          revertedProperties.push(properties[i]);
        }
      }
      setProperties(revertedProperties);
    }
  };

  return (
    <>
    <div className={"d-flex properties-page " + (sidebarOpen ? 'sidebar-open' : '')}>
      <div className={"bg-dark text-white position-fixed properties-sidebar " + (sidebarOpen ? '' : 'd-none')}>
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom border-secondary">
          <h4 className="mb-0 fw-bold">Habito</h4>
          <button className="btn btn-link text-white p-0" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        <nav className="p-3">
          <a href="#" className="d-flex align-items-center gap-3 text-white text-decoration-none p-3 rounded mb-2 bg-secondary">
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
          <a href="/my-issues" className="d-flex align-items-center gap-3 text-white text-decoration-none p-3 rounded mb-2 hover-bg-secondary">
            <Settings size={20} />
            <span>My Reports</span>
          </a>
          <a href="/list-property" className="d-flex align-items-center gap-3 text-white text-decoration-none p-3 rounded mb-2 hover-bg-secondary">
            <Building size={20} />
            <span>List a Property</span>
          </a>
        </nav>
      </div>

      {sidebarOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 properties-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-fill d-flex flex-column properties-main">
        <header className="bg-white border-bottom p-3">
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-outline-secondary" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            
            <div className="flex-fill properties-search-wrap">
              <div className="row g-2 align-items-center">
                <div className="col-12 col-md-6 col-lg-4">
                  <div className="input-group">
                    <span className="input-group-text bg-white">
                      <Search size={20} className="text-muted" />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="Location"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-6 col-md-3 col-lg-2">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                </div>
                <div className="col-6 col-md-3 col-lg-2">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
                <div className="col-12 col-md-12 col-lg-4 d-flex gap-2">
                  <button className="btn btn-primary" onClick={handleApplyFilters}>Apply</button>
                  <button className="btn btn-outline-secondary" onClick={() => { 
                    setLocationFilter(""); 
                    setMinPrice(""); 
                    setMaxPrice(""); 
                    handleApplyFilters(); 
                  }}>Clear</button>
                </div>
              </div>
            </div>
            
            <div className="ms-auto position-relative" style={{ userSelect: 'none' }}>
              <div
                className="d-flex align-items-center justify-content-center rounded-circle border"
                style={{ width: 40, height: 40, cursor: 'pointer' }}
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <User size={20} />
              </div>
              {profileOpen && (
                <div className="position-absolute end-0 mt-2 bg-white border rounded shadow-sm" style={{ minWidth: 160, zIndex: 1060 }}>
                  <Link to="/profile" className="d-block px-3 py-2 text-decoration-none text-dark" onClick={() => setProfileOpen(false)}>
                    Profile
                  </Link>
                  <button
                    className="d-block w-100 text-start px-3 py-2 btn btn-link text-decoration-none"
                    style={{ color: '#dc3545' }}
                    onClick={() => { 
                      setProfileOpen(false); 
                      logout(); 
                      navigate('/login'); 
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-fill overflow-auto p-4 properties-content">
          <div className="container-fluid">
            <div className="mb-4">
              <h2 className="fw-bold">Available Properties</h2>
              <p className="text-muted">
                {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} found
              </p>
            </div>
            
            <div className="row">
              <div className="col-12 col-lg-9">
                {loading ? (
                  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : error ? (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                ) : filteredProperties.length === 0 ? (
                  <div className="text-center py-5">
                    <Home size={64} className="text-muted mb-3" />
                    <p className="text-muted fs-5">No properties found</p>
                  </div>
                ) : (
                  <div className="row g-4">
                    {filteredProperties.map((p) => (
                      <div key={p._id} className="col-12 col-md-6">
                        <div className="card h-100 shadow-sm border-0 position-relative">
                          {p.isVerified && (
                            <div className="position-absolute top-0 start-0 m-2" style={{ zIndex: 10 }}>
                              <span className="badge bg-success d-flex align-items-center gap-1 px-2 py-1">
                                <CheckCircle size={14} />
                                <span className="small">Verified</span>
                              </span>
                            </div>
                          )}

                          <button 
                            className="btn btn-outline-danger position-absolute top-0 end-0 m-2 border-0" 
                            style={{ zIndex: 10 }} 
                            onClick={() => addFav(p._id, p.isFav)}
                          >
                            <Heart size={20} color={p.isFav ? "red" : "#000000ff"} fill={p.isFav ? "red" : "none"} border = "none"/>
                          </button>

                          {Array.isArray(p.images) && p.images.length > 0 ? (
                            <img
                              src={p.images[slideIndex[p._id] || 0]}
                              alt={p.title || "Property image"}
                              className="card-img-top"
                              style={{ height: '200px', objectFit: 'cover' }}
                              onMouseEnter={() => {
                                const newHovering = { ...hovering };
                                newHovering[p._id] = true;
                                setHovering(newHovering);
                              }}
                              onMouseLeave={() => {
                                const newHovering = { ...hovering };
                                newHovering[p._id] = false;
                                setHovering(newHovering);
                              }}
                            />
                          ) : (
                            <div 
                              className="card-img-top d-flex align-items-center justify-content-center position-relative property-card-hero"
                              style={{ height: '200px' }}
                            >
                              <Home size={64} className="text-white property-hero-icon" />
                            </div>
                          )}
                          
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h5 className="card-title fw-bold mb-0">{p.title}</h5>
                            </div>
                            
                            <p className="card-text text-muted small line-clamp-2">
                              {p.description || "No description available"}
                            </p>
                            
                            <div className="mb-3">
                              <div className="d-flex align-items-center gap-2 mb-2">
                                <IndianRupee size={18} className="text-success" />
                                <span className="fw-bold fs-5">{p.price?.toLocaleString()}</span>
                              </div>
                              
                              {p.location && (
                                <div className="d-flex align-items-center gap-2 text-muted small">
                                  <MapPin size={16} />
                                  <span>{p.location}</span>
                                </div>
                              )}
                            </div>
                            
                            {p.owner?.name && (
                              <div className="border-top pt-3 mb-3">
                                <small className="text-muted d-block">Owner</small>
                                <small className="fw-semibold">{p.owner.name}</small>
                              </div>
                            )}
                            
                            <div className="d-flex gap-2">
                              <button 
                                className="btn btn-primary flex-fill" 
                                onClick={() => { window.location.href = "/details?id=" + p._id; }}
                              >
                                View Details
                              </button>
                              <button
                                className="btn btn-outline-danger"
                                type="button"
                                onClick={() => openReport(p)}
                              >
                                Report
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="col-12 col-lg-3">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="fw-bold mb-3">Filters</h5>

                    <div className="form-check form-switch mb-3">
                      <input className="form-check-input" type="checkbox" id="verifiedOnly"
                        checked={filters.verifiedOnly}
                        onChange={(e) => {
                          const newFilters = { ...filters };
                          newFilters.verifiedOnly = e.target.checked;
                          setFilters(newFilters);
                        }}
                      />
                      <label className="form-check-label" htmlFor="verifiedOnly">Verified only</label>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Property Type</label>
                      {['Apartment','House','Villa','Plot','Office','Shop'].map((opt) => (
                        <div className="form-check" key={opt}>
                          <input className="form-check-input" type="checkbox" id={"type-" + opt}
                            checked={filters.types.includes(opt)}
                            onChange={(e) => {
                              const newFilters = { ...filters };
                              if (e.target.checked) {
                                newFilters.types = [...filters.types, opt];
                              } else {
                                newFilters.types = filters.types.filter((x) => x !== opt);
                              }
                              setFilters(newFilters);
                            }}
                          />
                          <label className="form-check-label" htmlFor={"type-" + opt}>{opt}</label>
                        </div>
                      ))}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Furnished</label>
                      {['Unfurnished','Semi-furnished','Furnished'].map((opt) => (
                        <div className="form-check" key={opt}>
                          <input className="form-check-input" type="checkbox" id={"furn-" + opt}
                            checked={filters.furnished.includes(opt)}
                            onChange={(e) => {
                              const newFilters = { ...filters };
                              if (e.target.checked) {
                                newFilters.furnished = [...filters.furnished, opt];
                              } else {
                                newFilters.furnished = filters.furnished.filter((x) => x !== opt);
                              }
                              setFilters(newFilters);
                            }}
                          />
                          <label className="form-check-label" htmlFor={"furn-" + opt}>{opt}</label>
                        </div>
                      ))}
                    </div>

                    <div className="form-check mb-3">
                      <input className="form-check-input" type="checkbox" id="hasParking"
                        checked={filters.hasParking}
                        onChange={(e) => {
                          const newFilters = { ...filters };
                          newFilters.hasParking = e.target.checked;
                          setFilters(newFilters);
                        }}
                      />
                      <label className="form-check-label" htmlFor="hasParking">Has parking</label>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Available From (on/after)</label>
                      <input type="date" className="form-control"
                        value={filters.availableFromOnOrAfter}
                        onChange={(e) => {
                          const newFilters = { ...filters };
                          newFilters.availableFromOnOrAfter = e.target.value;
                          setFilters(newFilters);
                        }}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Features</label>
                      <div className="input-group mb-2">
                        <input type="text" className="form-control" placeholder="Add feature"
                          value={filters.featureInput}
                          onChange={(e) => {
                            const newFilters = { ...filters };
                            newFilters.featureInput = e.target.value;
                            setFilters(newFilters);
                          }}
                          onKeyDown={(e) => { 
                            if (e.key === 'Enter') { 
                              e.preventDefault(); 
                              if (filters.featureInput.trim()) {
                                const newFilters = { ...filters };
                                newFilters.features = [...filters.features, filters.featureInput.trim()];
                                newFilters.featureInput = '';
                                setFilters(newFilters);
                              }
                            }
                          }}
                        />
                        <button className="btn btn-outline-primary" type="button"
                          onClick={() => { 
                            if (filters.featureInput.trim()) {
                              const newFilters = { ...filters };
                              newFilters.features = [...filters.features, filters.featureInput.trim()];
                              newFilters.featureInput = '';
                              setFilters(newFilters);
                            }
                          }}
                        >Add</button>
                      </div>
                      {filters.features.length > 0 && (
                        <div className="d-flex flex-wrap gap-2">
                          {filters.features.map((ftr, idx) => (
                            <span key={ftr + "-" + idx} className="badge bg-secondary d-inline-flex align-items-center">
                              <span className="me-2">{ftr}</span>
                              <button type="button" className="btn-close btn-close-white" aria-label="Remove"
                                onClick={() => {
                                  const newFilters = { ...filters };
                                  newFilters.features = filters.features.filter((item, i) => i !== idx);
                                  setFilters(newFilters);
                                }}
                                style={{ fontSize: '0.6rem' }}
                              />
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="d-flex gap-2">
                      <button className="btn btn-outline-secondary flex-fill" type="button"
                        onClick={() => {
                          setFilters({ 
                            types: [], 
                            furnished: [], 
                            verifiedOnly: false, 
                            hasParking: false, 
                            availableFromOnOrAfter: "", 
                            features: [], 
                            featureInput: "" 
                          });
                        }}
                      >Clear</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
    {reportOpen && (
      <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }} onClick={() => setReportOpen(false)}>
        <div className="modal-content" style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 520, padding: 24 }} onClick={(e) => e.stopPropagation()}>
          <h5 className="fw-bold mb-3">Report Issue</h5>
          <div className="mb-2"><strong>Property:</strong> {reportFor?.title}</div>
          <div className="mb-3">
            <label className="form-label">Category</label>
            <select className="form-select" value={reportCategory} onChange={(e) => setReportCategory(e.target.value)}>
              <option value="fraud">Fraud</option>
              <option value="incorrect_info">Incorrect Info</option>
              <option value="duplicate_listing">Duplicate Listing</option>
              <option value="offensive_content">Offensive Content</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Description (optional)</label>
            <textarea className="form-control" rows={4} placeholder="Describe the issue" value={reportDescription} onChange={(e) => setReportDescription(e.target.value)} />
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button className="btn btn-outline-secondary" onClick={() => setReportOpen(false)} disabled={reportSubmitting}>Cancel</button>
            <button className="btn btn-danger" onClick={submitReport} disabled={reportSubmitting}>{reportSubmitting ? 'Submitting...' : 'Submit Report'}</button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default PropertiesPage;