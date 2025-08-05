import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const Navbar = () => {

 const navigate =  useNavigate()

  const { userData, setUserData ,backendUrl, setIsLoggedin } = useContext(AppContent);
  const [dropdownOpen, setDropdownOpen] = useState(false);
 
   const sendVerificationOtp = async (req , res)=>{
    try {
      axios.defaults.withCredentials=true
      const {data} = await axios.post(backendUrl + "/api/auth/send-verify-otp")

        if(data.success){
          navigate('/email-verify')
          toast.success(data.message)
        }
      
    } catch (error) {
          toast.error(error.message)
      
    }
   }

  const logout = async (req , res)=>{
    try {
      axios.defaults.withCredentials=true;
      const {data} = await axios.post(backendUrl + "/api/auth/logout")
      data.success && setIsLoggedin(false)
      data.success && setUserData(false)
      navigate('/')

    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <nav className="bg-white text-white px-6 py-4 shadow-lg relative">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src={assets.logo} alt="Logo" className="h-10 w-auto" />
        </div>

        {userData ? (
          <div
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <div className="h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-semibold cursor-pointer hover:bg-blue-700 transition">
              {userData.name[0].toUpperCase()}
            </div>

            {dropdownOpen && (
              <ul className="absolute right-0 mt-0 bg-white text-black shadow-lg rounded-lg w-40 py-2 z-50">
               
               {!userData.isAccountVerified &&<li className="px-4 py-2 hover:bg-gray-100 cursor-default" onClick={sendVerificationOtp}>Verify Email</li>}

                <li
                  onClick={logout}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  🔓 Logout
                </li>
              </ul>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <Link
              to={"/login"}
              className="hidden md:flex bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg items-center gap-2 transition"
            >
              Login
              <img src={assets.arrow_icon} alt="->" className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
