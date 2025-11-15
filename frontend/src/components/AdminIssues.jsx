import React, { useEffect, useState } from "react";
import { 
  Home, AlertCircle, Clock, CheckCircle, FileText, 
  Plus, Menu, X, User, Heart, Building, MapPin, 
  MessageSquare, Filter, UserCircle, Mail, LogOut,
  Eye, Shield
} from "lucide-react";

const AdminIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ status: "", category: "" });
  const [noteText, setNoteText] = useState({});
  const [updating, setUpdating] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedNotes, setExpandedNotes] = useState({});

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      if (filters.status) params.set("status", filters.status);
      if (filters.category) params.set("category", filters.category);
      const res = await fetch(`https://habito-rzwt.onrender.com/issues?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch issues");
      const data = await res.json();
      setIssues(Array.isArray(data) ? data : []);
    } catch (e) {
      setError("Failed to load issues");
    } finally {
      setLoading(false);
    }
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
      
      .hover-bg-secondary:hover {
        background-color: rgba(255, 255, 255, 0.1) !important;
      }

      .stat-card {
        background: white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        transition: all 0.3s;
      }

      .stat-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.12);
      }

      .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .filter-panel {
        background: white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        margin-bottom: 24px;
      }

      .filter-select {
        padding: 10px 14px;
        border: 2px solid #dee2e6;
        border-radius: 8px;
        font-size: 14px;
        background: white;
        cursor: pointer;
        transition: all 0.2s;
        font-weight: 500;
      }

      .filter-select:focus {
        outline: none;
        border-color: #2c3e50;
        box-shadow: 0 0 0 3px rgba(44, 62, 80, 0.1);
      }

      .issue-card {
        background: white;
        border-radius: 12px;
        padding: 24px;
        margin-bottom: 20px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        transition: all 0.3s;
        border-left: 4px solid #dee2e6;
      }

      .issue-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.12);
      }

      .issue-card.pending {
        border-left-color: #ffc107;
      }

      .issue-card.under_review {
        border-left-color: #17a2b8;
      }

      .issue-card.resolved {
        border-left-color: #28a745;
      }

      .status-badge {
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        text-transform: uppercase;
      }

      .status-badge.pending {
        background: #fff3cd;
        color: #856404;
      }

      .status-badge.under_review {
        background: #d1ecf1;
        color: #0c5460;
      }

      .status-badge.resolved {
        background: #d4edda;
        color: #155724;
      }

      .category-badge {
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 500;
        background: #e9ecef;
        color: #495057;
      }

      .info-section {
        background: #f8f9fa;
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 16px;
      }

      .info-item {
        display: flex;
        align-items: start;
        gap: 12px;
        margin-bottom: 12px;
      }

      .info-item:last-child {
        margin-bottom: 0;
      }

      .status-actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-bottom: 16px;
      }

      .status-btn {
        padding: 8px 16px;
        border: 2px solid;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        background: white;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .status-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .status-btn.pending {
        border-color: #ffc107;
        color: #856404;
      }

      .status-btn.pending:hover:not(:disabled) {
        background: #fff3cd;
        transform: translateY(-1px);
      }

      .status-btn.under_review {
        border-color: #17a2b8;
        color: #0c5460;
      }

      .status-btn.under_review:hover:not(:disabled) {
        background: #d1ecf1;
        transform: translateY(-1px);
      }

      .status-btn.resolved {
        border-color: #28a745;
        color: #155724;
      }

      .status-btn.resolved:hover:not(:disabled) {
        background: #d4edda;
        transform: translateY(-1px);
      }

      .notes-section {
        background: #f8f9fa;
        padding: 16px;
        border-radius: 8px;
        margin-top: 16px;
      }

      .note-item {
        background: white;
        padding: 12px;
        border-radius: 6px;
        margin-bottom: 8px;
        border-left: 3px solid #28a745;
      }

      .note-input-group {
        display: flex;
        gap: 8px;
      }

      .note-input {
        flex: 1;
        padding: 10px 14px;
        border: 2px solid #dee2e6;
        border-radius: 8px;
        font-size: 14px;
        transition: all 0.2s;
      }

      .note-input:focus {
        outline: none;
        border-color: #28a745;
        box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
      }

      .btn-add-note {
        padding: 10px 20px;
        background: #28a745;
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .btn-add-note:hover:not(:disabled) {
        background: #218838;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
      }

      .btn-add-note:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .empty-state {
        background: white;
        border-radius: 12px;
        padding: 60px 20px;
        text-align: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      }

      @media (max-width: 768px) {
        .issue-card {
          padding: 16px;
        }

        .status-actions {
          flex-direction: column;
        }

        .status-btn {
          width: 100%;
          justify-content: center;
        }

        .note-input-group {
          flex-direction: column;
        }

        .btn-add-note {
          width: 100%;
          justify-content: center;
        }
      }
    `;
    document.head.appendChild(style);

    fetchIssues();

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
    };
  }, [filters.status, filters.category]);

  const setStatus = async (id, status) => {
    try {
      setUpdating(id + ":status");
      const token = localStorage.getItem("token");
      const res = await fetch(`https://habito-rzwt.onrender.com/issues/${id}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      const updated = await res.json();
      setIssues((prev) => prev.map((i) => (i._id === id ? updated : i)));
    } catch (e) {
      alert("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const addNote = async (id) => {
    const text = (noteText[id] || "").trim();
    if (!text) return;
    try {
      setUpdating(id + ":note");
      const token = localStorage.getItem("token");
      const res = await fetch(`https://habito-rzwt.onrender.com/issues/${id}/notes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("Failed to add note");
      const updated = await res.json();
      setIssues((prev) => prev.map((i) => (i._id === id ? updated : i)));
      setNoteText((n) => ({ ...n, [id]: "" }));
    } catch (e) {
      alert("Failed to add note");
    } finally {
      setUpdating(null);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <Clock size={14} />;
      case 'under_review': return <Eye size={14} />;
      case 'resolved': return <CheckCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  const stats = {
    total: issues.length,
    pending: issues.filter(i => i.status === 'pending').length,
    underReview: issues.filter(i => i.status === 'under_review').length,
    resolved: issues.filter(i => i.status === 'resolved').length
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
          <a href="/admin" className="d-flex align-items-center gap-3 text-white text-decoration-none p-3 rounded mb-2 hover-bg-secondary">
            <Building size={20} />
            <span>Properties</span>
          </a>
          <a href="/admin/issues" className="d-flex align-items-center gap-3 text-white text-decoration-none p-3 rounded mb-2 bg-secondary">
            <FileText size={20} />
            <span>Reported Issues</span>
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
          <a href="/logout" className="d-flex align-items-center gap-3 text-white text-decoration-none p-3 rounded mb-2 hover-bg-secondary">
            <LogOut size={20} />
            <span>Logout</span>
          </a>
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
            <div className="d-flex align-items-center gap-3">
              <button 
                className="btn btn-outline-secondary"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={24} />
              </button>
              <h3 className="mb-0 fw-bold" style={{color: '#2c3e50'}}>Reported Issues</h3>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4">
          <div className="container-fluid" style={{maxWidth: '1400px'}}>
            {/* Statistics */}
            <div className="row g-3 mb-4">
              <div className="col-md-3">
                <div className="stat-card">
                  <div className="d-flex align-items-center gap-3">
                    <div className="stat-icon" style={{background: '#e3f2fd'}}>
                      <Shield size={24} style={{color: '#1976d2'}} />
                    </div>
                    <div>
                      <h3 className="fw-bold mb-0">{stats.total}</h3>
                      <small className="text-muted">Total Issues</small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="stat-card">
                  <div className="d-flex align-items-center gap-3">
                    <div className="stat-icon" style={{background: '#fff3cd'}}>
                      <Clock size={24} style={{color: '#856404'}} />
                    </div>
                    <div>
                      <h3 className="fw-bold mb-0">{stats.pending}</h3>
                      <small className="text-muted">Pending</small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="stat-card">
                  <div className="d-flex align-items-center gap-3">
                    <div className="stat-icon" style={{background: '#d1ecf1'}}>
                      <Eye size={24} style={{color: '#0c5460'}} />
                    </div>
                    <div>
                      <h3 className="fw-bold mb-0">{stats.underReview}</h3>
                      <small className="text-muted">Under Review</small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="stat-card">
                  <div className="d-flex align-items-center gap-3">
                    <div className="stat-icon" style={{background: '#d4edda'}}>
                      <CheckCircle size={24} style={{color: '#155724'}} />
                    </div>
                    <div>
                      <h3 className="fw-bold mb-0">{stats.resolved}</h3>
                      <small className="text-muted">Resolved</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="filter-panel">
              <div className="d-flex align-items-center gap-2 mb-3">
                <Filter size={20} className="text-muted" />
                <h5 className="mb-0 fw-bold">Filters</h5>
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Status</label>
                  <select
                    className="filter-select w-100"
                    value={filters.status}
                    onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="under_review">Under Review</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Category</label>
                  <select
                    className="filter-select w-100"
                    value={filters.category}
                    onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
                  >
                    <option value="">All Categories</option>
                    <option value="fraud">Fraud</option>
                    <option value="incorrect_info">Incorrect Info</option>
                    <option value="duplicate_listing">Duplicate Listing</option>
                    <option value="offensive_content">Offensive Content</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Issues List */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading issues...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger d-flex align-items-center" role="alert">
                <AlertCircle size={20} className="me-2" />
                {error}
              </div>
            ) : issues.length === 0 ? (
              <div className="empty-state">
                <FileText size={64} className="text-muted mb-3" />
                <h4 className="fw-bold mb-2">No Issues Found</h4>
                <p className="text-muted">There are no reported issues matching your filters.</p>
              </div>
            ) : (
              issues.map((issue) => (
                <div key={issue._id} className={`issue-card ${issue.status}`}>
                  {/* Header */}
                  <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className={`status-badge ${issue.status}`}>
                          {getStatusIcon(issue.status)}
                          {issue.status?.replace(/_/g, " ")}
                        </span>
                        <span className="category-badge">
                          {issue.category?.replace(/_/g, " ")}
                        </span>
                      </div>
                      <small className="text-muted">
                        <Clock size={14} className="me-1" />
                        Reported on {new Date(issue.createdAt).toLocaleString()}
                      </small>
                    </div>
                  </div>

                  <div className="row g-3">
                    {/* Property & Reporter Info */}
                    <div className="col-lg-6">
                      <div className="info-section">
                        <h6 className="fw-bold mb-3 small text-uppercase text-muted">Property Details</h6>
                        <div className="info-item">
                          <Building size={20} className="text-muted flex-shrink-0 mt-1" />
                          <div>
                            <div className="fw-semibold">{issue.property?.title || "Property"}</div>
                            {issue.property?.location && (
                              <div className="d-flex align-items-center gap-1 text-muted small mt-1">
                                <MapPin size={14} />
                                <span>{issue.property.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="info-section">
                        <h6 className="fw-bold mb-3 small text-uppercase text-muted">Reporter Details</h6>
                        <div className="info-item">
                          <UserCircle size={20} className="text-muted flex-shrink-0 mt-1" />
                          <div>
                            <div className="fw-semibold">{issue.reporter?.name || "User"}</div>
                            {issue.reporter?.email && (
                              <div className="d-flex align-items-center gap-1 text-muted small mt-1">
                                <Mail size={14} />
                                <span>{issue.reporter.email}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="col-lg-6">
                      <h6 className="fw-bold mb-3 small text-uppercase text-muted">Change Status</h6>
                      <div className="status-actions">
                        <button
                          className="status-btn pending"
                          disabled={updating === issue._id + ":status"}
                          onClick={() => setStatus(issue._id, "pending")}
                        >
                          {updating === issue._id + ":status" ? (
                            <span className="spinner-border spinner-border-sm" />
                          ) : (
                            <>
                              <Clock size={16} />
                              Pending
                            </>
                          )}
                        </button>
                        <button
                          className="status-btn under_review"
                          disabled={updating === issue._id + ":status"}
                          onClick={() => setStatus(issue._id, "under_review")}
                        >
                          {updating === issue._id + ":status" ? (
                            <span className="spinner-border spinner-border-sm" />
                          ) : (
                            <>
                              <Eye size={16} />
                              Under Review
                            </>
                          )}
                        </button>
                        <button
                          className="status-btn resolved"
                          disabled={updating === issue._id + ":status"}
                          onClick={() => setStatus(issue._id, "resolved")}
                        >
                          {updating === issue._id + ":status" ? (
                            <span className="spinner-border spinner-border-sm" />
                          ) : (
                            <>
                              <CheckCircle size={16} />
                              Resolved
                            </>
                          )}
                        </button>
                      </div>

                      {/* Add Note */}
                      <div className="mt-3">
                        <h6 className="fw-bold mb-2 small text-uppercase text-muted">Add Internal Note</h6>
                        <div className="note-input-group">
                          <input
                            type="text"
                            className="note-input"
                            placeholder="Add a note..."
                            value={noteText[issue._id] || ""}
                            onChange={(e) => setNoteText((n) => ({ ...n, [issue._id]: e.target.value }))}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') addNote(issue._id);
                            }}
                          />
                          <button
                            className="btn-add-note"
                            disabled={updating === issue._id + ":note" || !(noteText[issue._id] || "").trim()}
                            onClick={() => addNote(issue._id)}
                          >
                            {updating === issue._id + ":note" ? (
                              <span className="spinner-border spinner-border-sm" />
                            ) : (
                              <>
                                <Plus size={18} />
                                Add
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Notes List */}
                      {issue.notes && issue.notes.length > 0 && (
                        <div className="notes-section mt-3">
                          <strong className="small d-block mb-2">
                            <MessageSquare size={16} className="me-1" />
                            Internal Notes ({issue.notes.length})
                          </strong>
                          {issue.notes.map((note, idx) => (
                            <div key={idx} className="note-item">
                              <p className="mb-1 small">{note.text}</p>
                              <small className="text-muted">
                                {new Date(note.createdAt).toLocaleString()}
                              </small>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminIssues;
