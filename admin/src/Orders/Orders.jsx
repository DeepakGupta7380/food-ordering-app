import React, { useContext, useEffect, useState } from "react";
import "./Orders.css";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { StoreContext } from "../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Orders = ({ url }) => {
  const navigate = useNavigate();

  const { token, admin } = useContext(StoreContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch All Orders
  const fetchAllOrder = async () => {
    if (!token || admin !== true) {
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(
        `${url}/api/order/list`,
        {
          headers: {
            token,
          },
        }
      );

      if (response.data.success) {
        setOrders(response.data.data || []);
      } else {
        toast.error(
          response.data.message || "Unable to fetch orders"
        );
      }
    } catch (error) {
      console.error("Fetch Orders Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Server Error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Update Order Status
  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;

    try {
      const response = await axios.post(
        `${url}/api/order/status`,
        {
          orderId,
          status: newStatus,
        },
        {
          headers: {
            token,
          },
        }
      );

      if (response.data.success) {
        toast.success(
          response.data.message || "Status Updated Successfully"
        );

        await fetchAllOrder();
      } else {
        toast.error(
          response.data.message || "Unable to update status"
        );
      }
    } catch (error) {
      console.error("Status Update Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Server Error. Please try again."
      );
    }
  };

  // Check Admin Authentication
  useEffect(() => {
    if (!token || admin !== true) {
      toast.error("Please Login as Admin");

      navigate("/");
      return;
    }

    fetchAllOrder();
  }, [token, admin]);

  return (
    <div className="order add">
      <h3>Order Page</h3>

      {loading ? (
        <p className="order-loading">
          Loading Orders...
        </p>
      ) : orders.length === 0 ? (
        <p className="order-empty">
          No Orders Found
        </p>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div
              key={order._id}
              className="order-item"
            >
              {/* Parcel Icon */}
              <img
                src={assets.parcel_icon}
                alt="Order"
              />

              {/* Order Information */}
              <div className="order-item-details">

                {/* Food Items */}
                <p className="order-item-food">
                  {order.items?.map((item, index) => (
                    <span key={index}>
                      {item.name} x {item.quantity}
                      {index !== order.items.length - 1
                        ? ", "
                        : ""}
                    </span>
                  ))}
                </p>

                {/* Customer Name */}
                <p className="order-item-name">
                  {order.address?.firstName}{" "}
                  {order.address?.lastName}
                </p>

                {/* Address */}
                <div className="order-item-address">
                  <p>
                    {order.address?.street}
                    {order.address?.street ? "," : ""}
                  </p>

                  <p>
                    {order.address?.city}
                    {order.address?.city ? ", " : ""}
                    {order.address?.state}
                    {order.address?.state ? ", " : ""}
                    {order.address?.country}
                    {order.address?.country ? ", " : ""}
                    {order.address?.zipcode}
                  </p>
                </div>

                {/* Phone */}
                <p className="order-item-phone">
                  {order.address?.phone}
                </p>
              </div>

              {/* Items Count */}
              <p>
                Items: {order.items?.length || 0}
              </p>

              {/* Amount */}
              <p>
                ${Number(order.amount || 0).toFixed(2)}
              </p>

              {/* Status */}
              <select
                onChange={(event) =>
                  statusHandler(event, order._id)
                }
                value={order.status}
              >
                <option value="Food Processing">
                  Food Processing
                </option>

                <option value="Out for delivery">
                  Out for delivery
                </option>

                <option value="Delivered">
                  Delivered
                </option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;