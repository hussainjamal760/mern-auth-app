import React, { useState, useContext , useEffect } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContent } from "../context/AppContext";

const EmailVerification = () => {
  const { backendUrl, userData , isLoggedin , getUserData, setIsLoggedin } = useContext(AppContent);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/verify-account`, {
        otp,
      });

      if (data.success) {
        toast.success("Email verified successfully!");
        setIsLoggedin(true);
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message || "Verification failed!");
      }
    } catch (err) {
      const message =
        err?.response?.data?.message || "Something went wrong. Try again.";
      toast.error(message);
    }
  };

  useEffect(()=>{
    isLoggedin && userData && userData.isAccountVerified && navigate('/')
  }, [isLoggedin, userData])

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white to-blue-400 text-zinc-800 px-4">
      {/* 🔹 Logo Top Left */}
      <Link to="/" className="absolute top-1 left-6 flex items-center gap-2">
        <img src={assets.logo} alt="logo" className="w-30 h-30" />
      </Link>

      <h1 className="text-3xl font-bold mb-2">Email Verification</h1>
      <p className="mb-6 text-gray-600 text-center max-w-xs">
        Enter the 6-digit code sent to your email to verify your account.
      </p>

      <form
        onSubmit={handleVerify}
        className="w-full max-w-sm flex flex-col gap-4 bg-gray-700 p-6 rounded-xl shadow-xl border border-blue-200"
      >
        <div className="flex items-center gap-2 bg-gray-100 rounded px-3 py-2">
          <img src={assets.lock_icon} alt="otp" className="w-5 h-5" />
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            maxLength={6}
            className="bg-transparent outline-none w-full text-zinc-800"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white rounded py-2 font-semibold transition"
        >
          Verify
        </button>
      </form>

  
    </div>
  );
};

export default EmailVerification;
