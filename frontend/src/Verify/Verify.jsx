import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import "./Verify.css";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { StoreContext } from "../context/StoreContext";

import axios from "axios";

import { toast } from "react-toastify";


const Verify = () => {
  const [searchParams] = useSearchParams();

  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const { url } = useContext(StoreContext);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  // Prevent duplicate API call
  const verificationStarted = useRef(false);


  // ===============================
  // Verify Payment
  // ===============================

  const verifyPayment = async () => {

    // Check orderId
    if (!orderId) {
      toast.error("Order ID not found");
      navigate("/");
      return;
    }

    try {

      setLoading(true);

      const response = await axios.post(
        `${url}/api/order/verify`,
        {
          success,
          orderId,
        }
      );

      if (response.data.success) {

        toast.success("Order Placed Successfully");

        navigate("/myorders");

      } else {

        toast.error(
          response.data.message || "Payment Failed"
        );

        navigate("/");

      }

    } catch (error) {

      console.error(
        "Payment Verification Error:",
        error
      );

      if (error.response) {

        toast.error(
          error.response.data?.message ||
            "Payment verification failed"
        );

      } else if (error.request) {

        toast.error(
          "Server is not responding. Please try again."
        );

      } else {

        toast.error(
          "Something went wrong. Please try again."
        );

      }

      navigate("/");

    } finally {

      setLoading(false);

    }
  };


  // ===============================
  // Run Verification
  // ===============================

  useEffect(() => {

    if (verificationStarted.current) {
      return;
    }

    verificationStarted.current = true;

    verifyPayment();

  }, []);


  // ===============================
  // UI
  // ===============================

  return (
    <div className="verify">

      {loading && (
        <>
          <div className="spinner"></div>

          <p>
            Verifying your payment...
          </p>
        </>
      )}

    </div>
  );
};


export default Verify;