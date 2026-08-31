
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
    token,
  } = useContext(StoreContext);

  const navigate = useNavigate();


  // ===============================
  // Cart Total
  // ===============================

  const subtotal = getTotalCartAmount();

  const deliveryFee =
    subtotal === 0 ? 0 : 2;

  const total =
    subtotal === 0
      ? 0
      : subtotal + deliveryFee;


  // ===============================
  // Get User ID From Token
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

      return (
        payload.id ||
        payload.userId ||
        null
      );

    } catch (error) {

      console.log(
        "User ID decode error:",
        error.message
      );

      return null;
    }
  };


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


  // ===============================
  // Get Cart Items
  // ===============================

  const cartItemIds = Object.keys(cartItems || {}).filter(
    (itemId) => Number(cartItems[itemId]) > 0
  );


  return (
    <div className="cart">

      {/* ===============================
          Cart Items
      =============================== */}

      <div className="cart-items">

        {/* Cart Header */}

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


        {/* ===============================
            Cart Products
        =============================== */}

        {cartItemIds.length > 0 ? (

          cartItemIds.map((itemId) => {

            // Find food according to cart item ID

            const item = food_list.find(
              (product) =>
                String(product._id) === String(itemId)
            );


            // If food is not found

            if (!item) {
              return null;
            }


            // Quantity

            const quantity =
              Number(cartItems[itemId]) || 0;


            // Item total

            const itemTotal =
              Number(item.price) * quantity;


            return (

              <div
                key={itemId}
                className="cart-item-row"
              >

                <div className="cart-items-title cart-items-item">

                  {/* ===============================
                      Food Image
                  =============================== */}

                  <img
                    src={`${url}/images/${item.image}`}
                    alt={item.name}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />


                  {/* ===============================
                      Food Name
                  =============================== */}

                  <p>
                    {item.name}
                  </p>


                  {/* ===============================
                      Price
                  =============================== */}

                  <p>
                    ${Number(item.price).toFixed(2)}
                  </p>


                  {/* ===============================
                      Quantity
                  =============================== */}

                  <p>
                    {quantity}
                  </p>


                  {/* ===============================
                      Item Total
                  =============================== */}

                  <p>
                    ${itemTotal.toFixed(2)}
                  </p>


                  {/* ===============================
                      Remove
                  =============================== */}

                  <p
                    className="cross"
                    title="Remove item"
                    onClick={() => {

                      const userId =
                        getUserIdFromToken();

                      removeFromCart(
                        userId,
                        itemId
                      );

                    }}
                  >
                    ×
                  </p>

                </div>


                <hr />

              </div>

            );
          })

        ) : (

          /* ===============================
              Empty Cart
          =============================== */

          <p className="empty-cart">
            Your cart is empty
          </p>

        )}

      </div>


      {/* ===============================
          Cart Bottom
      =============================== */}

      <div className="cart-bottom">


        {/* ===============================
            Cart Total
        =============================== */}

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


          {/* Checkout Button */}

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