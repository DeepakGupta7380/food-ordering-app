import React from "react";
import "./ExploreMenu.css";
import { menu_list } from "../assets/frontend_assets/assets";

const ExploreMenu = ({ category, setCategory }) => {

  // ===============================
  // Category Selection
  // ===============================
  const handleCategoryClick = (menuName) => {
    setCategory((prevCategory) =>
      prevCategory === menuName ? "All" : menuName
    );
  };

  return (
    <section
      className="explore-menu"
      id="explore-menu"
    >

      {/* ===============================
          Heading
      =============================== */}

      <h1>Explore our menu</h1>

      <p className="explore-menu-text">
        Choose from a diverse menu featuring a delicious
        array of dishes. Our mission is to satisfy your
        cravings and elevate your dining experience,
        one delicious meal at a time.
      </p>

      {/* ===============================
          Menu List
      =============================== */}

      <div className="explore-menu-list">

        {menu_list.map((item) => (
          <div
            key={item.menu_name}
            onClick={() =>
              handleCategoryClick(item.menu_name)
            }
            className="explore-menu-list-item"
          >

            {/* Menu Image */}
            <img
              className={
                category === item.menu_name
                  ? "active"
                  : ""
              }
              src={item.menu_image}
              alt={item.menu_name}
            />

            {/* Menu Name */}
            <p>{item.menu_name}</p>

          </div>
        ))}

      </div>

      {/* ===============================
          Divider
      =============================== */}

      <hr />

    </section>
  );
};

export default ExploreMenu;