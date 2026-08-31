
import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import "./PlaceOrder.css";

import { StoreContext } from "../context/StoreContext";

import axios from "axios";

import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";


const PlaceOrder = () => {

  const navigate = useNavigate();


  // =====================================================
  // Store Context
  // =====================================================

  const {
    getTotalCartAmount,
    token,
    food_list,
    cartItems,
    url,
  } = useContext(StoreContext);


  // =====================================================
  // Loading State
  // =====================================================

  const [loading, setLoading] = useState(false);


  // =====================================================
  // Delivery Information
  // =====================================================

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


  // =====================================================
  // Input Change Handler
  // =====================================================

  const onChangeHandler = (event) => {

    const { name, value } = event.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

  };


  // =====================================================
  // Place Order
  // =====================================================

  const placeOrder = async (event) => {

    event.preventDefault();


    // ===================================================
    // Prevent Multiple Requests
    // ===================================================

    if (loading) {
      return;
    }


    // ===================================================
    // Check Login
    // ===================================================

    if (!token) {

      toast.error("Please Login First");

      navigate("/cart");

      return;
    }


    // ===================================================
    // Check Cart
    // ===================================================

    const subtotal = Number(
      getTotalCartAmount()
    ) || 0;


    if (subtotal <= 0) {

      toast.error("Your cart is empty");

      navigate("/cart");

      return;
    }


    // ===================================================
    // Check Food List
    // ===================================================

    if (!Array.isArray(food_list)) {

      toast.error(
        "Food list is not available. Please try again."
      );

      return;
    }


    try {

      setLoading(true);


      // =================================================
      // Create Order Items
      // =================================================

      const orderItems = [];


      Object.entries(cartItems || {}).forEach(
        ([itemId, itemQuantity]) => {

          const quantity =
            Number(itemQuantity) || 0;


          // Ignore zero quantity
          if (quantity <= 0) {
            return;
          }


          // Find food item
          const item = food_list.find(
            (food) =>
              String(food._id) ===
              String(itemId)
          );


          // Food not found
          if (!item) {

            console.warn(
              "Food item not found:",
              itemId
            );

            return;
          }


          // Add item
          orderItems.push({

            _id: item._id,

            name: item.name,

            price: Number(item.price),

            image: item.image,

            quantity: quantity,

          });

        }
      );


      // =================================================
      // Check Order Items
      // =================================================

      if (orderItems.length === 0) {

        toast.error(
          "No valid items found in your cart"
        );

        navigate("/cart");

        return;
      }


      // =================================================
      // Delivery Fee
      // =================================================

      const deliveryFee = 2;


      // =================================================
      // Total Amount
      // =================================================

      const total = Number(
        (subtotal + deliveryFee).toFixed(2)
      );


      // =================================================
      // Order Data
      // =================================================

      const orderData = {

        address: {
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          email: data.email.trim(),
          street: data.street.trim(),
          city: data.city.trim(),
          state: data.state.trim(),
          zipcode: data.zipcode.trim(),
          country: data.country.trim(),
          phone: data.phone.trim(),
        },

        items: orderItems,

        amount: total,

      };


      // =================================================
      // Debug
      // =================================================

      console.log(
        "================================="
      );

      console.log(
        "ORDER DATA:",
        orderData
      );

      console.log(
        "SUBTOTAL:",
        subtotal
      );

      console.log(
        "DELIVERY FEE:",
        deliveryFee
      );

      console.log(
        "TOTAL:",
        total
      );

      console.log(
        "ITEMS:",
        orderItems
      );

      console.log(
        "================================="
      );


      // =================================================
      // Prepare Authorization Token
      // =================================================

      const authToken =
        String(token).startsWith("Bearer ")
          ? String(token)
          : `Bearer ${token}`;


      // =================================================
      // Place Order API
      // =================================================

      const response = await axios.post(

        `${url}/api/order/place`,

        orderData,

        {
          headers: {

            Authorization: authToken,

            "Content-Type": "application/json",

          },

        }

      );


      // =================================================
      // API Response
      // =================================================

      console.log(
        "Place Order Response:",
        response.data
      );


      // =================================================
      // Check Response
      // =================================================

      if (!response.data?.success) {

        toast.error(
          response.data?.message ||
          "Unable to place order"
        );

        return;
      }


      // =================================================
      // Get Stripe Session URL
      // =================================================

      const sessionUrl =
        response.data?.session_url;


      if (!sessionUrl) {

        toast.error(
          "Payment session could not be created"
        );

        return;
      }


      // =================================================
      // Payment Redirect
      // =================================================

      toast.success(
        "Redirecting to payment..."
      );


      window.location.href =
        sessionUrl;


    } catch (error) {

      // =================================================
      // Console Error
      // =================================================

      console.error(
        "Place Order Error:",
        error.response?.data ||
        error.message ||
        error
      );


      // =================================================
      // 401 Unauthorized
      // =================================================

      if (
        error.response?.status === 401
      ) {

        toast.error(
          error.response?.data?.message ||
          "Session expired. Please login again."
        );


        // Remove old token
        localStorage.removeItem(
          "token"
        );


        navigate("/");

        return;
      }


      // =================================================
      // 400 Bad Request
      // =================================================

      if (
        error.response?.status === 400
      ) {

        toast.error(
          error.response?.data?.message ||
          "Invalid order details"
        );

        return;
      }


      // =================================================
      // 404 Not Found
      // =================================================

      if (
        error.response?.status === 404
      ) {

        toast.error(
          error.response?.data?.message ||
          "User or order data not found"
        );

        return;
      }


      // =================================================
      // 500 Server Error
      // =================================================

      if (
        error.response?.status >= 500
      ) {

        toast.error(
          error.response?.data?.message ||
          "Server error. Please try again later."
        );

        return;
      }


      // =================================================
      // Server Not Responding
      // =================================================

      if (error.request) {

        toast.error(
          "Server is not responding. Please try again."
        );

        return;
      }


      // =================================================
      // Other Error
      // =================================================

      toast.error(
        "Something went wrong. Please try again."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // Check Login & Cart
  // =====================================================

  useEffect(() => {

    if (!token) {

      navigate("/cart");

      return;
    }


    const currentTotal =
      Number(getTotalCartAmount()) || 0;


    if (currentTotal <= 0) {

      toast.error(
        "Please Add Items to Cart"
      );

      navigate("/cart");

    }

  }, [token, navigate]);


  // =====================================================
  // Cart Total
  // =====================================================

  const subtotal =
    Number(getTotalCartAmount()) || 0;


  const deliveryFee =
    subtotal > 0 ? 2 : 0;


  const total =
    subtotal > 0
      ? subtotal + deliveryFee
      : 0;


  // =====================================================
  // UI
  // =====================================================

  return (

    <form
      className="place-order"
      onSubmit={placeOrder}
    >

      {/* =================================================
          Delivery Information
      ================================================= */}

      <div className="place-order-left">

        <p className="title">
          Delivery Information
        </p>


        {/* First Name + Last Name */}

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


        {/* City + State */}

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


        {/* Zipcode + Country */}

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


      {/* =================================================
          Cart Total
      ================================================= */}

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


          {/* =================================================
              Payment Button
          ================================================= */}

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