import React, { useEffect, useState } from "react";
import { 
  Home, AlertCircle, Clock, CheckCircle, FileText, 
  Plus, ArrowLeft, Menu, X, User, Heart, Building,
  MapPin, MessageSquare
} from "lucide-react";

const MyIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [noteText, setNoteText] = useState({});
  const [updating, setUpdating] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/issues/mine", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch my issues");
      const data = await res.json();
      setIssues(Array.isArray(data) ? data : []);
    } catch (e) {
      setError("Failed to load your issues");
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
        background: #f8f9fa;
        min-height: 100vh;
      }
      
      .hover-bg-secondary:hover {
        background-color: rgba(255, 255, 255, 0.1) !important;
      }

      .page-header {
        background: white;
        border-radius: 12px;
        padding: 32px;
        margin-bottom: 24px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
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

      .issue-card.in_progress {
        border-left-color: #17a2b8;
      }

      .issue-card.resolved {
        border-left-color: #28a745;
      }

      .issue-card.closed {
        border-left-color: #6c757d;
      }

      .status-badge {
        padding: 6px 12px;
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

      .status-badge.in_progress {
        background: #d1ecf1;
        color: #0c5460;
      }

      .status-badge.resolved {
        background: #d4edda;
        color: #155724;
      }

      .status-badge.closed {
        background: #e2e3e5;
        color: #383d41;
      }

      .category-badge {
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 500;
        background: #e9ecef;
        color: #495057;
      }

      .property-info {
        background: #f8f9fa;
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 16px;
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

      .stats-row {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        margin-bottom: 24px;
      }

      .stat-item {
        flex: 1;
        min-width: 150px;
        background: white;
        padding: 16px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      }

      @media (max-width: 768px) {
        .page-header {
          padding: 20px;
        }

        .issue-card {
          padding: 16px;
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
  }, []);

  const addNote = async (id) => {
    const text = (noteText[id] || "").trim();
    if (!text) return;
    try {
      setUpdating(id + ":note");
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/issues/${id}/notes`, {
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
      case 'in_progress': return <AlertCircle size={14} />;
      case 'resolved': return <CheckCircle size={14} />;
      case 'closed': return <CheckCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  const stats = {
    total: issues.length,
    pending: issues.filter(i => i.status === 'pending').length,
    inProgress: issues.filter(i => i.status === 'in_progress').length,
    resolved: issues.filter(i => i.status === 'resolved').length
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className={`bg-dark text-white position-fixed properties-sidebar ${sidebarOpen ? '' : 'd-none'}`}>
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
          <a href="/" className="d-flex align-items-center gap-3 text-white text-decoration-none p-3 rounded mb-2 hover-bg-secondary">
            <Home size={20} />
            <span>Home</span>
          </a>
          <a href="/properties" className="d-flex align-items-center gap-3 text-white text-decoration-none p-3 rounded mb-2 hover-bg-secondary">
            <Building size={20} />
            <span>Properties</span>
          </a>
          <a href="/my-issues" className="d-flex align-items-center gap-3 text-white text-decoration-none p-3 rounded mb-2 bg-secondary">
            <FileText size={20} />
            <span>My Reports</span>
          </a>
          <a href="/favourites" className="d-flex align-items-center gap-3 text-white text-decoration-none p-3 rounded mb-2 hover-bg-secondary">
            <Heart size={20} />
            <span>Favorites</span>
          </a>
          <a href="/profile" className="d-flex align-items-center gap-3 text-white text-decoration-none p-3 rounded mb-2 hover-bg-secondary">
            <User size={20} />
            <span>Profile</span>
          </a>
        </nav>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 properties-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-fill properties-main">
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
              <h3 className="mb-0 fw-bold" style={{color: '#2c3e50'}}>My Reports</h3>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4">
          <div className="container-fluid" style={{maxWidth: '1200px'}}>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading your reports...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger d-flex align-items-center" role="alert">
                <AlertCircle size={20} className="me-2" />
                {error}
              </div>
            ) : issues.length === 0 ? (
              <div className="empty-state">
                <FileText size={64} className="text-muted mb-3" />
                <h4 className="fw-bold mb-2">No Reports Yet</h4>
                <p className="text-muted mb-4">You haven't reported any issues yet.</p>
                <a href="/properties" className="btn btn-primary">
                  Browse Properties
                </a>
              </div>
            ) : (
              <>
                {/* Statistics */}
                <div className="stats-row">
                  <div className="stat-item">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <FileText size={20} className="text-primary" />
                      <span className="text-muted small">Total Reports</span>
                    </div>
                    <h3 className="fw-bold mb-0">{stats.total}</h3>
                  </div>
                  <div className="stat-item">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <Clock size={20} style={{color: '#ffc107'}} />
                      <span className="text-muted small">Pending</span>
                    </div>
                    <h3 className="fw-bold mb-0">{stats.pending}</h3>
                  </div>
                  <div className="stat-item">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <AlertCircle size={20} style={{color: '#17a2b8'}} />
                      <span className="text-muted small">In Progress</span>
                    </div>
                    <h3 className="fw-bold mb-0">{stats.inProgress}</h3>
                  </div>
                  <div className="stat-item">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <CheckCircle size={20} style={{color: '#28a745'}} />
                      <span className="text-muted small">Resolved</span>
                    </div>
                    <h3 className="fw-bold mb-0">{stats.resolved}</h3>
                  </div>
                </div>

                {/* Issues List */}
                {issues.map((issue) => (
                  <div key={issue._id} className={`issue-card ${issue.status}`}>
                    <div className="d-flex justify-content-between align-items-start mb-3">
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

                    {/* Property Info */}
                    <div className="property-info">
                      <div className="d-flex align-items-start gap-2 mb-2">
                        <Building size={20} className="text-muted mt-1" />
                        <div>
                          <h6 className="fw-bold mb-1">
                            {issue.property?.title || "Property"}
                          </h6>
                          {issue.property?.location && (
                            <div className="d-flex align-items-center gap-1 text-muted small">
                              <MapPin size={14} />
                              <span>{issue.property.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Add Note Section */}
                    <div className="mt-3">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <MessageSquare size={18} className="text-muted" />
                        <strong className="small">Add Note</strong>
                      </div>
                      <div className="note-input-group">
                        <input
                          type="text"
                          className="note-input"
                          placeholder="Add a note about this issue..."
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
                              Add Note
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Notes List */}
                    {issue.notes && issue.notes.length > 0 && (
                      <div className="notes-section">
                        <strong className="small d-block mb-2">
                          Notes ({issue.notes.length})
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
                ))}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyIssues;