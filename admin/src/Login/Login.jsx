import React, { useContext, useEffect, useState } from "react";
import "./Login.css";
import { toast } from "react-toastify";
import axios from "axios";
import { StoreContext } from "../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Login = ({ url }) => {
  const navigate = useNavigate();

  const { admin, setAdmin, token, setToken } = useContext(StoreContext);

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  // Input Change Handler
  const onChangeHandler = (event) => {
    const { name, value } = event.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Login Handler
  const onLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `${url}/api/user/login`,
        data
      );

      if (response.data.success) {
        // Check Admin
        if (response.data.role === "admin") {
          const loginToken = response.data.token;

          // Context State
          setToken(loginToken);
          setAdmin(true);

          // Local Storage
          localStorage.setItem("token", loginToken);
          localStorage.setItem("admin", "true");

          toast.success("Login Successfully");

          // Go to Add Food page
          navigate("/add");
        } else {
          toast.error("You are not an admin");
        }
      } else {
        toast.error(
          response.data.message || "Invalid Credentials"
        );
      }
    } catch (error) {
      console.error("Login Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Server Error. Please try again."
      );
    }
  };

  // Already logged-in admin
  useEffect(() => {
    if (admin === true && token) {
      navigate("/add");
    }
  }, [admin, token, navigate]);

  return (
    <div className="login-popup">
      <form
        onSubmit={onLogin}
        className="login-popup-container"
      >
        <div className="login-popup-title">
          <h2>Admin Login</h2>
        </div>

        <div className="login-popup-inputs">
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Enter admin email"
            autoComplete="email"
            required
          />

          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Enter password"
            autoComplete="current-password"
            required
          />
        </div>

        <button type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;