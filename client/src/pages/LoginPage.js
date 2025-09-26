import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../services/api"; // 👈 your backend login API

const LoginPage = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      toast.error("Please enter both username and password");
      return;
    }

    setLoading(true);
    try {
      // 👇 Calls your /login endpoint (which auto-creates new user if not exist)
      const res = await login(form.username, form.password);

      // show success toast depending on status
      toast.success(res.message || "Logged in!");

      // redirect to vote page
      navigate("/vote");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400">
          🗳 Vote App
        </h1>
        
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Enter your username and password. <br />
          <span className="text-blue-600 dark:text-blue-400 font-medium">New here?</span> 
          Don’t worry — we’ll auto-create your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50 transition"
          >
            {loading ? "Logging in..." : "Login / Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;