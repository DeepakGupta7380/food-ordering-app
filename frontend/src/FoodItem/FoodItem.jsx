
import React, { useContext } from "react";
import "./FoodItem.css";

import { assets } from "../assets/frontend_assets/assets";
import { StoreContext } from "../context/StoreContext";

const FoodItem = ({
  id,
  name,
  price,
  description,
  image,
}) => {

  const {
    cartItems,
    addToCart,
    removeFromCart,
    url,
    token,
  } = useContext(StoreContext);


  // ===============================
  // Get User ID from JWT Token
  // ===============================
  const getUserIdFromToken = () => {

    try {

      if (!token) {
        return null;
      }

      const tokenParts = token.split(".");

      if (tokenParts.length !== 3) {
        return null;
      }

      const payload = JSON.parse(
        atob(tokenParts[1])
      );

      return payload.id || payload.userId || null;

    } catch (error) {

      console.log(
        "User ID decode error:",
        error.message
      );

      return null;
    }
  };


  // ===============================
  // Current Quantity
  // ===============================
  const quantity = cartItems?.[id] || 0;


  // ===============================
  // Add Item
  // ===============================
  const handleAddToCart = () => {

    const userId = getUserIdFromToken();

    addToCart(userId, id);
  };


  // ===============================
  // Remove Item
  // ===============================
  const handleRemoveFromCart = () => {

    if (quantity <= 0) {
      return;
    }

    const userId = getUserIdFromToken();

    removeFromCart(userId, id);
  };


  return (
    <div className="food-item">

      {/* ===============================
          Food Image
      =============================== */}
      <div className="food-item-img-container">

        <img
          src={`${url}/images/${image}`}
          alt={name}
          className="food-item-image"

          onError={(e) => {
            e.target.style.display = "none";
          }}
        />


        {/* ===============================
            Add Button
        =============================== */}
        {quantity === 0 ? (

          <img
            className="add"
            onClick={handleAddToCart}
            src={assets.add_icon_white}
            alt="Add to cart"
            title="Add to cart"
          />

        ) : (

          /* ===============================
             Quantity Counter
          =============================== */
          <div className="food-item-counter">

            {/* Remove */}
            <img
              onClick={handleRemoveFromCart}
              src={assets.remove_icon_red}
              alt="Remove from cart"
              title="Remove item"
            />


            {/* Quantity */}
            <p>
              {quantity}
            </p>


            {/* Add */}
            <img
              onClick={handleAddToCart}
              src={assets.add_icon_green}
              alt="Add to cart"
              title="Add item"
            />

          </div>

        )}

      </div>


      {/* ===============================
          Food Information
      =============================== */}
      <div className="food-item-info">

        <div className="food-item-name-rating">

          <p>
            {name}
          </p>

          <img
            src={assets.rating_starts}
            alt="Food rating"
          />

        </div>


        {/* Description */}
        <p className="food-item-desc">
          {description}
        </p>


        {/* Price */}
        <p className="food-item-price">
          ${Number(price).toFixed(2)}
        </p>

      </div>

    </div>
  );
};


export default FoodItem;