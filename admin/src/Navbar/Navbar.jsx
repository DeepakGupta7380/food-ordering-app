import React, { useContext } from "react";
import "./Navbar.css";
import { assets } from "../assets/assets";
import { StoreContext } from "../context/StoreContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const { token, admin, setAdmin, setToken } =
    useContext(StoreContext);

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");

    setToken("");
    setAdmin(false);

    toast.success("Logout Successfully");

    navigate("/");
  };

  // Login
  const goToLogin = () => {
    navigate("/");
  };

  return (
    <div className="navbar">

      {/* Logo */}
      <img
        className="logo"
        src={assets.logo}
        alt="Logo"
        onClick={() => navigate("/add")}
      />

      {/* Right Side */}
      <div className="navbar-right">

        {token && admin === true ? (
          <button
            type="button"
            className="login-condition"
            onClick={logout}
          >
            Logout
          </button>
        ) : (
          <button
            type="button"
            className="login-condition"
            onClick={goToLogin}
          >
            Login
          </button>
        )}

        {/* Profile */}
        <img
          className="profile"
          src={assets.profile_png}
          alt="Profile"
        />

      </div>
    </div>
  );
};

export default Navbar;