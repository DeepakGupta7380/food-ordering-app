import React from "react";
import "./Header.css";

const Header = () => {
  // ===============================
  // View Menu
  // ===============================
  const handleViewMenu = () => {
    const menuSection = document.getElementById("explore-menu");

    if (menuSection) {
      menuSection.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <header className="header" id="header">
      <div className="header-contents">

        <h2>Order your favourite food here</h2>

        <p>
          Choose from a diverse menu featuring a delicious
          array of dishes crafted with the finest ingredients
          and culinary expertise. Our mission is to satisfy
          your cravings and elevate your dining experience,
          one delicious meal at a time.
        </p>

        <button
          type="button"
          onClick={handleViewMenu}
        >
          View Menu
        </button>

      </div>
    </header>
  );
};

export default Header;