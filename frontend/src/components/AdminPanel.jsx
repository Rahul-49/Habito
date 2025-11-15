import React, { useEffect, useState, useContext } from "react";
import { 
  Home, Check, X, Eye, Building, MapPin, IndianRupee,
  AlertCircle, CheckCircle, Clock, Trash2, Menu, User, Heart, LogOut,
  Bed, Bath, Square, Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminPanel = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("pending"); // pending, verified, all
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState("");
  const [viewData, setViewData] = useState(null);
  const [viewImageIndex, setViewImageIndex] = useState(0);
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
      .admin-sidebar {
        width: 280px;
        height: 100vh;
        top: 0;
        left: 0;
        z-index: 1040;
        transition: transform 0.3s ease;
        background: #2c3e50;
      }
      
      .admin-sidebar.d-none {
        transform: translateX(-100%);
      }
      
      .admin-overlay {
        z-index: 1030;
      }
      
      .admin-main {
        margin-left: 0;
        transition: margin-left 0.3s ease;
        background: #f8f9fa;
        min-height: 100vh;
      }

      .stat-card {
        background: white;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        transition: all 0.3s;
      }

      .stat-icon {
        width: 56px;
        height: 56px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 16px;
      }

      .filter-btn {
        padding: 10px 20px;
        border: 2px solid #dee2e6;
        background: white;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
      }

      .filter-btn.active {
        background: #2c3e50;
        color: white;
        border-color: #2c3e50;
      }

      .property-card {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        transition: all 0.3s;
        border: 2px solid transparent;
      }
      .property-card.pending {
        border-color: #ffffffff;
      }

      .property-card.verified {
        border-color: #28a745;
      }

      .property-image {
        height: 200px;
        background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      }

      .property-hero-icon {
        opacity: 0.3;
      }

      .status-badge {
        position: absolute;
        top: 12px;
        right: 12px;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .status-badge.pending {
        background: #fff3cd;
        color: #856404;
      }

      .status-badge.verified {
        background: #d4edda;
        color: #155724;
      }

      .action-btn {
        padding: 10px 20px;
        border-radius: 8px;
        font-weight: 600;
        border: none;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 8px;
        justify-content: center;
      }

      .action-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .action-btn.approve {
        background: #28a745;
        color: white;
      }


      .action-btn.reject {
        background: #dc3545;
        color: white;
      }

      .action-btn.view {
        background: #007bff;
        color: white;
      }

      .modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        padding: 20px;
      }

      .modal-content {
        background: white;
        border-radius: 16px;
        max-width: 500px;
        width: 100%;
        padding: 32px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      }

      @media (max-width: 768px) {
        .filter-btn {
          font-size: 14px;
          padding: 8px 16px;
        }
      }
    `;
    document.head.appendChild(style);

    fetchProps();

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
    };
  }, []);

  const fetchProps = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/properties", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      if (!res.ok) throw new Error("Failed to fetch");
      
      const data = await res.json();
      setProperties(Array.isArray(data) ? data : []);
    } catch (e) {
      setError("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (propertyId, silent = false) => {
    setActionLoading(propertyId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/properties/${propertyId}/verify`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ isVerified: true })
      });

      if (!res.ok) throw new Error("Failed to approve");

      setProperties(prev =>
        prev.map(p => p._id === propertyId ? { ...p, isVerified: true } : p)
      );
      if (!silent) {
        setShowModal(true);
        setModalData({ type: "success", message: "Property approved successfully!" });
        setTimeout(() => setShowModal(false), 2000);
      }
    } catch (error) {
      console.error("Error approving property:", error);
      if (!silent) {
        setShowModal(true);
        setModalData({ type: "error", message: "Failed to approve property" });
        setTimeout(() => setShowModal(false), 2000);
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (propertyId) => {
    if (!confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
      return;
    }

    setActionLoading(propertyId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/properties/${propertyId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error("Failed to delete");

      setProperties(prev => prev.filter(p => p._id !== propertyId));

      setShowModal(true);
      setModalData({ type: "success", message: "Property deleted successfully!" });
      setTimeout(() => setShowModal(false), 2000);
    } catch (error) {
      console.error("Error deleting property:", error);
      setShowModal(true);
      setModalData({ type: "error", message: "Failed to delete property" });
      setTimeout(() => setShowModal(false), 2000);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredProperties = properties.filter(p => {
    if (filter === "pending") return !p.isVerified;
    if (filter === "verified") return p.isVerified;
    return true;
  });

  const stats = {
    total: properties.length,
    pending: properties.filter(p => !p.isVerified).length,
    verified: properties.filter(p => p.isVerified).length
  };

  const openView = async (propertyId) => {
    setViewOpen(true);
    setViewLoading(true);
    setViewError("");
    setViewData(null);
    setViewImageIndex(0);
    try {
      // Prefer existing state
      const local = properties.find(p => p._id === propertyId);
      if (local) {
        setViewData(local);
        setViewLoading(false);
        return;
      }

      const res = await fetch("http://localhost:5000/properties");
      if (!res.ok) throw new Error("Failed to fetch");
      const list = await res.json();
      const found = (list || []).find(p => p._id === propertyId);
      if (!found) {
        setViewError("Property not found");
      } else {
        setViewData(found);
      }
    } catch (e) {
      setViewError("Failed to load property details");
    } finally {
      setViewLoading(false);
    }
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className={`admin-sidebar text-white position-fixed ${sidebarOpen ? '' : 'd-none'}`}>
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom border-secondary">
          <h4 className="mb-0 fw-bold">Admin Panel</h4>
          <button 
            className="btn btn-link text-white p-0"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="p-3">
          <a href="/admin" className="d-flex align-items-center gap-3 text-white text-decoration-none p-3 rounded mb-2 bg-secondary">
            <Building size={20} />
            <span>Properties</span>
          </a>
          <a href="/" className="d-flex align-items-center gap-3 text-white text-decoration-none p-3 rounded mb-2 hover-bg-secondary">
            <Home size={20} />
            <span>Home</span>
          </a>
          <a href="/profile" className="d-flex align-items-center gap-3 text-white text-decoration-none p-3 rounded mb-2 hover-bg-secondary">
            <User size={20} />
            <span>Profile</span>
          </a>
          <div className="border-top border-secondary my-3"></div>
          <button
            type="button"
            className="d-flex w-100 align-items-center gap-3 text-white text-decoration-none p-3 rounded mb-2 btn btn-link text-start hover-bg-secondary"
            onClick={() => { logout(); navigate('/login'); }}
            style={{ color: 'inherit' }}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </nav>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 admin-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-fill admin-main">
        {/* Header */}
        <header className="bg-white border-bottom p-3 sticky-top">
          <div className="container-fluid">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu size={24} />
                </button>
                <h3 className="mb-0 fw-bold" style={{color: '#2c3e50'}}>Property Management</h3>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4">
          <div className="container-fluid">
            {/* Stats Cards */}
            <div className="row g-4 mb-4">
              <div className="col-md-4">
                <div className="stat-card">
                  <div className="stat-icon" style={{background: '#e3f2fd'}}>
                    <Building size={28} style={{color: '#1976d2'}} />
                  </div>
                  <h3 className="fw-bold mb-1">{stats.total}</h3>
                  <p className="text-muted mb-0">Total Properties</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="stat-card">
                  <div className="stat-icon" style={{background: '#fff3cd'}}>
                    <Clock size={28} style={{color: '#856404'}} />
                  </div>
                  <h3 className="fw-bold mb-1">{stats.pending}</h3>
                  <p className="text-muted mb-0">Pending Approval</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="stat-card">
                  <div className="stat-icon" style={{background: '#d4edda'}}>
                    <CheckCircle size={28} style={{color: '#155724'}} />
                  </div>
                  <h3 className="fw-bold mb-1">{stats.verified}</h3>
                  <p className="text-muted mb-0">Verified Properties</p>
                </div>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="d-flex gap-2 mb-4 flex-wrap">
              <button 
                className={`filter-btn ${filter === "pending" ? "active" : ""}`}
                onClick={() => setFilter("pending")}
              >
                <Clock size={16} className="d-inline me-2" />
                Pending ({stats.pending})
              </button>
              <button 
                className={`filter-btn ${filter === "verified" ? "active" : ""}`}
                onClick={() => setFilter("verified")}
              >
                <CheckCircle size={16} className="d-inline me-2" />
                Verified ({stats.verified})
              </button>
              <button 
                className={`filter-btn ${filter === "all" ? "active" : ""}`}
                onClick={() => setFilter("all")}
              >
                <Building size={16} className="d-inline me-2" />
                All ({stats.total})
              </button>
            </div>

            {/* Properties List */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading properties...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger" role="alert">
                <AlertCircle size={20} className="me-2" />
                {error}
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="text-center py-5">
                <Building size={64} className="text-muted mb-3" />
                <h5 className="text-muted">No properties found</h5>
                <p className="text-muted">
                  {filter === "pending" && "No pending properties at the moment"}
                  {filter === "verified" && "No verified properties yet"}
                  {filter === "all" && "No properties available"}
                </p>
              </div>
            ) : (
              <div className="row g-4">
                {filteredProperties.map((p) => (
                  <div key={p._id} className="col-12 col-md-6 col-lg-4">
                    <div className={`property-card ${p.verified ? 'verified' : 'pending'}`}>
                      <div className="property-image">
                        <Home size={64} className="text-white property-hero-icon" />
                        <span className={`status-badge ${p.verified ? 'verified' : 'pending'}`}>
                          {p.verified ? (
                            <>
                              <CheckCircle size={14} />
                              Verified
                            </>
                          ) : (
                            <>
                              <Clock size={14} />
                              Pending
                            </>
                          )}
                        </span>
                      </div>

                      <div className="p-3">
                        <h5 className="fw-bold mb-2">{p.title || "Untitled Property"}</h5>
                        
                        <div className="d-flex align-items-center gap-2 text-muted small mb-2">
                          <MapPin size={16} />
                          <span>{p.location || "Location N/A"}</span>
                        </div>

                        <div className="d-flex align-items-center gap-2 mb-3">
                          <IndianRupee size={18} className="text-success" />
                          <span className="fw-bold fs-5">
                            {p.price ? p.price.toLocaleString() : "N/A"}
                          </span>
                        </div>

                        {p.owner?.name && (
                          <div className="border-top pt-2 mb-3">
                            <small className="text-muted">Owner: {p.owner.name}</small>
                          </div>
                        )}

                        <div className="d-flex gap-2">
                          <button
                            className="action-btn view flex-fill"
                            onClick={() => openView(p._id)}
                          >
                            <Eye size={18} />
                            View
                          </button>
                          {!p.verified && (
                            <button
                              className="action-btn approve flex-fill"
                              onClick={() => handleApprove(p._id)}
                              disabled={actionLoading === p._id}
                            >
                              {actionLoading === p._id ? (
                                <span className="spinner-border spinner-border-sm" />
                              ) : (
                                <>
                                  <Check size={18} />
                                  Approve
                                </>
                              )}
                            </button>
                          )}
                          <button
                            className="action-btn reject flex-fill"
                            onClick={() => handleDelete(p._id)}
                            disabled={actionLoading === p._id}
                          >
                            {actionLoading === p._id ? (
                              <span className="spinner-border spinner-border-sm" />
                            ) : (
                              <>
                                <Trash2 size={18} />
                                Delete
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Property Details Modal */}
      {viewOpen && (
        <div className="modal-overlay" onClick={() => setViewOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {viewLoading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading property details...</p>
              </div>
            ) : viewError ? (
              <div className="alert alert-danger mb-0" role="alert">{viewError}</div>
            ) : viewData ? (
              <div>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h4 className="mb-0">{viewData.title || "Untitled Property"}</h4>
                  <button className="btn btn-outline-secondary" onClick={() => setViewOpen(false)}>
                    <X size={18} />
                  </button>
                </div>
                {Array.isArray(viewData.images) && viewData.images.length > 0 && (
                  <div className="position-relative mb-3">
                    <img
                      src={viewData.images[viewImageIndex]}
                      alt="Property"
                      className="img-fluid rounded"
                      style={{maxHeight: 260, objectFit: 'cover', width: '100%'}}
                    />
                    {viewData.images.length > 1 && (
                      <>
                        <button
                          className="btn btn-light position-absolute"
                          style={{ top: '50%', left: 8, transform: 'translateY(-50%)' }}
                          onClick={() => setViewImageIndex((prev) => (prev - 1 + viewData.images.length) % viewData.images.length)}
                        >
                          ‹
                        </button>
                        <button
                          className="btn btn-light position-absolute"
                          style={{ top: '50%', right: 8, transform: 'translateY(-50%)' }}
                          onClick={() => setViewImageIndex((prev) => (prev + 1) % viewData.images.length)}
                        >
                          ›
                        </button>
                        <div className="position-absolute bottom-0 start-50 translate-middle-x mb-2 d-flex gap-1">
                          {viewData.images.map((_, idx) => (
                            <button
                              key={idx}
                              className={`btn p-1 ${idx === viewImageIndex ? 'btn-primary' : 'btn-light'}`}
                              style={{ width: 8, height: 8, borderRadius: '50%' }}
                              onClick={() => setViewImageIndex(idx)}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
                <div className="mb-2 text-muted d-flex align-items-center gap-2">
                  <MapPin size={16} />
                  <span>{viewData.location || "Location N/A"}</span>
                </div>
                <div className="mb-3 d-flex align-items-center gap-2">
                  <IndianRupee size={18} className="text-success" />
                  <span className="fw-bold fs-5">{viewData.price ? viewData.price.toLocaleString() : "N/A"}</span>
                </div>
                {viewData.description && (
                  <div className="card shadow-sm mb-3"><div className="card-body">
                    <h6 className="fw-bold mb-2">Description</h6>
                    <p className="text-muted mb-0">{viewData.description}</p>
                  </div></div>
                )}
                {viewData.owner?.name && (
                  <div className="border-top pt-2 mb-3">
                    <small className="text-muted">Owner: {viewData.owner.name}</small>
                  </div>
                )}
                <div className="row g-2 mb-3">
                  <div className="col-6 col-md-3">
                    <div className="d-flex align-items-center gap-2 p-2 bg-light rounded">
                      <Bed size={18} className="text-primary" />
                      <div>
                        <div className="fw-bold">{viewData.bedrooms ?? '-'}</div>
                        <small className="text-muted">Bedrooms</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="d-flex align-items-center gap-2 p-2 bg-light rounded">
                      <Bath size={18} className="text-primary" />
                      <div>
                        <div className="fw-bold">{viewData.bathrooms ?? '-'}</div>
                        <small className="text-muted">Bathrooms</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="d-flex align-items-center gap-2 p-2 bg-light rounded">
                      <Square size={18} className="text-primary" />
                      <div>
                        <div className="fw-bold">{viewData.area ?? '-'}</div>
                        <small className="text-muted">Sq.ft</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="d-flex align-items-center gap-2 p-2 bg-light rounded">
                      <Calendar size={18} className="text-primary" />
                      <div>
                        <div className="fw-bold">{viewData.yearBuilt ?? '-'}</div>
                        <small className="text-muted">Built</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card shadow-sm mb-3">
                  <div className="card-body">
                    <h6 className="fw-bold mb-2">Property Details</h6>
                    <div className="row g-2 small">
                      <div className="col-6">
                        <div className="d-flex justify-content-between py-1 border-bottom">
                          <span className="text-muted">Property Type</span>
                          <span className="fw-semibold">{viewData.propertyType || '-'}</span>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="d-flex justify-content-between py-1 border-bottom">
                          <span className="text-muted">Furnished</span>
                          <span className="fw-semibold">{viewData.furnished || '-'}</span>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="d-flex justify-content-between py-1 border-bottom">
                          <span className="text-muted">Parking</span>
                          <span className="fw-semibold">{viewData.parking || '-'}</span>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="d-flex justify-content-between py-1 border-bottom">
                          <span className="text-muted">Available From</span>
                          <span className="fw-semibold">{formatDMY(viewData.availableFrom)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {(viewData.features?.length ?? 0) > 0 && (
                  <div className="card shadow-sm mb-3">
                    <div className="card-body">
                      <h6 className="fw-bold mb-2">Features & Amenities</h6>
                      <div className="row g-2">
                        {viewData.features.map((feature, idx) => (
                          <div key={idx} className="col-6">
                            <div className="d-flex align-items-center gap-2 p-1">
                              <div className="bg-success bg-opacity-10 rounded-circle p-1">
                                <div className="bg-success rounded-circle" style={{width: 8, height: 8}} />
                              </div>
                              <span className="small">{feature}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div className="d-flex gap-2 mt-3">
                  {!viewData.verified && (
                    <button
                      className="action-btn approve flex-fill"
                      onClick={async () => {
                        await handleApprove(viewData._id, true);
                        setViewData({...viewData, verified: true});
                      }}
                      disabled={actionLoading === viewData._id}
                    >
                      {actionLoading === viewData._id ? (
                        <span className="spinner-border spinner-border-sm" />
                      ) : (
                        <>
                          <Check size={18} />
                          Approve
                        </>
                      )}
                    </button>
                  )}
                  <button className="action-btn view flex-fill" onClick={() => setViewOpen(false)}>
                    <X size={18} />
                    Close
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {showModal && modalData && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              {modalData.type === "success" ? (
                <div className="mb-3">
                  <CheckCircle size={48} style={{color: '#28a745'}} />
                </div>
              ) : (
                <div className="mb-3">
                  <AlertCircle size={48} style={{color: '#dc3545'}} />
                </div>
              )}
              <h5 className="fw-bold mb-2">
                {modalData.type === "success" ? "Success!" : "Error"}
              </h5>
              <p className="text-muted mb-0">{modalData.message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;