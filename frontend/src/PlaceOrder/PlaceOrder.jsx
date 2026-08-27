import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";

import { StoreContext } from "../context/StoreContext";

import axios from "axios";

import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";


const PlaceOrder = () => {
  const navigate = useNavigate();

  const {
    getTotalCartAmount,
    token,
    food_list,
    cartItems,
    url,
  } = useContext(StoreContext);


  // ===============================
  // Loading State
  // ===============================

  const [loading, setLoading] = useState(false);


  // ===============================
  // Delivery Information
  // ===============================

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });


  // ===============================
  // Input Change Handler
  // ===============================

  const onChangeHandler = (event) => {
    const { name, value } = event.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  // ===============================
  // Place Order
  // ===============================

  const placeOrder = async (event) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    // Check Login
    if (!token) {
      toast.error("Please Login First");
      navigate("/cart");
      return;
    }


    // Calculate Total
    const subtotal = getTotalCartAmount();


    // Check Cart
    if (subtotal <= 0) {
      toast.error("Please Add Items to Cart");
      navigate("/cart");
      return;
    }


    try {
      setLoading(true);


      // ===============================
      // Create Order Items
      // ===============================

      const orderItems = [];

      food_list.forEach((item) => {
        if (cartItems[item._id] > 0) {

          orderItems.push({
            ...item,
            quantity: cartItems[item._id],
          });

        }
      });


      // Check Order Items
      if (orderItems.length === 0) {
        toast.error("Your cart is empty");
        navigate("/cart");
        return;
      }


      // ===============================
      // Order Data
      // ===============================

      const orderData = {
        address: data,

        items: orderItems,

        amount: subtotal + 2,
      };


      // ===============================
      // API Request
      // ===============================

      const response = await axios.post(
        `${url}/api/order/place`,
        orderData,
        {
          headers: {
            token: token,
          },
        }
      );


      // ===============================
      // Success
      // ===============================

      if (response.data.success) {

        const { session_url } = response.data;


        if (!session_url) {
          toast.error(
            "Payment session could not be created"
          );

          return;
        }


        toast.success(
          "Redirecting to payment..."
        );


        // Redirect to Stripe
        window.location.replace(session_url);

      } else {

        toast.error(
          response.data.message ||
            "Unable to place order"
        );

      }

    } catch (error) {

      console.error(
        "Place Order Error:",
        error
      );


      if (error.response) {

        toast.error(
          error.response.data?.message ||
            "Unable to place order"
        );

      } else if (error.request) {

        toast.error(
          "Server is not responding. Please try again."
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
  // Check User & Cart
  // ===============================

  useEffect(() => {

    if (!token) {

      toast.error("Please Login First");

      navigate("/cart");

      return;
    }


    if (getTotalCartAmount() === 0) {

      toast.error("Please Add Items to Cart");

      navigate("/cart");

    }

  }, [token]);


  // ===============================
  // Total Amount
  // ===============================

  const subtotal = getTotalCartAmount();

  const deliveryFee = subtotal === 0 ? 0 : 2;

  const total = subtotal === 0
    ? 0
    : subtotal + deliveryFee;


  // ===============================
  // UI
  // ===============================

  return (
    <form
      className="place-order"
      onSubmit={placeOrder}
    >

      {/* =================================
          Delivery Information
      ================================= */}

      <div className="place-order-left">

        <p className="title">
          Delivery Information
        </p>


        {/* First & Last Name */}

        <div className="multi-fields">

          <input
            required
            name="firstName"
            value={data.firstName}
            onChange={onChangeHandler}
            type="text"
            placeholder="First name"
            autoComplete="given-name"
          />

          <input
            required
            name="lastName"
            value={data.lastName}
            onChange={onChangeHandler}
            type="text"
            placeholder="Last name"
            autoComplete="family-name"
          />

        </div>


        {/* Email */}

        <input
          required
          name="email"
          value={data.email}
          onChange={onChangeHandler}
          type="email"
          placeholder="Email Address"
          autoComplete="email"
        />


        {/* Street */}

        <input
          required
          name="street"
          value={data.street}
          onChange={onChangeHandler}
          type="text"
          placeholder="Street"
          autoComplete="street-address"
        />


        {/* City & State */}

        <div className="multi-fields">

          <input
            required
            name="city"
            value={data.city}
            onChange={onChangeHandler}
            type="text"
            placeholder="City"
            autoComplete="address-level2"
          />

          <input
            required
            name="state"
            value={data.state}
            onChange={onChangeHandler}
            type="text"
            placeholder="State"
            autoComplete="address-level1"
          />

        </div>


        {/* Zip & Country */}

        <div className="multi-fields">

          <input
            required
            name="zipcode"
            value={data.zipcode}
            onChange={onChangeHandler}
            type="text"
            inputMode="numeric"
            placeholder="Zip Code"
            autoComplete="postal-code"
          />

          <input
            required
            name="country"
            value={data.country}
            onChange={onChangeHandler}
            type="text"
            placeholder="Country"
            autoComplete="country-name"
          />

        </div>


        {/* Phone */}

        <input
          required
          name="phone"
          value={data.phone}
          onChange={onChangeHandler}
          type="tel"
          inputMode="tel"
          placeholder="Phone"
          autoComplete="tel"
        />

      </div>


      {/* =================================
          Cart Total
      ================================= */}

      <div className="place-order-right">

        <div className="cart-total">

          <h2>
            Cart Totals
          </h2>


          <div>

            {/* Subtotal */}

            <div className="cart-total-details">

              <p>
                Subtotal
              </p>

              <p>
                ${subtotal.toFixed(2)}
              </p>

            </div>


            <hr />


            {/* Delivery Fee */}

            <div className="cart-total-details">

              <p>
                Delivery Fee
              </p>

              <p>
                ${deliveryFee.toFixed(2)}
              </p>

            </div>


            <hr />


            {/* Total */}

            <div className="cart-total-details">

              <b>
                Total
              </b>

              <b>
                ${total.toFixed(2)}
              </b>

            </div>

          </div>


          {/* Payment Button */}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "PROCESSING..."
              : "PROCEED TO PAYMENT"}
          </button>

        </div>

      </div>

    </form>
  );
};


export default PlaceOrder;