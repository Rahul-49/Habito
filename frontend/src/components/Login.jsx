import React, { useEffect, useState, useContext } from "react";
import Image from "../assets/image.png";
import Logo from "../assets/logo.png";
import GoogleSvg from "../assets/icons8-google.svg";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const [ showPassword, setShowPassword ] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState("");
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e?.preventDefault();
    try {
      const response = await axios.post("https://habito-rzwt.onrender.com/auth/login", {
        email,
        password,
        role
      });
      
      const { _id, name, email: resEmail, role: resRole, token, flag } = response.data || {};
      if (token) {
        const userData = { _id, name, email: resEmail, role: resRole };
        login(userData, token);

        if (flag) {
          setModalText("Login successful!");
          setShowModal(true);
          setTimeout(() => {
            setShowModal(false);
            navigate(resRole === "admin" ? "/admin" : "/properties");
          }, 1000);
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid login credentials.");
    }
  };

  const parseJwt = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      // Ensure AuthContext marks user as authenticated for ProtectedRoute
      try {
        const payload = parseJwt(token);
        const roleFromToken = payload?.role;
        const idFromToken = payload?.id;
        const userData = { _id: idFromToken, name: "", email: "", role: roleFromToken };
        login(userData, token);
      } catch {}
      setModalText("Login successful via Google!");
      setShowModal(true);
      params.delete("token");
      const newQuery = params.toString();
      const newUrl = window.location.pathname + (newQuery ? `?${newQuery}` : "");
      window.history.replaceState({}, "", newUrl);
      setTimeout(() => {
        setShowModal(false);
        const payload = parseJwt(token);
        const roleFromToken = payload?.role;
        navigate(roleFromToken === "admin" ? "/admin" : "/properties");
      }, 1000);
    }
  }, [navigate]);


  return (
    <div className="login-main">
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", padding: "20px 24px", borderRadius: 8, minWidth: 280, textAlign: "center", boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }}>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Successful</div>
            <div style={{ color: "#444" }}>{modalText}</div>
          </div>
        </div>
      )}
      <div className="login-left">
        <img src={Image} alt="" />
      </div>
      <div className="login-right">
        <div className="login-right-container">
          <div className="login-logo">
            <img src={Logo} alt="" />
          </div>
          <div className="login-center">
            <h2>Welcome back!</h2>
            <p>Please enter your details</p>
            <form>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <div className="pass-input-div">
                <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                {showPassword ? <FaEyeSlash onClick={() => {setShowPassword(!showPassword)}} /> : <FaEye onClick={() => {setShowPassword(!showPassword)}} />}
                
              </div>

              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="user">User</option>
              </select>

              <div className="login-center-options">
                <div className="remember-div">
                  <input type="checkbox" id="remember-checkbox" />
                  <label htmlFor="remember-checkbox">
                    Remember for 30 days
                  </label>
                </div>
                <a href="#" className="forgot-pass-link">
                  Forgot password?
                </a>
              </div>
              <div className="login-center-buttons">
                <button type="button" onClick={handleLogin}>Log In</button>
                <button type="button" onClick={() => { window.location.href = "https://habito-rzwt.onrender.com/auth/google"; }}>
                  <img src={GoogleSvg} alt="" />
                  Log In with Google
                </button>
              </div>
            </form>
          </div>

          <p className="login-bottom-p">
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
