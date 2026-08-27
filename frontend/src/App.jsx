import React, { useState } from "react";

import {
  Route,
  Routes,
} from "react-router-dom";

import Navbar from "./Navbar/Navbar";
import Home from "./Home/Home";
import Cart from "./Cart/Cart";
import PlaceOrder from "./PlaceOrder/PlaceOrder";
import Verify from "./Verify/Verify";
import MyOrders from "./MyOrders/MyOrders";
import Footer from "./Footer/Footer";
import LoginPopup from "./LoginPopup/LoginPopup";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const App = () => {

  // ===============================
  // Login Popup State
  // ===============================

  const [showLogin, setShowLogin] = useState(false);


  return (
    <>
      {/* =================================
          Login Popup
      ================================= */}

      {showLogin && (
        <LoginPopup
          setShowLogin={setShowLogin}
        />
      )}


      {/* =================================
          Main Application
      ================================= */}

      <div className="app">

        {/* Toast Messages */}

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
        />


        {/* Navbar */}

        <Navbar
          setShowLogin={setShowLogin}
        />


        {/* =================================
            Application Routes
        ================================= */}

        <Routes>

          {/* Home */}

          <Route
            path="/"
            element={<Home />}
          />


          {/* Cart */}

          <Route
            path="/cart"
            element={<Cart />}
          />


          {/* Place Order */}

          <Route
            path="/order"
            element={<PlaceOrder />}
          />


          {/* Payment Verification */}

          <Route
            path="/verify"
            element={<Verify />}
          />


          {/* My Orders */}

          <Route
            path="/myorders"
            element={<MyOrders />}
          />

        </Routes>

      </div>


      {/* =================================
          Footer
      ================================= */}

      <Footer />

    </>
  );
};


export default App;