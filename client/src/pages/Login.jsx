import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

const Login = () => {
const navigate = useNavigate();

  const { backendUrl, setIsLoggedin , getUserData } = useContext(AppContent);

  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
  e.preventDefault();

  if (state === "Sign Up" && (!name || !email || !password)) {
    toast.error("All fields are required!");
    return;
  }

  if (state === "Login" && (!email || !password)) {
    toast.error("Email and password are required!");
    return;
  }

  try {
    axios.defaults.withCredentials = true;

    if (state === "Sign Up") {
      const { data } = await axios.post(backendUrl + "/api/auth/register", {
        name,
        email,
        password,
      });

      if (data.success) {
        setIsLoggedin(true);
        getUserData()
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } else {
      const { data } = await axios.post(backendUrl + "/api/auth/login", {
        email,
        password,
      });

      if (data.success) {
        setIsLoggedin(true);
        getUserData()
        navigate("/");
      } else {
        toast.error(data.message);
      }
    }
  } catch (error) {
    const message =
      error?.response?.data?.message || "Something went wrong. Try again.";
    toast.error(message);
  }
};


  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white to-blue-400 text-zinc-800 px-4">
=      <Link to="/" className="absolute top-1 left-6 flex items-center gap-2">
        <img src={assets.logo} alt="logo" className="w-30 h-30" />
      </Link>

      <h1 className="text-3xl font-bold mb-2">
        {state === "Sign Up" ? "Create Account" : "Login Account"}
      </h1>

      <p className="mb-6 text-gray-600">
        {state === "Sign Up"
          ? "Create your account now"
          : "Login to your account"}
      </p>


<form
  onSubmit={onSubmitHandler}
  className="w-full max-w-sm flex flex-col gap-4 bg-gray-700 p-6 rounded-xl shadow-xl border border-blue-200"
>
  {state === "Sign Up" && (
    <div className="flex items-center gap-2 bg-gray-100 rounded px-3 py-2">
      <img src={assets.person_icon} alt="" className="w-5 h-5" />
      <input
        onChange={(e) => setName(e.target.value)}
        value={name}
        type="text"
        placeholder="Username"
        className="bg-transparent outline-none w-full text-zinc-800"
      />
    </div>
  )}

  <div className="flex items-center gap-2 bg-gray-100 rounded px-3 py-2">
    <img src={assets.mail_icon} alt="" className="w-5 h-5" />
    <input
      onChange={(e) => setEmail(e.target.value)}
      value={email}
      type="email"
      placeholder="Email"
      className="bg-transparent outline-none w-full text-zinc-800"
    />
  </div>

  <div className="flex items-center gap-2 bg-gray-100 rounded px-3 py-2">
    <img src={assets.lock_icon} alt="" className="w-5 h-5" />
    <input
      onChange={(e) => setPassword(e.target.value)}
      value={password}
      type="password"
      placeholder="Password"
      className="bg-transparent outline-none w-full text-zinc-800"
    />
  </div>

  

  {state === "Login" && (
    <p className="text-right text-sm text-white cursor-pointer hover:underline">
      <Link to={"/reset-password"}>Forgot Password?</Link>
    </p>
  )}

  <button className="bg-blue-500 hover:bg-blue-600 text-white rounded py-2 font-semibold transition">
    {state}
  </button>
</form>
      <p className="mt-4 text-sm text-gray-600">
        {state === "Sign Up"
          ? "Already have an account?"
          : "Don't have an account?"}{" "}
        <span
          className="text-blue-600 cursor-pointer hover:underline"
          onClick={() => setState(state === "Sign Up" ? "Login" : "Sign Up")}
        >
          {state === "Sign Up" ? "Login" : "Sign Up"}
        </span>
      </p>
    </div>
  );
};

export default Login;
