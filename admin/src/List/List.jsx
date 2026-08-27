import React, { useCallback, useContext, useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../context/StoreContext";
import { useNavigate } from "react-router-dom";

const List = ({ url }) => {
  const navigate = useNavigate();

  const { token, admin } = useContext(StoreContext);

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  /* =========================
     Fetch Food List
  ========================= */

  const fetchList = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${url}/api/food/list`);

      if (response.data.success) {
        setList(response.data.data || []);
      } else {
        toast.error(response.data.message || "Unable to fetch food list");
      }
    } catch (error) {
      console.log("Fetch List Error:", error);

      toast.error(
        error.response?.data?.message || "Failed to fetch food list"
      );
    } finally {
      setLoading(false);
    }
  }, [url]);

  /* =========================
     Remove Food
  ========================= */

  const removeFood = async (foodId) => {
    if (!foodId) {
      toast.error("Food ID is missing");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this food item?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(foodId);

      const response = await axios.post(
        `${url}/api/food/remove`,
        {
          id: foodId,
        },
        {
          headers: {
            token,
          },
        }
      );

      if (response.data.success) {
        toast.success(
          response.data.message || "Food removed successfully"
        );

       
        await fetchList();
      } else {
        toast.error(response.data.message || "Unable to remove food");
      }
    } catch (error) {
      console.log("Remove Food Error:", error);

      toast.error(
        error.response?.data?.message || "Failed to remove food"
      );
    } finally {
      setDeletingId("");
    }
  };

  /* =========================
     Authentication + Fetch
  ========================= */

  useEffect(() => {
    if (!token || !admin) {
      toast.error("Please Login First");
      navigate("/", { replace: true });
      return;
    }

    fetchList();
  }, [token, admin, navigate, fetchList]);

  /* =========================
     Render
  ========================= */

  return (
    <div className="list add flex-col">

      <div className="list-header">
        <h3>All Food List</h3>

        <button
          type="button"
          onClick={fetchList}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="list-table">

        {/* Table Header */}
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>

        {/* Loading */}
        {loading && list.length === 0 && (
          <div className="list-message">
            <p>Loading food items...</p>
          </div>
        )}

        {/* Empty List */}
        {!loading && list.length === 0 && (
          <div className="list-message">
            <p>No food items found.</p>
          </div>
        )}

        {/* Food List */}
        {list.map((item) => (
          <div
            key={item._id}
            className="list-table-format"
          >
            <img
              src={`${url}/images/${item.image}`}
              alt={item.name}
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />

            <p>{item.name}</p>

            <p>{item.category}</p>

            <p>${item.price}</p>

            <button
              type="button"
              className="cursor delete-btn"
              onClick={() => removeFood(item._id)}
              disabled={deletingId === item._id}
            >
              {deletingId === item._id ? "..." : "X"}
            </button>
          </div>
        ))}

      </div>
    </div>
  );
};

export default List;