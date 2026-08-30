import React, { useContext } from "react";
import Navbar from "./Navbar/Navbar";
import Sidebar from "./Sidebar/Sidebar";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";

import Add from "./Add/Add";
import List from "./List/List";
import Orders from "./Orders/Orders";
import Login from "./Login/Login";

import { StoreContext } from "./context/StoreContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const { token, admin } = useContext(StoreContext);

  const url ="https://food-ordering-app-dqtz.onrender.com";

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />

      <Navbar />

      <hr />

      <AppContent
        url={url}
        token={token}
        admin={admin}
      />
    </>
  );
};

/* =========================
   App Content
========================= */

const AppContent = ({ url, token, admin }) => {
  const location = useLocation();

  const isLoginPage = location.pathname === "/";

  return (
    <div className="app-content">

      
      {!isLoginPage && token && admin && <Sidebar />}

      <Routes>

        {/* Login */}
        <Route
          path="/"
          element={
            token && admin ? (
              <Navigate to="/add" replace />
            ) : (
              <Login url={url} />
            )
          }
        />

        {/* Add Food */}
        <Route
          path="/add"
          element={
            token && admin ? (
              <Add url={url} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Food List */}
        <Route
          path="/list"
          element={
            token && admin ? (
              <List url={url} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Orders */}
        <Route
          path="/orders"
          element={
            token && admin ? (
              <Orders url={url} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Unknown URL */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </div>
  );
};

export default App;