import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    food_list,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  // ===============================
  // Cart Total
  // ===============================
  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : 2;
  const total = subtotal === 0 ? 0 : subtotal + deliveryFee;

  // ===============================
  // Checkout
  // ===============================
  const handleCheckout = () => {
    if (subtotal === 0) {
      alert("Your cart is empty");
      return;
    }

    navigate("/order");
  };

  return (
    <div className="cart">

      {/* ===============================
          Cart Items
      =============================== */}
      <div className="cart-items">

        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>

        <br />
        <hr />

        {food_list.map((item) => {
          const quantity = cartItems[item._id] || 0;

          if (quantity <= 0) {
            return null;
          }

          return (
            <div key={item._id}>
              <div className="cart-items-title cart-items-item">

                {/* Food Image */}
                <img
                  src={`${url}/images/${item.image}`}
                  alt={item.name}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />

                {/* Food Name */}
                <p>{item.name}</p>

                {/* Price */}
                <p>${Number(item.price).toFixed(2)}</p>

                {/* Quantity */}
                <p>{quantity}</p>

                {/* Item Total */}
                <p>
                  ${(Number(item.price) * quantity).toFixed(2)}
                </p>

                {/* Remove */}
                <p
                  onClick={() => removeFromCart(item._id)}
                  className="cross"
                  title="Remove item"
                >
                  ×
                </p>
              </div>

              <hr />
            </div>
          );
        })}

        {/* Empty Cart */}
        {subtotal === 0 && (
          <p className="empty-cart">
            Your cart is empty
          </p>
        )}
      </div>

      {/* ===============================
          Cart Bottom
      =============================== */}
      <div className="cart-bottom">

        {/* Cart Total */}
        <div className="cart-total">

          <h2>Cart Totals</h2>

          <div>

            {/* Subtotal */}
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${subtotal.toFixed(2)}</p>
            </div>

            <hr />

            {/* Delivery Fee */}
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${deliveryFee.toFixed(2)}</p>
            </div>

            <hr />

            {/* Total */}
            <div className="cart-total-details">
              <b>Total</b>
              <b>${total.toFixed(2)}</b>
            </div>

          </div>

          <button
            onClick={handleCheckout}
            disabled={subtotal === 0}
          >
            PROCEED TO CHECKOUT
          </button>

        </div>

        {/* ===============================
            Promo Code
        =============================== */}
        <div className="cart-promocode">

          <div>
            <p>
              If you have a promo code, enter it here
            </p>

            <div className="cart-promocode-input">
              <input
                type="text"
                placeholder="Promo code"
              />

              <button type="button">
                Submit
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Cart;