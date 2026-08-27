import React, { useState } from "react";

import Header from "../Header/Header";
import ExploreMenu from "../ExploreMenu/ExploreMenu";
import FoodDisplay from "../FoodDisplay/FoodDisplay";
import AppDownload from "../AppDownload/AppDownload";

const Home = () => {
  // ===============================
  // Selected Food Category
  // ===============================
  const [category, setCategory] = useState("All");

  return (
    <main className="home">

      {/* Header / Hero Section */}
      <Header />

      {/* Food Categories */}
      <ExploreMenu
        category={category}
        setCategory={setCategory}
      />

      {/* Food Items */}
      <FoodDisplay
        category={category}
      />

      {/* App Download */}
      <AppDownload />

    </main>
  );
};

export default Home;