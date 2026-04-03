import React, { useState } from "react";
import { useAuth } from "../context/AouthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(email, password);
    if (result.success) {
      navigate("/home");
    } else {
      setError("Invalid email or password ❌");
    }
  };

  return (
    <div className="flex items-center justify-center bg-linear-to-tr from-sky-400 to-purple-600 w-full h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-[350px]">

        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="bg-linear-to-r from-sky-500 to-purple-500 text-white py-2 rounded hover:scale-102 transition"
          >
            Login
          </button>

        </form>
      </div>
    </div>
  );
};

export default Login;