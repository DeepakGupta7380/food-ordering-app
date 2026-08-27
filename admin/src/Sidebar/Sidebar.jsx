import React from "react";
import "./Sidebar.css";
import { assets } from "../assets/assets";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-options">

        {/* Add Items */}
        <NavLink
          to="/add"
          className={({ isActive }) =>
            `sidebar-option ${isActive ? "active" : ""}`
          }
        >
          <img src={assets.add_icon} alt="Add Items" />
          <p>Add Items</p>
        </NavLink>

        {/* List Items */}
        <NavLink
          to="/list"
          className={({ isActive }) =>
            `sidebar-option ${isActive ? "active" : ""}`
          }
        >
          <img src={assets.order_icon} alt="List Items" />
          <p>List Items</p>
        </NavLink>

        {/* Orders */}
        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `sidebar-option ${isActive ? "active" : ""}`
          }
        >
          <img src={assets.order_icon} alt="Orders" />
          <p>Orders</p>
        </NavLink>

      </div>
    </div>
  );
};

export default Sidebar;