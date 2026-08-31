import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import "./Add.css";

import { assets } from "../assets/assets";

import axios from "axios";

import { toast } from "react-toastify";

import { StoreContext } from "../context/StoreContext";

import { useNavigate } from "react-router-dom";


const Add = ({ url }) => {
  const navigate = useNavigate();

  const { token, admin } = useContext(StoreContext);


  // =========================================
  // States
  // =========================================

  const [image, setImage] = useState(null);

  const [imagePreview, setImagePreview] = useState(
    assets.upload_area
  );

  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad",
  });


  // =========================================
  // Input Change
  // =========================================

  const onChangeHandler = (event) => {
    const { name, value } = event.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // =========================================
  // Image Change
  // =========================================

  const onImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }


    // Allowed image types
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];


    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Please select JPG, PNG or WEBP image"
      );

      event.target.value = "";

      setImage(null);

      return;
    }


    // Maximum 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        "Image size must be less than 5MB"
      );

      event.target.value = "";

      setImage(null);

      return;
    }


    setImage(file);
  };


  // =========================================
  // Image Preview
  // =========================================

  useEffect(() => {
    if (!image) {
      setImagePreview(assets.upload_area);
      return;
    }

    const objectUrl = URL.createObjectURL(image);

    setImagePreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };

  }, [image]);


  // =========================================
  // Submit Handler
  // =========================================

  const onSubmitHandler = async (event) => {
    event.preventDefault();


    // =======================================
    // Token Check
    // =======================================

    if (!token) {
      toast.error("Please Login First");

      navigate("/");

      return;
    }


    // =======================================
    // Admin Check
    // =======================================

    if (!admin) {
      toast.error(
        "Only admin can add food items"
      );

      return;
    }


    // =======================================
    // Name Check
    // =======================================

    const name = data.name.trim();

    if (!name) {
      toast.error(
        "Please enter product name"
      );

      return;
    }


    // =======================================
    // Description Check
    // =======================================

    const description =
      data.description.trim();

    if (!description) {
      toast.error(
        "Please enter product description"
      );

      return;
    }


    // =======================================
    // Image Check
    // =======================================

    if (!image) {
      toast.error(
        "Please select a food image"
      );

      return;
    }


    // =======================================
    // Price Check
    // =======================================

    const price = Number(data.price);

    if (
      !data.price ||
      Number.isNaN(price) ||
      price <= 0
    ) {
      toast.error(
        "Please enter a valid price"
      );

      return;
    }


    try {
      setLoading(true);


      // =====================================
      // Create FormData
      // =====================================

      const formData = new FormData();

      formData.append("name", name);

      formData.append(
        "description",
        description
      );

      formData.append(
        "price",
        price.toString()
      );

      formData.append(
        "category",
        data.category
      );

      formData.append(
        "image",
        image
      );


      // =====================================
      // Check FormData
      // =====================================

      console.log(
        "Name:",
        formData.get("name")
      );

      console.log(
        "Description:",
        formData.get("description")
      );

      console.log(
        "Price:",
        formData.get("price")
      );

      console.log(
        "Category:",
        formData.get("category")
      );

      console.log(
        "Image:",
        formData.get("image")
      );


      // =====================================
      // Backend URL
      // =====================================

      const baseUrl =
        url?.replace(/\/+$/, "");


      if (!baseUrl) {
        toast.error(
          "Backend URL is missing"
        );

        return;
      }


      // =====================================
      // API Request
      // =====================================

      const response = await axios.post(
        `${baseUrl}/api/food/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      console.log(
        "Add Food Response:",
        response.data
      );


      // =====================================
      // Success
      // =====================================

      if (response.data?.success) {

        toast.success(
          response.data.message ||
          "Food Added Successfully"
        );


        // Reset data
        setData({
          name: "",
          description: "",
          price: "",
          category: "Salad",
        });


        // Reset image
        setImage(null);

        setImagePreview(
          assets.upload_area
        );


        // Reset file input
        const fileInput =
          document.getElementById("image");

        if (fileInput) {
          fileInput.value = "";
        }

      } else {

        toast.error(
          response.data?.message ||
          "Unable to add food"
        );

      }


    } catch (error) {

      console.error(
        "ADD FOOD ERROR:",
        error
      );


      // =====================================
      // Backend Error
      // =====================================

      if (error.response) {

        console.error(
          "Server Response:",
          error.response.data
        );


        if (
          error.response.status === 401
        ) {

          toast.error(
            "Invalid or expired token. Please login again."
          );

          localStorage.removeItem("token");

          navigate("/");

          return;
        }


        if (
          error.response.status === 403
        ) {

          toast.error(
            "Only admin can add food items"
          );

          return;
        }


        toast.error(
          error.response.data?.message ||
          "Server Error"
        );

      }


      // =====================================
      // No Server Response
      // =====================================

      else if (error.request) {

        toast.error(
          "Server is not responding"
        );

      }


      // =====================================
      // Other Error
      // =====================================

      else {

        toast.error(
          error.message ||
          "Something went wrong"
        );

      }

    } finally {

      setLoading(false);

    }
  };


  // =========================================
  // Authentication Check
  // =========================================

  useEffect(() => {

    if (!token) {
      navigate("/");
      return;
    }


    if (!admin) {
      navigate("/");
      return;
    }

  }, [token, admin, navigate]);


  // =========================================
  // JSX
  // =========================================

  return (
    <div className="add">

      <form
        onSubmit={onSubmitHandler}
        className="flex-col"
      >

        {/* ===================================
            Upload Image
        =================================== */}

        <div className="add-img-upload flex-col">

          <p>
            Upload image
          </p>


          <label htmlFor="image">

            <img
              src={imagePreview}
              alt="Food Preview"
            />

          </label>


          <input
            id="image"
            type="file"
            onChange={onImageChange}
            accept="image/jpeg,image/jpg,image/png,image/webp"
            hidden
          />

        </div>


        {/* ===================================
            Product Name
        =================================== */}

        <div className="add-product-name flex-col">

          <p>
            Product name
          </p>


          <input
            type="text"
            name="name"
            value={data.name}
            onChange={onChangeHandler}
            placeholder="Type here"
            maxLength={100}
            required
          />

        </div>


        {/* ===================================
            Product Description
        =================================== */}

        <div className="add-product-description flex-col">

          <p>
            Product description
          </p>


          <textarea
            name="description"
            value={data.description}
            onChange={onChangeHandler}
            rows={6}
            placeholder="Write content here"
            maxLength={500}
            required
          />

        </div>


        {/* ===================================
            Category & Price
        =================================== */}

        <div className="add-category-price">

          {/* Category */}

          <div className="add-category flex-col">

            <p>
              Product category
            </p>


            <select
              name="category"
              value={data.category}
              onChange={onChangeHandler}
              required
            >

              <option value="Salad">
                Salad
              </option>

              <option value="Rolls">
                Rolls
              </option>

              <option value="Deserts">
                Deserts
              </option>

              <option value="Sandwich">
                Sandwich
              </option>

              <option value="Cake">
                Cake
              </option>

              <option value="Pure Veg">
                Pure Veg
              </option>

              <option value="Pasta">
                Pasta
              </option>

              <option value="Noodles">
                Noodles
              </option>

            </select>

          </div>


          {/* Price */}

          <div className="add-price flex-col">

            <p>
              Product price
            </p>


            <input
              type="number"
              name="price"
              value={data.price}
              onChange={onChangeHandler}
              placeholder="20"
              min="1"
              step="0.01"
              required
            />

          </div>

        </div>


        {/* ===================================
            Add Button
        =================================== */}

        <button
          type="submit"
          className="add-btn"
          disabled={loading}
        >

          {loading
            ? "ADDING..."
            : "ADD"
          }

        </button>

      </form>

    </div>
  );
};


export default Add;