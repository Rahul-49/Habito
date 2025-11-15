import { useState, useContext } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import PropertiesPage from "./components/PropertiesPage.jsx";
import ListPropertyPage from "./components/ListPropertyPage.jsx";
import Profile from "./components/Profile.jsx";
import Favourites from "./components/Favourites.jsx";
import Details from "./components/Details.jsx";
import HomePage from "./components/HomePage.jsx";
import AdminPanel from "./components/AdminPanel.jsx";
import AdminIssues from "./components/AdminIssues.jsx";
import MyIssues from "./components/MyIssues.jsx";
import { AuthContext } from "./context/AuthContext";


function App() {
  const [count, setCount] = useState(0);
  const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
  };

  const AdminRoute = ({ children }) => {
    const { isAuthenticated, user } = useContext(AuthContext);
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (user?.role !== "admin") return <Navigate to="/properties" replace />;
    return children;
  };

  return (
    <Router>
      <div>
        
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/properties" element={<ProtectedRoute><PropertiesPage /></ProtectedRoute>} />
        <Route path="/list-property" element={<ProtectedRoute><ListPropertyPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/favourites" element={<ProtectedRoute><Favourites /></ProtectedRoute>} />
        <Route path="/details" element={<ProtectedRoute><Details /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
        <Route path="/admin/issues" element={<AdminRoute><AdminIssues /></AdminRoute>} />
        <Route path="/my-issues" element={<ProtectedRoute><MyIssues /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
