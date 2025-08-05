import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { AppContent } from "../context/AppContext";

import '../App.css';

const Header = () => {

    const {userData} = useContext(AppContent)

  return (
    <div className="bg-white px-6 py-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 ">
        
        <div className="text-center md:text-left space-y-4 md:w-1/2">
          <h1 className="text-6xl font-bold text-gray-900">Hey {userData ? userData.name : "Developer"} 👋</h1>
          <h2 className="text-3xl text-gray-700">Welcome to Our App</h2>
          <p className="text-gray-600 max-w-md mx-auto md:mx-0 text-1xl">
            Let’s start with a quick product tour and we’ll have you up and running in no time.
          </p>
          <Link
  to={'/login'}
  className="hidden md:inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition"
>
  Get Started
</Link>

        </div>

=        <div className="flex-shrink-0 md:w-1/2">
         <img
  src={assets.header_img}
  alt="Header Visual"
  className="w-64 md:w-full max-w-md mx-auto animate-float"
/>

        </div>
      </div>
    </div>
  );
};

export default Header;
