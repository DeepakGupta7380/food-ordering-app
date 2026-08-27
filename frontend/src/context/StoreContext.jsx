import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  // ===============================
  // States
  // ===============================
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);

  // ===============================
  // Backend URL
  // ===============================
  const url =
    import.meta.env.VITE_API_URL ||
    "https://tomato-mern-stack.onrender.com";

  // ===============================
  // Axios Headers
  // ===============================
  const getAuthHeaders = () => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // ===============================
  // Add To Cart
  // ===============================
  const addToCart = async (itemId) => {
    try {
      // User login check
      if (!token) {
        toast.error("Please login first");
        return;
      }

      // API call first
      const response = await axios.post(
        `${url}/api/cart/add`,
        { itemId },
        getAuthHeaders()
      );

      if (response.data.success) {
        // Update frontend cart
        setCartItems((prev) => ({
          ...prev,
          [itemId]: (prev[itemId] || 0) + 1,
        }));

        toast.success("Item Added to Cart");
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Add To Cart Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to add item to cart"
      );
    }
  };

  // ===============================
  // Remove From Cart
  // ===============================
  const removeFromCart = async (itemId) => {
    try {
      if (!token) {
        toast.error("Please login first");
        return;
      }

      const currentQuantity = cartItems[itemId] || 0;

      if (currentQuantity <= 0) {
        return;
      }

      // API call
      const response = await axios.post(
        `${url}/api/cart/remove`,
        { itemId },
        getAuthHeaders()
      );

      if (response.data.success) {
        setCartItems((prev) => {
          const updatedCart = { ...prev };

          if (currentQuantity > 1) {
            updatedCart[itemId] = currentQuantity - 1;
          } else {
            delete updatedCart[itemId];
          }

          return updatedCart;
        });

        toast.success("Item Removed from Cart");
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Remove From Cart Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to remove item from cart"
      );
    }
  };

  // ===============================
  // Get Total Cart Amount
  // ===============================
  const getTotalCartAmount = () => {
    let totalAmount = 0;

    for (const item in cartItems) {
      const quantity = cartItems[item];

      if (quantity > 0) {
        const itemInfo = food_list.find(
          (product) => product._id === item
        );

        if (itemInfo) {
          totalAmount +=
            Number(itemInfo.price) * Number(quantity);
        }
      }
    }

    return totalAmount;
  };

  // ===============================
  // Fetch Food List
  // ===============================
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(
        `${url}/api/food/list`
      );

      if (response.data.success) {
        setFoodList(response.data.data);
      } else {
        toast.error(
          response.data.message ||
            "Food products are not available"
        );
      }
    } catch (error) {
      console.error("Food List Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to fetch food list"
      );
    }
  };

  // ===============================
  // Load Cart Data
  // ===============================
  const loadCartData = async (userToken) => {
    try {
      const response = await axios.post(
        `${url}/api/cart/get`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (response.data.success) {
        setCartItems(response.data.cartData || {});
      } else {
        setCartItems({});
        toast.error(
          response.data.message ||
            "Unable to load cart"
        );
      }
    } catch (error) {
      console.error("Load Cart Error:", error);

      setCartItems({});

      toast.error(
        error.response?.data?.message ||
          "Unable to load cart"
      );
    }
  };

  // ===============================
  // Load Initial Data
  // ===============================
  useEffect(() => {
    const loadData = async () => {
      await fetchFoodList();

      const savedToken = localStorage.getItem("token");

      if (savedToken) {
        setToken(savedToken);
        await loadCartData(savedToken);
      }
    };

    loadData();
  }, []);

  // ===============================
  // Context Value
  // ===============================
  const contextValue = {
    food_list,
    cartItems,
    setCartItems,

    addToCart,
    removeFromCart,

    getTotalCartAmount,

    url,

    token,
    setToken,

    loadCartData,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;