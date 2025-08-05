import React, { useState, useContext } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContent } from "../context/AppContext";
import axios from "axios"

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContent);
  const navigate = useNavigate();

  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/send-reset-otp`, { email });
      
      if (data.success) {
        toast.success("OTP sent to your email.");
        setStep(2);
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong. Try again.";
      toast.error(message);
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      // Create a temporary verification just to check OTP validity
      const { data } = await axios.post(`${backendUrl}/api/auth/verify-reset-otp`, { 
        email, 
        otp 
      });
      
      if (data.success) {
        toast.success("OTP verified. Set your new password.");
        setStep(3);
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong. Try again.";
      toast.error(message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      toast.error("Please provide new Password");
      return;
    }

    if (newPassword.length < 3) {
      toast.error("Password must be at least 3 characters long");
      return;
    }

    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/reset-password`, { 
        email, 
        otp, 
        newPassword 
      });
      
      if (data.success) {
        toast.success("Password reset successfully!");
        setEmail("");
        setOtp("");
        setNewPassword("");
        setStep(1);
        navigate("/login");
      } else {
        toast.error(data.message || "Failed to reset password");
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong. Try again.";
      toast.error(message);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white to-blue-400 text-zinc-800 px-4">
      <Link to="/" className="absolute top-1 left-6 flex items-center gap-2">
        <img src={assets.logo} alt="logo" className="w-30 h-30" />
      </Link>

      <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
      <p className="mb-6 text-gray-600 text-center max-w-xs">
        {step === 1 && "Enter your email to receive an OTP"}
        {step === 2 && "Enter the 6-digit OTP sent to your email"}
        {step === 3 && "Enter a new password for your account"}
      </p>

      <form
        onSubmit={
          step === 1
            ? handleEmailSubmit
            : step === 2
            ? handleOtpVerify
            : handleResetPassword
        }
        className="w-full max-w-sm flex flex-col gap-4 bg-gray-700 p-6 rounded-xl shadow-xl border border-blue-200"
      >
        {step === 1 && (
          <div className="flex items-center gap-2 bg-gray-100 rounded px-3 py-2">
            <img src={assets.mail_icon} alt="email" className="w-5 h-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="bg-transparent outline-none w-full text-zinc-800"
            />
          </div>
        )}

        {step === 2 && (
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
        )}

        {step === 3 && (
          <div className="flex items-center gap-2 bg-gray-100 rounded px-3 py-2">
            <img src={assets.lock_icon} alt="new password" className="w-5 h-5" />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="bg-transparent outline-none w-full text-zinc-800"
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white rounded py-2 font-semibold transition"
        >
          {step === 1 && "Send OTP"}
          {step === 2 && "Verify OTP"}
          {step === 3 && "Reset Password"}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        Remember your password?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Go back to Login
        </Link>
      </p>
    </div>
  );
};

export default ResetPassword;