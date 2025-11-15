import React, { useState, useContext } from "react";
import { 
  Home, Heart, User, Menu, X, Building, 
  MapPin, TrendingUp, Shield, Clock,
  ChevronRight, Star, Users, Award, CheckCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const HomePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const stats = [
    { icon: Building, value: "10K+", label: "Properties Listed" },
    { icon: Users, value: "50K+", label: "Happy Customers" },
    { icon: MapPin, value: "100+", label: "Cities Covered" },
    { icon: Star, value: "4.8", label: "Average Rating" }
  ];

  const features = [
    {
      icon: Shield,
      title: "Verified Properties",
      description: "All properties are thoroughly verified and legally compliant for your peace of mind"
    },
    {
      icon: TrendingUp,
      title: "Best Market Prices",
      description: "Competitive pricing with transparent deals and no hidden charges"
    },
    {
      icon: Clock,
      title: "Quick Process",
      description: "Fast and hassle-free property transactions with dedicated support"
    },
    {
      icon: Award,
      title: "Trusted Platform",
      description: "Industry-leading platform trusted by thousands of property owners and buyers"
    }
  ];

  const services = [
    {
      title: "Buy Property",
      description: "Find your dream home from thousands of verified listings across multiple cities",
      icon: Home,
      color: "#28a745"
    },
    {
      title: "Rent Property",
      description: "Discover rental properties that fit your budget and lifestyle preferences",
      icon: Building,
      color: "#17a2b8"
    },
    {
      title: "Lease Commercial",
      description: "Lease commercial spaces for your business with flexible terms and prime locations",
      icon: Building,
      color: "#fd7e14"
    }
  ];

  React.useEffect(() => {
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

      .hero-section {
        background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
        min-height: 500px;
        position: relative;
        overflow: hidden;
      }

      .hero-pattern {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0.05;
        background-image: 
          repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px);
      }

      .feature-card {
        background: white;
        border-radius: 12px;
        padding: 32px;
        transition: all 0.3s;
        border: 1px solid #e9ecef;
        height: 100%;
      }

      .feature-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 40px rgba(0,0,0,0.1);
        border-color: #dee2e6;
      }

      .feature-icon {
        width: 64px;
        height: 64px;
        border-radius: 12px;
        background: #f8f9fa;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
      }

      .service-card {
        background: white;
        border-radius: 16px;
        padding: 40px;
        transition: all 0.3s;
        border: 2px solid #e9ecef;
        height: 100%;
        text-align: center;
      }

      .service-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 40px rgba(0,0,0,0.12);
      }

      .service-icon-wrapper {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 24px;
      }

      .stat-card {
        text-align: center;
        padding: 24px;
      }

      .stat-value {
        font-size: 2.5rem;
        font-weight: 700;
        color: #2c3e50;
      }

      .cta-section {
        background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
        padding: 80px 0;
        position: relative;
        overflow: hidden;
      }

      .cta-pattern {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0.05;
        background-image: 
          repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px);
      }

      .process-step {
        text-align: center;
        padding: 24px;
      }

      .step-number {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: #28a745;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        font-weight: 700;
        margin: 0 auto 20px;
      }

      @media (max-width: 768px) {
        .hero-section {
          min-height: 400px;
        }
        
        .service-card {
          padding: 30px 20px;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
    };
  }, []);

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
          <a href="/" className="d-flex align-items-center gap-3 text-white text-decoration-none p-3 rounded mb-2 bg-secondary">
            <Home size={20} />
            <span>Home</span>
          </a>
          <a href="/properties" className="d-flex align-items-center gap-3 text-white text-decoration-none p-3 rounded mb-2 hover-bg-secondary">
            <Building size={20} />
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
          <div className="container-fluid">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <button 
                  className="btn btn-outline-secondary d-lg-none"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu size={24} />
                </button>
                <h3 className="mb-0 fw-bold" style={{color: '#2c3e50'}}>Habito</h3>
              </div>
              
              <div className="d-flex gap-2 align-items-center position-relative" style={{ userSelect: 'none' }}>
                <a href="/list-property" className="btn btn-success d-flex align-items-center gap-2">
                  <Building size={20} />
                  <span className="d-none d-md-inline">List Property</span>
                </a>
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle border"
                  style={{ width: 40, height: 40, cursor: 'pointer' }}
                  onClick={() => setProfileOpen((s) => !s)}
                >
                  <User size={20} />
                </div>
                {profileOpen && (
                  <div className="position-absolute end-0 mt-2 bg-white border rounded shadow-sm" style={{ minWidth: 160, zIndex: 1060, top: '100%' }}>
                    <a href="/profile" className="d-block px-3 py-2 text-decoration-none text-dark" onClick={() => setProfileOpen(false)}>
                      Profile
                    </a>
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
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-fill overflow-auto">
          {/* Hero Section */}
          <section className="hero-section d-flex align-items-center">
            <div className="hero-pattern"></div>
            <div className="container position-relative">
              <div className="row justify-content-center">
                <div className="col-lg-10">
                  <div className="text-center text-white">
                    <h1 className="display-3 fw-bold mb-4">
                      Welcome to Habito
                    </h1>
                    <p className="fs-4 mb-5 opacity-75">
                      Your trusted partner in finding the perfect property. We make real estate simple, transparent, and accessible for everyone.
                    </p>
                    <div className="d-flex gap-3 justify-content-center flex-wrap">
                      <a href="/properties" className="btn btn-success btn-lg px-4">
                        Browse Properties
                      </a>
                      <a href="/list-property" className="btn btn-outline-light btn-lg px-4">
                        List Your Property
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-5 bg-light">
            <div className="container">
              <div className="row g-4">
                {stats.map((stat, index) => (
                  <div key={index} className="col-6 col-lg-3">
                    <div className="stat-card">
                      <stat.icon size={40} className="text-success mb-3" />
                      <div className="stat-value">{stat.value}</div>
                      <div className="text-muted">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section className="py-5">
            <div className="container">
              <div className="text-center mb-5">
                <h2 className="fw-bold mb-3">Our Services</h2>
                <p className="text-muted fs-5">
                  Whether you're buying, renting, or leasing, we've got you covered
                </p>
              </div>

              <div className="row g-4">
                {services.map((service, index) => (
                  <div key={index} className="col-md-4">
                    <div className="service-card">
                      <div 
                        className="service-icon-wrapper" 
                        style={{backgroundColor: `${service.color}15`}}
                      >
                        <service.icon size={40} style={{color: service.color}} />
                      </div>
                      <h4 className="fw-bold mb-3">{service.title}</h4>
                      <p className="text-muted">{service.description}</p>
                      <a 
                        href="/properties" 
                        className="btn btn-outline-secondary mt-3"
                      >
                        Learn More
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-5 bg-light">
            <div className="container">
              <div className="text-center mb-5">
                <h2 className="fw-bold mb-3">Why Choose Habito?</h2>
                <p className="text-muted fs-5">
                  We make property transactions simple, secure, and hassle-free
                </p>
              </div>

              <div className="row g-4">
                {features.map((feature, index) => (
                  <div key={index} className="col-md-6 col-lg-3">
                    <div className="feature-card text-center">
                      <div className="feature-icon mx-auto">
                        <feature.icon size={32} className="text-success" />
                      </div>
                      <h5 className="fw-bold mb-3">{feature.title}</h5>
                      <p className="text-muted small mb-0">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="py-5">
            <div className="container">
              <div className="text-center mb-5">
                <h2 className="fw-bold mb-3">How It Works</h2>
                <p className="text-muted fs-5">
                  Simple steps to find or list your property
                </p>
              </div>

              <div className="row g-4">
                <div className="col-md-3">
                  <div className="process-step">
                    <div className="step-number">1</div>
                    <h5 className="fw-bold mb-3">Browse Properties</h5>
                    <p className="text-muted small">
                      Explore thousands of verified properties that match your needs
                    </p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="process-step">
                    <div className="step-number">2</div>
                    <h5 className="fw-bold mb-3">Contact Owner</h5>
                    <p className="text-muted small">
                      Connect directly with property owners and schedule visits
                    </p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="process-step">
                    <div className="step-number">3</div>
                    <h5 className="fw-bold mb-3">Visit Property</h5>
                    <p className="text-muted small">
                      Inspect the property in person and make an informed decision
                    </p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="process-step">
                    <div className="step-number">4</div>
                    <h5 className="fw-bold mb-3">Close Deal</h5>
                    <p className="text-muted small">
                      Complete the paperwork and move into your new property
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="cta-section text-white">
            <div className="cta-pattern"></div>
            <div className="container position-relative">
              <div className="row justify-content-center">
                <div className="col-lg-8 text-center">
                  <h2 className="display-4 fw-bold mb-4">
                    Ready to Get Started?
                  </h2>
                  <p className="fs-5 mb-4">
                    Join thousands of property owners and buyers who trust Habito for their real estate needs
                  </p>
                  <div className="d-flex gap-3 justify-content-center flex-wrap">
                    <a href="/list-property" className="btn btn-success btn-lg px-4 d-flex align-items-center gap-2">
                      <Building size={24} />
                      List Your Property
                    </a>
                    <a href="/properties" className="btn btn-outline-light btn-lg px-4">
                      Find Properties
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-dark text-white py-5">
            <div className="container">
              <div className="row g-4">
                <div className="col-lg-4">
                  <h4 className="fw-bold mb-3">Habito</h4>
                  <p className="text-muted">
                    Your trusted partner in finding the perfect property. 
                    Making real estate transactions simple and transparent.
                  </p>
                </div>
                <div className="col-lg-2 col-md-4">
                  <h6 className="fw-bold mb-3">Quick Links</h6>
                  <ul className="list-unstyled">
                    <li className="mb-2"><a href="/properties" className="text-muted text-decoration-none">Properties</a></li>
                    <li className="mb-2"><a href="/about" className="text-muted text-decoration-none">About Us</a></li>
                    <li className="mb-2"><a href="/contact" className="text-muted text-decoration-none">Contact</a></li>
                  </ul>
                </div>
                <div className="col-lg-2 col-md-4">
                  <h6 className="fw-bold mb-3">Services</h6>
                  <ul className="list-unstyled">
                    <li className="mb-2"><a href="/buy" className="text-muted text-decoration-none">Buy</a></li>
                    <li className="mb-2"><a href="/rent" className="text-muted text-decoration-none">Rent</a></li>
                    <li className="mb-2"><a href="/lease" className="text-muted text-decoration-none">Lease</a></li>
                  </ul>
                </div>
                <div className="col-lg-4 col-md-4">
                  <h6 className="fw-bold mb-3">Contact Us</h6>
                  <p className="text-muted small">
                    Email: info@habito.com<br />
                    Phone: +91 12345 67890<br />
                    Address: Hyderabad, India
                  </p>
                </div>
              </div>
              <hr className="my-4 border-secondary" />
              <div className="text-center text-muted small">
                <p className="mb-0">© 2024 Habito. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default HomePage;