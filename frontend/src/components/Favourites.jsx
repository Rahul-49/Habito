import React, { useEffect, useState } from "react";
import { Search, Home, Heart, User, Settings, Menu, X, MapPin, IndianRupee, Trash2,Building } from "lucide-react";
import SidebarLayout from "./SidebarLayout.jsx";

const Favourites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch("https://habito-rzwt.onrender.com/user/getUserFavourite"
        , {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
        );
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setFavorites(data || []);
      } catch (err) {
        setError("Failed to load favorites");
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const filteredFavorites = favorites.filter(p => 
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const removeFavorite = async (propertyId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://habito-rzwt.onrender.com/user/removeUserFavourite/${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to remove');
      
      setFavorites(favorites.filter(p => p._id !== propertyId));
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  };

  const headerRight = (
    <div className="flex-fill" style={{ maxWidth: '800px' }}>
      <div className="input-group">
        <span className="input-group-text bg-white">
          <Search size={20} className="text-muted" />
        </span>
        <input
          type="text"
          className="form-control border-start-0"
          placeholder="Search favorites by title, location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <SidebarLayout headerRight={headerRight}>
        <div className="p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100%' }}>
          <div className="container-fluid">
            <div className="mb-4">
              <div className="d-flex align-items-center gap-2 mb-2">
                <Heart size={32} className="text-danger" />
                <h2 className="fw-bold mb-0">My Favorites</h2>
              </div>
              <p className="text-muted">
                {filteredFavorites.length} {filteredFavorites.length === 1 ? 'property' : 'properties'} saved
              </p>
            </div>

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
            ) : filteredFavorites.length === 0 ? (
              <div className="text-center py-5">
                <Heart size={64} className="text-muted mb-3" />
                <p className="text-muted fs-5">
                  {searchQuery ? 'No matching favorites found' : 'No favorites yet'}
                </p>
                <p className="text-muted">Start adding properties to your favorites!</p>
              </div>
            ) : (
              <div className="row g-4">
                {filteredFavorites.map((p) => (
                  <div key={p._id} className="col-12 col-md-6 col-lg-4">
                    <div className="card h-100 shadow-sm border-0 position-relative">
                      <button
                        className="btn btn-danger position-absolute top-0 end-0 m-2 rounded-circle p-2"
                        style={{ zIndex: 10, width: '36px', height: '36px' }}
                        onClick={() => removeFavorite(p._id)}
                        title="Remove from favorites"
                      >
                        <Trash2 size={18} />
                      </button>

                      <div 
                        className="card-img-top d-flex align-items-center justify-content-center position-relative"
                        style={{ 
                          height: '200px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        }}
                      >
                        <Home size={64} className="text-white" style={{ opacity: 0.3 }} />
                      </div>
                      
                      <div className="card-body">
                        <h5 className="card-title fw-bold">{p.title}</h5>
                        <p className="card-text text-muted small" style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {p.description || "No description available"}
                        </p>
                        
                        <div className="mb-3">
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <IndianRupee size={18} className="text-success" />
                            <span className="fw-bold fs-5">₹{p.price?.toLocaleString()}</span>
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
                        
                        <button className="btn btn-primary w-100">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
    </SidebarLayout>
  );
};

export default Favourites;
