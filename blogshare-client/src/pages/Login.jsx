import React, { useState } from "react";
import { loginUser, getCurrentUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; 

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser(formData); 
      const res = await getCurrentUser(); 
      console.log("Logged in user:", res.data); 

      toast.success("Login successful! 🎉");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-neutral-950 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-zinc-900 text-white shadow-2xl rounded-3xl overflow-hidden border border-zinc-700">
        <div className="hidden md:flex w-1/2 bg-zinc-800 items-center justify-center flex-col p-10 border-r border-zinc-700">
          <blockblog className="text-xl italic text-purple-300 text-center max-w-sm">
            “Every blog is a snapshot of a thought, shared to echo, inspire, or
            simply be heard.”
          </blockblog>
          <p className="mt-4 text-sm text-zinc-400">~ BlogShare</p>
        </div>

        {/* Right side: Login Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl mb-6 text-center font-extrabold uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-200">
            blogshare
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              name="email"
              type="email"
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-3 rounded-lg border border-zinc-700 bg-black text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <input
              name="password"
              type="password"
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-3 rounded-lg border border-zinc-700 bg-black text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-700 to-fuchsia-700 hover:from-purple-600 hover:to-fuchsia-600 transition-colors text-white font-semibold shadow-md hover:shadow-fuchsia-800"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-xs text-center text-zinc-500">
            Don&apos;t have an account?{" "}
            <a
              href="/register"
              className="underline text-purple-400 hover:text-purple-300"
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
