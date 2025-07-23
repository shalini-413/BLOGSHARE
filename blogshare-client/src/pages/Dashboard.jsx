import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import {
  createBlog,
  getBlogs,
  likeBlog,
  deleteBlog,
  logoutUser,
  getCurrentUser,
} from "../services/api";
import GifComponent from "../components/LoadingGif";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const [blog, setBlog] = useState("");
  const [title, setTitle] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, loadingUser, logout } = useAuth();

  const fetchBlogs = async (showLoader = true) => {
    if (isLoading) return;
    if (showLoader) setIsLoading(true);
    try {
      const res = await getBlogs();
      setBlogs(res.data);
    } catch (err) {
      toast.error("Failed to fetch blogs");
      console.error(err);
    } finally {
      if (showLoader) setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && !loadingUser) fetchBlogs();
  }, [user, loadingUser]);

  const filteredBlogs = blogs.filter((q) => {
    const author = q.user?.name?.toLowerCase() || "";
    const title = q.title?.toLowerCase() || "";
    return (
      author.includes(search.toLowerCase()) ||
      title.includes(search.toLowerCase())
    );
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!blog) return toast.error("Please write a blog!");
    console.log(blog);

    try {
      console.log(title);
      console.log(blog);
      await createBlog({ title, text: blog });
      setBlog("");
      setTitle("");
      fetchBlogs();
      toast.success("Blog posted successfully!");
    } catch (err) {
      toast.error("Failed to post blog.");
      console.error(err);
    }
  };

  const handleLike = async (id) => {
    try {
      await likeBlog(id);
      fetchBlogs(false);
    } catch (err) {
      toast.error("Could not like the blog. Please try again.");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBlog(id);
      fetchBlogs();
      toast.success("Blog deleted 🗑️");
    } catch (err) {
      toast.error("Failed to delete blog.");
      console.error(err);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login"); 
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black text-white">
        <GifComponent />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-neutral-950 px-4 py-10 text-white">
      <div className="w-full px-4 sm:px-8 lg:px-16 mx-auto">
        {/* 🌟 Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/Loading_Square.gif"
              alt="logo gif"
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
            />
            <h1 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-200 animate-pulse">
              BlogShare
            </h1>
          </div>
          {isLoading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <GifComponent />
            </div>
          )}

          <div className="flex flex-col items-end gap-2 mt-4 -ml-4">
            <div className="flex gap-3">
              <Link
                to="/profile"
                className="bg-gradient-to-r from-purple-900 to-fuchsia-900 text-white px-6 py-3 rounded-[1vw] font-semibold shadow-md border border-purple-800 hover:scale-105 hover:shadow-lg hover:border-fuchsia-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              >
                My Blogs
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-900 to-red-900 text-white px-6 py-3 rounded-[2vw] font-semibold shadow-md border border-red-800 hover:scale-105 hover:shadow-lg hover:border-fuchsia-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              >
                Logout
              </button>
            </div>
            <p className="text-sm sm:text-base text-purple-300 font-medium">
              Hello! {user?.name || "User"}!
            </p>
          </div>
        </div>

        {/* ✍️ Create Blog */}
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900/70 backdrop-blur-lg p-6 rounded-3xl shadow-lg border border-zinc-700 mb-10"
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog title"
            className="w-full p-3 rounded-xl border border-zinc-600 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-black text-white placeholder:text-zinc-400"
          />
          <textarea
            value={blog}
            onChange={(e) => setBlog(e.target.value)}
            placeholder="Write your blog..."
            rows={6}
            className="w-full p-3 rounded-xl border border-zinc-600 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-black text-white placeholder:text-zinc-400 resize-y min-h-[150px] max-h-[500px]"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-900 to-fuchsia-900 text-white px-6 py-3 rounded-[1vw] font-semibold shadow-md border border-purple-800 hover:scale-105 hover:shadow-lg hover:border-fuchsia-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
          >
            ✍️ Post Blog
          </button>
        </form>

        {/* 🔍 Search */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="🔍 Search by author or title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-3 pl-12 bg-zinc-800 border border-purple-500 rounded-[2vw] shadow focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-purple-300"
          />
        </div>

        {/* 📜 Blogs Display */}
        {filteredBlogs.length === 0 ? (
          <p className="text-center text-zinc-400">No blogs found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBlogs.map((q, i) => (
              <div
                key={q._id}
                className="relative bg-gradient-to-br from-purple-900 via-indigo-800 to-gray-900 p-8 border border-zinc-700  transition-all duration-300 hover:shadow-2xl hover:shadow-lg"
              >
                <Link to={`/pubprofile/${q.user?._id || q.user}/${q._id}`}>
                  <h3 className="text-xl font-bold text-white uppercase mb-2 hover:underline">
                    {q.title}
                  </h3>
                  <p className="text-white leading-relaxed whitespace-pre-wrap relative pl-2 font-serif line-clamp-3">
                    {q.text}
                  </p>
                </Link>

                <div className="mt-4 flex justify-between items-center text-sm text-purple-300">
                  <p>— {q.user?.name}</p>
                  <span>
                    🕒{" "}
                    {new Date(q.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>

                <div className="mt-3 flex justify-end items-center gap-4 text-purple-400 text-sm">
                  <button
                    onClick={() => handleLike(q._id)}
                    className="hover:text-fuchsia-400 transition"
                  >
                    💜 {q.likes?.length || 0}
                  </button>
                  <span>💬 {q.comments?.length || 0}</span>
                  {user &&
                    q.user &&
                    (q.user === user._id || q.user._id === user._id) && (
                      <button
                        onClick={() => handleDelete(q._id)}
                        className="text-red-400 hover:underline"
                      >
                        🗑️
                      </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
