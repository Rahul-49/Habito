import React, { useState, useEffect, useContext } from "react";
import { Home, Heart, User, Building, Menu, X, Search, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const SidebarLayout = ({ headerRight = null, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  return (
    <div className={`d-flex ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Sidebar */}
      <div 
        className={`bg-dark text-white position-fixed ${sidebarOpen ? '' : 'd-none'}`}
        style={{ width: 250, height: '100vh', zIndex: 1050 }}
      >
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom border-secondary">
          <h4 className="mb-0 fw-bold">Habito</h4>
          <button className="btn btn-link text-white p-0" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <nav className="p-3">
          {(() => {
            const path = typeof window !== 'undefined' ? window.location.pathname : '';
            const linkCls = (href) => `d-flex align-items-center gap-3 text-white text-decoration-none p-3 rounded mb-2 ${path === href ? 'bg-secondary' : 'hover-bg-secondary'}`;
            return (
              <>
                <a href="/" className={linkCls('/')} onClick={() => setSidebarOpen(false)}>
                  <Home size={20} />
                  <span>Home</span>
                </a>
                <a href="/properties" className={linkCls('/properties')} onClick={() => setSidebarOpen(false)}>
                  <Home size={20} />
                  <span>Properties</span>
                </a>
                <a href="/favourites" className={linkCls('/favourites')} onClick={() => setSidebarOpen(false)}>
                  <Heart size={20} />
                  <span>Favorites</span>
                </a>
                <a href="/profile" className={linkCls('/profile')} onClick={() => setSidebarOpen(false)}>
                  <User size={20} />
                  <span>Profile</span>
                </a>
                <a href="/my-issues" className={linkCls('/my-issues')} onClick={() => setSidebarOpen(false)}>
                  <Settings size={20} />
                  <span>My Reports</span>
                </a>
                <a href="/list-property" className={linkCls('/list-property')} onClick={() => setSidebarOpen(false)}>
                  <Building size={20} />
                  <span>List a Property</span>
                </a>
              </>
            );
          })()}
        </nav>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
          style={{ zIndex: 1040 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-fill d-flex flex-column" style={{ marginLeft: 0 }}>
        <header className="bg-white border-bottom p-3">
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-outline-secondary" onClick={() => setSidebarOpen((s) => !s)}>
              <Menu size={24} />
            </button>
            <div className="flex-fill">
              {headerRight}
            </div>
            <div className="ms-auto position-relative" style={{ userSelect: 'none' }}>
              <div
                className="d-flex align-items-center justify-content-center rounded-circle border"
                style={{ width: 40, height: 40, cursor: 'pointer' }}
                onClick={() => setProfileOpen((s) => !s)}
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
                    onClick={() => { setProfileOpen(false); logout(); navigate('/login'); }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-fill overflow-auto">
          {children}
        </main>
      </div>

      <style>{`
        .hover-bg-secondary:hover { background-color: rgba(108,117,125,.3) !important; }
      `}</style>
    </div>
  );
};

export default SidebarLayout;
