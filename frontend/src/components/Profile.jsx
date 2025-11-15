import React, { useEffect, useState } from "react";
import { Home, Heart, Mail, Phone, MapPin, Calendar, IndianRupee } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import SidebarLayout from "./SidebarLayout.jsx";

const Profile = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [listedProperties, setListedProperties] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Add Bootstrap CSS
    const link = document.createElement('link');
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Fetch user properties and favorites
    const fetchUserData = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }
      
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        const [propertiesRes, favoritesRes] = await Promise.all([
          fetch("https://habito-rzwt.onrender.com/user/getUserProperties", { headers }),
          fetch("https://habito-rzwt.onrender.com/user/getUserFavourite", { headers })
        ]);

        if (propertiesRes.ok) {
          const propertiesData = await propertiesRes.json();
          setListedProperties(propertiesData || []);
        }

        if (favoritesRes.ok) {
          const favoritesData = await favoritesRes.json();
          setFavorites(favoritesData || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    return () => {
      document.head.removeChild(link);
    };
  }, [isAuthenticated, user]);

  const PropertyCard = ({ property, showRemove = false }) => (
    <div className="card h-100 shadow-sm border-0">
      <div 
        className="card-img-top d-flex align-items-center justify-content-center"
        style={{ 
          height: '150px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        <Home size={48} className="text-white" style={{ opacity: 0.3 }} />
      </div>
      
      <div className="card-body">
        <h6 className="card-title fw-bold">{property.title}</h6>
        <p className="card-text text-muted small mb-2" style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {property.description || "No description"}
        </p>
        
        <div className="d-flex align-items-center gap-2 mb-2">
          <IndianRupee size={16} className="text-success" />
          <span className="fw-bold">₹{property.price?.toLocaleString()}</span>
        </div>
        
        {property.location && (
          <div className="d-flex align-items-center gap-2 text-muted small">
            <MapPin size={14} />
            <span>{property.location}</span>
          </div>
        )}
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="text-center">
          <h4>Please login to view your profile</h4>
          <a href="/login" className="btn btn-primary mt-3">Go to Login</a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <SidebarLayout>
      <div className="container py-5 bg-light" style={{ minHeight: '100%' }}>
        {/* User Info Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <div className="row align-items-center">
                  <div className="col-auto">
                    <div 
                      className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                      style={{ width: '100px', height: '100px', fontSize: '2rem' }}
                    >
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </div>
                  <div className="col">
                    <h2 className="fw-bold mb-2">{user?.name || 'User Name'}</h2>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="d-flex align-items-center gap-2 text-muted">
                          <Mail size={18} />
                          <span>{user?.email || 'user@example.com'}</span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center gap-2 text-muted">
                          <Phone size={18} />
                          <span>{user?.phone || '+91 XXXXX XXXXX'}</span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center gap-2 text-muted">
                          <MapPin size={18} />
                          <span>{user?.location || 'Location not provided'}</span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center gap-2 text-muted">
                          <Calendar size={18} />
                          <span>Member since {user?.joinedDate || '2024'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Properties and Favorites Side by Side */}
        <div className="row g-4">
          {/* Listed Properties */}
          <div className="col-lg-6">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-header bg-white border-bottom">
                <h4 className="mb-0 fw-bold d-flex align-items-center gap-2">
                  <Home size={24} className="text-primary" />
                  My Properties
                  <span className="badge bg-primary ms-2">{listedProperties.length}</span>
                </h4>
              </div>
              <div className="card-body p-4" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {listedProperties.length === 0 ? (
                  <div className="text-center py-5">
                    <Home size={48} className="text-muted mb-3" />
                    <p className="text-muted">No properties listed yet</p>
                  </div>
                ) : (
                  <div className="row g-3">
                    {listedProperties.map((property) => (
                      <div key={property._id} className="col-12">
                        <PropertyCard property={property} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Favorites */}
          <div className="col-lg-6">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-header bg-white border-bottom">
                <h4 className="mb-0 fw-bold d-flex align-items-center gap-2">
                  <Heart size={24} className="text-danger" />
                  Favorites
                  <span className="badge bg-danger ms-2">{favorites.length}</span>
                </h4>
              </div>
              <div className="card-body p-4" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {favorites.length === 0 ? (
                  <div className="text-center py-5">
                    <Heart size={48} className="text-muted mb-3" />
                    <p className="text-muted">No favorites yet</p>
                  </div>
                ) : (
                  <div className="row g-3">
                    {favorites.map((property) => (
                      <div key={property._id} className="col-12">
                        <PropertyCard property={property} showRemove />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Profile;
