

import React, { useContext, useState } from "react";
import "./LoginPopup.css";

import { assets } from "../assets/frontend_assets/assets";
import { StoreContext } from "../context/StoreContext";

import axios from "axios";
import { toast } from "react-toastify";

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken, loadCartData } = useContext(StoreContext);

  const [currentState, setCurrentState] = useState("Login");
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // ===============================
  // Input Change
  // ===============================
  const onChangeHandler = (event) => {
    const { name, value } = event.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===============================
  // Login / Register
  // ===============================
  const onLogin = async (event) => {
    event.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      const endpoint =
        currentState === "Login"
          ? "/api/user/login"
          : "/api/user/register";

      const response = await axios.post(
        `${url}${endpoint}`,
        data
      );

      console.log("Login Response:", response.data);

      if (!response.data.success) {
        toast.error(
          response.data.message || "Authentication failed"
        );
        return;
      }

      // ===============================
      // Get JWT Token
      // ===============================
      const newToken = response.data.token;

      if (!newToken) {
        toast.error("Token not received from server");
        return;
      }

      // ===============================
      // Save Token
      // ===============================
      localStorage.setItem("token", newToken);

      // Save role
      if (response.data.role) {
        localStorage.setItem(
          "role",
          response.data.role
        );
      }

      // Update Context
      setToken(newToken);

      // ===============================
      // Load User Cart
      // ===============================
      try {
        await loadCartData(newToken);
      } catch (cartError) {
        console.error(
          "Cart Load Error:",
          cartError
        );
      }

      // ===============================
      // Success Message
      // ===============================
      toast.success(
        currentState === "Login"
          ? "Login Successfully"
          : "Account Created Successfully"
      );

      // Close popup
      setShowLogin(false);

      // Reset form
      setData({
        name: "",
        email: "",
        password: "",
      });

    } catch (error) {
      console.error(
        "Authentication Error:",
        error
      );

      const message =
        error.response?.data?.message;

      if (message) {
        toast.error(message);
      } else if (error.request) {
        toast.error(
          "Server is not responding. Please check your backend."
        );
      } else {
        toast.error(
          "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // Switch Login / Sign Up
  // ===============================
  const switchState = () => {
    setCurrentState((prev) =>
      prev === "Login"
        ? "Sign Up"
        : "Login"
    );

    setData({
      name: "",
      email: "",
      password: "",
    });
  };

  return (
    <div className="login-popup">

      <form
        onSubmit={onLogin}
        className="login-popup-container"
      >

        {/* Title */}
        <div className="login-popup-title">

          <h2>{currentState}</h2>

          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="Close"
            title="Close"
          />

        </div>

        {/* Inputs */}
        <div className="login-popup-inputs">

          {currentState === "Sign Up" && (
            <input
              name="name"
              type="text"
              placeholder="Your name"
              value={data.name}
              onChange={onChangeHandler}
              autoComplete="name"
              required
            />
          )}

          <input
            name="email"
            type="email"
            placeholder="Your email"
            value={data.email}
            onChange={onChangeHandler}
            autoComplete="email"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Your password"
            value={data.password}
            onChange={onChangeHandler}
            autoComplete={
              currentState === "Login"
                ? "current-password"
                : "new-password"
            }
            minLength={6}
            required
          />

        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Please wait..."
            : currentState === "Login"
            ? "Login"
            : "Create Account"}
        </button>

        {/* Terms */}
        <div className="login-popup-condition">

          <input
            type="checkbox"
            required
          />

          <p>
            By continuing, I agree to the
            terms of use & privacy policy.
          </p>

        </div>

        {/* Switch */}
        {currentState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={switchState}>
              Click here
            </span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={switchState}>
              Login here
            </span>
          </p>
        )}

      </form>

    </div>
  );
};

export default LoginPopup;