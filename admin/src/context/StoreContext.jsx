import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [token, setToken] = useState("");
  const [admin, setAdmin] = useState(false);
  const [foodList, setFoodList] = useState([]);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedAdmin = localStorage.getItem("admin");

    if (savedToken) {
      setToken(savedToken);
    }

    if (savedAdmin === "true") {
      setAdmin(true);
    } else {
      setAdmin(false);
    }
  }, []);

  const contextValue = {
    token,
    setToken,
    admin,
    setAdmin,
    foodList,
    setFoodList,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;



