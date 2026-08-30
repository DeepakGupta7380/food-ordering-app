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


  // ===============================
  // States
  // ===============================

  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad",
  });


  // ===============================
  // Input Change
  // ===============================

  const onChangeHandler = (event) => {
    const { name, value } = event.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  // ===============================
  // Image Change
  // ===============================

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

      return;
    }


    // Maximum 5MB

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        "Image size must be less than 5MB"
      );

      event.target.value = "";

      return;
    }


    setImage(file);
  };


  // ===============================
  // Submit Product
  // ===============================

  const onSubmitHandler = async (event) => {
    event.preventDefault();


    // Check Login

    if (!token) {
      toast.error("Please Login First");

      navigate("/");

      return;
    }


    // Check Admin

    if (!admin) {
      toast.error(
        "Only admin can add food items"
      );

      return;
    }


    // Check Image

    if (!image) {
      toast.error(
        "Please select a food image"
      );

      return;
    }


    // Check Price

    const price = Number(data.price);

    if (!price || price <= 0) {
      toast.error(
        "Please enter a valid price"
      );

      return;
    }


    try {
      setLoading(true);


      // ===============================
      // Form Data
      // ===============================

      const formData = new FormData();

      formData.append(
        "name",
        data.name.trim()
      );

      formData.append(
        "description",
        data.description.trim()
      );

      formData.append(
        "price",
        price
      );

      formData.append(
        "category",
        data.category
      );

      formData.append(
        "image",
        image
      );

      

      const response = await axios.post(
        `${url}/api/food/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      // ===============================
      // Response
      // ===============================

      if (response.data.success) {

        toast.success(
          response.data.message ||
          "Food Added Successfully"
        );


        // Reset Form

        setData({
          name: "",
          description: "",
          price: "",
          category: "Salad",
        });

        setImage(null);


        // Reset file input

        const imageInput =
          document.getElementById("image");

        if (imageInput) {
          imageInput.value = "";
        }

      } else {

        toast.error(
          response.data.message ||
          "Unable to add food"
        );

      }

    } catch (error) {

      console.error(
        "Add Food Error:",
        error
      );


      if (error.response) {

        toast.error(
          error.response.data?.message ||
          "Server Error"
        );

      } else if (error.request) {

        toast.error(
          "Server is not responding"
        );

      } else {

        toast.error(
          "Something went wrong"
        );

      }

    } finally {

      setLoading(false);

    }
  };


  // ===============================
  // Admin Authentication
  // ===============================

  useEffect(() => {

    if (!token) {

      toast.error(
        "Please Login First"
      );

      navigate("/");

      return;
    }


    if (!admin) {

      toast.error(
        "Only admin can access this page"
      );

      navigate("/");

    }

  }, [token, admin, navigate]);


  // ===============================
  // Image Preview
  // ===============================

  const imagePreview = image
    ? URL.createObjectURL(image)
    : assets.upload_area;


  return (
    <div className="add">

      <form
        onSubmit={onSubmitHandler}
        className="flex-col"
      >


        {/* =================================
            Upload Image
        ================================= */}

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
            onChange={onImageChange}
            type="file"
            id="image"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            hidden
            required
          />

        </div>


        {/* =================================
            Product Name
        ================================= */}

        <div className="add-product-name flex-col">

          <p>
            Product name
          </p>

          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Type here"
            required
            maxLength="100"
          />

        </div>


        {/* =================================
            Product Description
        ================================= */}

        <div className="add-product-description flex-col">

          <p>
            Product description
          </p>

          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="6"
            placeholder="Write content here"
            required
            maxLength="500"
          />

        </div>


        {/* =================================
            Category & Price
        ================================= */}

        <div className="add-category-price">


          {/* Category */}

          <div className="add-category flex-col">

            <p>
              Product category
            </p>

            <select
              name="category"
              required
              onChange={onChangeHandler}
              value={data.category}
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
              onChange={onChangeHandler}
              value={data.price}
              type="number"
              name="price"
              placeholder="20"
              min="1"
              step="0.01"
              required
            />

          </div>

        </div>


        {/* =================================
            Add Button
        ================================= */}

        <button
          type="submit"
          className="add-btn"
          disabled={loading}
        >

          {loading
            ? "ADDING..."
            : "ADD"}

        </button>

      </form>

    </div>
  );
};


export default Add;