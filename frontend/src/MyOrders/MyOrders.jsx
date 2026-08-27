import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";

import { StoreContext } from "../context/StoreContext";
import axios from "axios";
import { assets } from "../assets/frontend_assets/assets";
import { toast } from "react-toastify";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // ===============================
  // Fetch User Orders
  // ===============================
  const fetchOrders = async () => {
    if (!token) return;

    try {
      setLoading(true);

      const response = await axios.post(
        `${url}/api/order/userorders`,
        {},
        {
          headers: {
            token: token,
          },
        }
      );

      if (response.data.success) {
        setData(response.data.data || []);
      } else {
        toast.error(
          response.data.message || "Unable to fetch orders"
        );
      }
    } catch (error) {
      console.error("Fetch Orders Error:", error);

      if (error.response) {
        toast.error(
          error.response.data?.message ||
            "Unable to fetch orders"
        );
      } else if (error.request) {
        toast.error(
          "Server is not responding. Please try again."
        );
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // Fetch Orders When Token Changes
  // ===============================
  useEffect(() => {
    if (token) {
      fetchOrders();
    } else {
      setData([]);
    }
  }, [token]);

  // ===============================
  // Loading
  // ===============================
  if (loading) {
    return (
      <div className="my-orders">
        <h2>Orders</h2>

        <div className="my-orders-loading">
          Loading your orders...
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders">

      {/* ===============================
          Heading
      =============================== */}

      <h2>Orders</h2>

      <div className="container">

        {/* ===============================
            Not Logged In
        =============================== */}

        {!token && (
          <div className="my-orders-empty">
            <p>Please login to view your orders.</p>
          </div>
        )}

        {/* ===============================
            No Orders
        =============================== */}

        {token && data.length === 0 && (
          <div className="my-orders-empty">
            <p>You haven't placed any orders yet.</p>
          </div>
        )}

        {/* ===============================
            Orders
        =============================== */}

        {data.map((order) => {

          const orderItems = order.items || [];

          return (
            <div
              key={order._id}
              className="my-orders-order"
            >

              {/* Parcel Icon */}
              <img
                src={assets.parcel_icon}
                alt="Order"
              />

              {/* ===============================
                  Items
              =============================== */}

              <div className="my-orders-items">
                {orderItems.map((item, index) => (
                  <span key={index}>
                    {item.name} x {item.quantity}
                    {index < orderItems.length - 1
                      ? ", "
                      : ""}
                  </span>
                ))}
              </div>

              {/* ===============================
                  Amount
              =============================== */}

              <p>
                ${Number(order.amount || 0).toFixed(2)}
              </p>

              {/* ===============================
                  Total Items
              =============================== */}

              <p>
                Items: {orderItems.length}
              </p>

              {/* ===============================
                  Status
              =============================== */}

              <p className="my-orders-status">
                <span className="status-dot">
                  &#x25cf;
                </span>

                <b>{order.status}</b>
              </p>

              {/* ===============================
                  Track Order
              =============================== */}

              <button
                type="button"
                onClick={fetchOrders}
                disabled={loading}
              >
                {loading
                  ? "Loading..."
                  : "Track Order"}
              </button>

            </div>
          );
        })}

      </div>
    </div>
  );
};

export default MyOrders;