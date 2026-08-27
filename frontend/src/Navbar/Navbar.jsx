import React, { useContext, useState } from "react";
import "./Navbar.css";

import { assets } from "../assets/frontend_assets/assets";

import { Link, useNavigate } from "react-router-dom";

import { StoreContext } from "../context/StoreContext";

import { toast } from "react-toastify";


const Navbar = ({ setShowLogin }) => {

  const [menu, setMenu] = useState("home");

  const {
    getTotalCartAmount,
    token,
    setToken,
  } = useContext(StoreContext);

  const navigate = useNavigate();


  // ===============================
  // Logout
  // ===============================

  const logout = () => {

    localStorage.removeItem("token");

    setToken("");

    toast.success("Logout Successfully");

    navigate("/");

  };


  // ===============================
  // Navigate Orders
  // ===============================

  const handleOrders = () => {

    setMenu("");

    navigate("/myorders");

  };


  return (
    <div className="navbar">


      {/* ===============================
          Logo
      =============================== */}

      <Link
        to="/"
        onClick={() => setMenu("home")}
      >

        <img
          src={assets.logo}
          alt="Tomato Logo"
          className="logo"
        />

      </Link>


      {/* ===============================
          Navbar Menu
      =============================== */}

      <ul className="navbar-menu">

        <Link
          to="/"
          onClick={() => setMenu("home")}
          className={menu === "home" ? "active" : ""}
        >
          home
        </Link>


        <a
          href="/#explore-menu"
          onClick={() => setMenu("menu")}
          className={menu === "menu" ? "active" : ""}
        >
          menu
        </a>


        <a
          href="/#app-download"
          onClick={() => setMenu("mobile-app")}
          className={
            menu === "mobile-app"
              ? "active"
              : ""
          }
        >
          mobile-app
        </a>


        <a
          href="/#footer"
          onClick={() => setMenu("contact-us")}
          className={
            menu === "contact-us"
              ? "active"
              : ""
          }
        >
          contact us
        </a>

      </ul>


      {/* ===============================
          Right Side
      =============================== */}

      <div className="navbar-right">


        {/* Search */}

        <button
          type="button"
          className="navbar-search-btn"
          aria-label="Search"
        >

          <img
            src={assets.search_icon}
            alt="Search"
          />

        </button>


        {/* Cart */}

        <div className="navbar-search-icon">

          <Link to="/cart">

            <img
              src={assets.basket_icon}
              alt="Cart"
            />

          </Link>


          {getTotalCartAmount() > 0 && (
            <div className="dot"></div>
          )}

        </div>


        {/* ===============================
            Login / Profile
        =============================== */}

        {!token ? (

          <button
            type="button"
            onClick={() => setShowLogin(true)}
          >
            sign in
          </button>

        ) : (

          <div className="navbar-profile">


            {/* Profile Icon */}

            <img
              src={assets.profile_icon}
              alt="Profile"
            />


            {/* Profile Dropdown */}

            <ul className="nav-profile-dropdown">


              {/* Orders */}

              <li onClick={handleOrders}>

                <img
                  src={assets.bag_icon}
                  alt="Orders"
                />

                <p>
                  Orders
                </p>

              </li>


              <hr />


              {/* Logout */}

              <li onClick={logout}>

                <img
                  src={assets.logout_icon}
                  alt="Logout"
                />

                <p>
                  Logout
                </p>

              </li>


            </ul>

          </div>

        )}

      </div>

    </div>
  );
};


export default Navbar;