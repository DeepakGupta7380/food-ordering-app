


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
    const [admin, setAdmin] = useState(false);
    const [food_list, setFoodList] = useState([]);

    // ===============================
    // Backend URL
    // ===============================

    const url =
        "https://food-ordering-app-dqtz.onrender.com";

    // ===============================
    // Axios Auth Headers
    // ===============================

    const getAuthHeaders = (userToken = token) => {
        return {
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        };
    };

    // ===============================
    // Add To Cart
    // ===============================

    const addToCart = async (userId, itemId) => {

        try {

            if (!token) {
                toast.error("Please login first");
                return;
            }

            const response = await axios.post(
                `${url}/api/cart/add`,
                { itemId },
                getAuthHeaders()
            );

            if (response.data.success) {

                setCartItems((prev) => ({
                    ...prev,
                    [itemId]: (prev[itemId] || 0) + 1,
                }));

                toast.success("Item Added to Cart");

            } else {

                toast.error(
                    response.data.message ||
                    "Something went wrong"
                );
            }

        } catch (error) {

            console.error(
                "Add To Cart Error:",
                error
            );

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

            const currentQuantity =
                cartItems[itemId] || 0;

            if (currentQuantity <= 0) {
                return;
            }

            const response = await axios.post(
                `${url}/api/cart/remove`,
                { itemId },
                getAuthHeaders()
            );

            if (response.data.success) {

                setCartItems((prev) => {

                    const updatedCart = {
                        ...prev
                    };

                    if (currentQuantity > 1) {

                        updatedCart[itemId] =
                            currentQuantity - 1;

                    } else {

                        delete updatedCart[itemId];

                    }

                    return updatedCart;
                });

                toast.success(
                    "Item Removed from Cart"
                );

            } else {

                toast.error(
                    response.data.message ||
                    "Something went wrong"
                );
            }

        } catch (error) {

            console.error(
                "Remove From Cart Error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Unable to remove item from cart"
            );
        }
    };

    

    // ===============================
    // Total Cart Amount
    // ===============================

    const getTotalCartAmount = () => {

        let totalAmount = 0;

        for (const item in cartItems) {

            const quantity = cartItems[item];

            if (quantity > 0) {

                const itemInfo =
                    food_list.find(
                        (product) =>
                            product._id === item
                    );

                if (itemInfo) {

                    totalAmount +=
                        Number(itemInfo.price) *
                        Number(quantity);
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

                setFoodList(
                    response.data.data
                );

            } else {

                toast.error(
                    response.data.message ||
                    "Food products are not available"
                );
            }

        } catch (error) {

            console.error(
                "Food List Error:",
                error
            );

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
                getAuthHeaders(userToken)
            );

            if (response.data.success) {

                setCartItems(
                    response.data.cartData || {}
                );

            } else {

                setCartItems({});

                console.log(
                    response.data.message
                );
            }

        } catch (error) {

            console.error(
                "Load Cart Error:",
                error
            );

            setCartItems({});
        }
    };

    // ===============================
    // Load Token + Admin
    // ===============================

    useEffect(() => {

        const savedToken =
            localStorage.getItem("token");

        const savedAdmin =
            localStorage.getItem("admin");

        if (savedToken) {

            setToken(savedToken);

        }

        if (savedAdmin === "true") {

            setAdmin(true);

        } else {

            setAdmin(false);

        }

        fetchFoodList();

        if (savedToken) {

            loadCartData(savedToken);

        }

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

        admin,

        setAdmin,

        loadCartData,
    };

    return (
        <StoreContext.Provider
            value={contextValue}
        >
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;