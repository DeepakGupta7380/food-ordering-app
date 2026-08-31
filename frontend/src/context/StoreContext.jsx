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
        "https://food-ordering-app-zd8f.onrender.com";


    // ===============================
    // Axios Auth Headers
    // ===============================

    const getAuthHeaders = (userToken = token) => {

        if (!userToken) {
            return {};
        }

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

            // --------------------------------
            // Check Item ID
            // --------------------------------

            if (!itemId) {

                console.log("itemId is missing");

                toast.error("Food item not found");

                return;
            }


            // --------------------------------
            // Check Login
            // --------------------------------

            if (!token) {

                toast.error("Please login first");

                return;
            }


            // --------------------------------
            // Optimistic Quantity Increase
            // --------------------------------

            setCartItems((prev) => ({
                ...prev,
                [itemId]: (prev[itemId] || 0) + 1,
            }));


            // --------------------------------
            // Send Request To Backend
            // --------------------------------

            const response = await axios.post(

                `${url}/api/cart/add`,

                {
                    userId: userId || undefined,
                    itemId: itemId,
                },

                getAuthHeaders(token)

            );


            // --------------------------------
            // Backend Response
            // --------------------------------

            if (response.data?.success) {

                toast.success("Item Added to Cart");

            } else {

                // Backend rejected request
                // इसलिए frontend quantity वापस करें

                setCartItems((prev) => {

                    const updatedCart = {
                        ...prev,
                    };

                    if (updatedCart[itemId] > 1) {

                        updatedCart[itemId] -= 1;

                    } else {

                        delete updatedCart[itemId];

                    }

                    return updatedCart;
                });


                toast.error(
                    response.data?.message ||
                    "Unable to add item to cart"
                );
            }


        } catch (error) {

            console.error(
                "Add To Cart Error:",
                error.response?.data || error.message
            );


            // --------------------------------
            // API Failed
            // Quantity वापस करें
            // --------------------------------

            setCartItems((prev) => {

                const updatedCart = {
                    ...prev,
                };

                if (updatedCart[itemId] > 1) {

                    updatedCart[itemId] -= 1;

                } else {

                    delete updatedCart[itemId];

                }

                return updatedCart;
            });


            toast.error(
                error.response?.data?.message ||
                "Unable to add item to cart"
            );
        }
    };


    // ===============================
    // Remove From Cart
    // ===============================

    const removeFromCart = async (userId, itemId) => {

        try {

            // --------------------------------
            // Check Item ID
            // --------------------------------

            if (!itemId) {

                console.log("itemId is missing");

                return;
            }


            // --------------------------------
            // Check Login
            // --------------------------------

            if (!token) {

                toast.error("Please login first");

                return;
            }


            // --------------------------------
            // Current Quantity
            // --------------------------------

            const currentQuantity =
                cartItems[itemId] || 0;


            if (currentQuantity <= 0) {

                return;
            }


            // --------------------------------
            // Optimistic Quantity Decrease
            // --------------------------------

            setCartItems((prev) => {

                const updatedCart = {
                    ...prev,
                };

                if (currentQuantity > 1) {

                    updatedCart[itemId] =
                        currentQuantity - 1;

                } else {

                    delete updatedCart[itemId];

                }

                return updatedCart;
            });


            // --------------------------------
            // Backend Request
            // --------------------------------

            const response = await axios.post(

                `${url}/api/cart/remove`,

                {
                    userId: userId || undefined,
                    itemId: itemId,
                },

                getAuthHeaders(token)

            );


            // --------------------------------
            // Backend Response
            // --------------------------------

            if (response.data?.success) {

                toast.success(
                    "Item Removed from Cart"
                );

            } else {

                // Backend failed
                // Quantity वापस करें

                setCartItems((prev) => ({
                    ...prev,
                    [itemId]: currentQuantity,
                }));


                toast.error(
                    response.data?.message ||
                    "Unable to remove item from cart"
                );
            }


        } catch (error) {

            console.error(
                "Remove From Cart Error:",
                error.response?.data || error.message
            );


            // --------------------------------
            // API Failed
            // Quantity वापस करें
            // --------------------------------

            const currentQuantity =
                cartItems[itemId] || 0;


            if (currentQuantity > 0) {

                setCartItems((prev) => ({
                    ...prev,
                    [itemId]:
                        (prev[itemId] || 0) + 1,
                }));
            }


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

            const quantity =
                cartItems[item];


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


            if (response.data?.success) {

                setFoodList(
                    response.data.data || []
                );

            } else {

                toast.error(
                    response.data?.message ||
                    "Food products are not available"
                );
            }


        } catch (error) {

            console.error(
                "Food List Error:",
                error.response?.data || error.message
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

            if (!userToken) {

                setCartItems({});

                return;
            }


            const response = await axios.post(

                `${url}/api/cart/get`,

                {},

                getAuthHeaders(userToken)

            );


            if (response.data?.success) {

                setCartItems(
                    response.data.cartData || {}
                );

            } else {

                setCartItems({});

                console.log(
                    response.data?.message ||
                    "Cart data not found"
                );
            }


        } catch (error) {

            console.error(
                "Load Cart Error:",
                error.response?.data || error.message
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


        // --------------------------------
        // Set Token
        // --------------------------------

        if (savedToken) {

            setToken(savedToken);

        }


        // --------------------------------
        // Set Admin
        // --------------------------------

        if (savedAdmin === "true") {

            setAdmin(true);

        } else {

            setAdmin(false);

        }


        // --------------------------------
        // Fetch Food
        // --------------------------------

        fetchFoodList();


        // --------------------------------
        // Load Cart
        // --------------------------------

        if (savedToken) {

            loadCartData(savedToken);

        } else {

            setCartItems({});

        }

    }, []);


    // ===============================
    // Context Value
    // ===============================

    const contextValue = {

        // Food
        food_list,

        // Cart
        cartItems,
        setCartItems,

        addToCart,
        removeFromCart,

        getTotalCartAmount,

        // Backend
        url,

        // Authentication
        token,
        setToken,

        // Admin
        admin,
        setAdmin,

        // Cart Loader
        loadCartData,
    };


    // ===============================
    // Provider
    // ===============================

    return (
        <StoreContext.Provider
            value={contextValue}
        >
            {props.children}
        </StoreContext.Provider>
    );
};


export default StoreContextProvider;