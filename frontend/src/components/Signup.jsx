import React, { useState } from "react";
import Image from "../assets/image.png";
import Logo from "../assets/logo.png";
import GoogleSvg from "../assets/icons8-google.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState("");

  const handleSignup = async () => {
    try {
      const response = await axios.post("https://habito-rzwt.onrender.com/auth/register", {
        name,
        email,
        password,
        role,
      });
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
      }
      setModalText("Signup successful!");
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate("/properties");
      }, 1000);
    } catch (error) {
      console.error("Signup failed:", error);
      const msg = error?.response?.data?.message || "Unable to register. Please try again.";
      alert(msg);
    }
  };

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
            <h2>Create your account</h2>
            <p>Please enter your details</p>
            <form>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {showPassword ? (
                  <FaEyeSlash onClick={() => setShowPassword(!showPassword)} />
                ) : (
                  <FaEye onClick={() => setShowPassword(!showPassword)} />
                )}
              </div>

              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="user">User</option>
              </select>

              <div className="login-center-buttons">
                <button type="button" onClick={handleSignup}>Sign Up</button>
                <button type="button" onClick={() => { window.location.href = "https://habito-rzwt.onrender.com/auth/google"; }}>
                  <img src={GoogleSvg} alt="" />
                  Sign Up with Google
                </button>
              </div>
            </form>
          </div>

          <p className="login-bottom-p">
            Already have an account? <a href="/login">Log In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
