import React, { useContext, useState } from "react";
import "./LoginPopup.css";

import { assets } from "../assets/frontend_assets/assets";
import { StoreContext } from "../context/StoreContext";

import axios from "axios";
import { toast } from "react-toastify";

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);

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

    setData((prevData) => ({
      ...prevData,
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

      if (response.data.success) {
        // Save JWT token
        const token = response.data.token;

        setToken(token);

        localStorage.setItem("token", token);

        // Save role if backend sends it
        if (response.data.role) {
          localStorage.setItem(
            "role",
            response.data.role
          );
        }

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
      } else {
        toast.error(
          response.data.message || "Something went wrong"
        );
      }
    } catch (error) {
      console.error("Authentication Error:", error);

      if (error.response) {
        toast.error(
          error.response.data?.message ||
            "Server Error. Please try again."
        );
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
    setCurrentState((prevState) =>
      prevState === "Login"
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

        {/* ===============================
            Title
        =============================== */}

        <div className="login-popup-title">
          <h2>{currentState}</h2>

          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="Close"
            title="Close"
          />
        </div>

        {/* ===============================
            Inputs
        =============================== */}

        <div className="login-popup-inputs">

          {currentState === "Sign Up" && (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Your name"
              autoComplete="name"
              required
            />
          )}

          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Your email"
            autoComplete="email"
            required
          />

          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Your password"
            autoComplete={
              currentState === "Login"
                ? "current-password"
                : "new-password"
            }
            minLength="8"
            required
          />

        </div>

        {/* ===============================
            Submit Button
        =============================== */}

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Please wait..."
            : currentState === "Sign Up"
            ? "Create Account"
            : "Login"}
        </button>

        {/* ===============================
            Terms & Conditions
        =============================== */}

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

        {/* ===============================
            Switch Login / Sign Up
        =============================== */}

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