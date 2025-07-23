import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBlogs, likeBlog, addComment } from "../services/api";
import toast from "react-hot-toast";
import GifComponent from "../components/LoadingGif";
import { useAuth } from "../contexts/AuthContext";

export default function PublicProfile() {
  const { authorId, blogId } = useParams();
  const { user, loadingUser } = useAuth();
  const [blog, setBlog] = useState(null);
  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [authorId, blogId]);

  const fetchData = async (showLoader = true) => {
    if (isLoading) return;
    if (showLoader) setIsLoading(true);
    try {
      const res = await getBlogs();
      const filtered = res.data.find((q) => {
        const userId = typeof q.user === "object" ? q.user._id : q.user;
        return q._id === blogId && userId === authorId;
      });
      console.log("Fetched blog:", filtered);
      setBlog(filtered || null);
    } catch {
      toast.error("Error loading blog");
    } finally {
      if (showLoader) setIsLoading(false);
    }
  };

  const handleLike = async (id) => {
    try {
      setLiked(true);
      await likeBlog(id);
      fetchData(false);
      setTimeout(() => setLiked(false), 500);
    } catch {
      toast.error("Error liking post");
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment || !blog) return;

    try {
      const res = await addComment(blog._id, { text: comment }); // ✅ store result
      console.log("Add comment response:", res.data);
      setComment("");
      setBlog(res.data.blog);
    } catch (err) {
      toast.error("Failed to comment");
      fetchData();
    }
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <GifComponent />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-neutral-950 px-4 sm:px-8 py-12 md:py-16 transition-all duration-500">
      <div className="max-w-6xl mx-auto relative">
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <GifComponent />
          </div>
        )}
        {blog ? (
          <>
            {/* 🧾 Blog Title */}
            <h2 className="text-3xl sm:text-4xl font-bold text-left text-white mb-10 border-l-4 border-purple-500 pl-4">
              🧾 {blog.title || "Untitled Blog"}
            </h2>

            {/* 🟪 Blog Card */}
            <div className="relative bg-gradient-to-br from-purple-900 via-indigo-800 to-gray-900 p-8 border border-zinc-700 rounded-lg shadow-xl transition-all duration-300 hover:shadow-2xl">
              {/* ✒️ Author */}
              <div className="absolute top-4 right-6 text-sm text-purple-300 italic font-medium uppercase">
                ✒️ – by {blog.user?.name || "Unknown"}
              </div>

              {/* 📄 Blog Content */}
              <p className="text-white text-justify leading-loose whitespace-pre-wrap tracking-wide px-1 md:px-2 font-sans text-[17px]">
                {blog.text}
              </p>

              {/* ❤️ Likes & 💬 Count */}
              <div className="mt-6 flex items-center justify-between border-t border-zinc-700 pt-4 text-sm text-gray-300">
                <div className="flex gap-4 items-center">
                  <span
                    onClick={() => handleLike(blog._id)}
                    className={`cursor-pointer flex items-center gap-2 px-4 py-1.5 rounded-full shadow-inner text-white font-semibold tracking-wide transition-transform duration-300 ${
                      liked ? "scale-110" : ""
                    }`}
                  >
                    💜 {blog.likes.length}
                  </span>
                  <span className="flex items-center gap-2 text-purple-300">
                    💬 {blog.comments?.length || 0}
                  </span>
                </div>
              </div>

              {/* 📝 Comment Input */}
              <form onSubmit={handleComment} className="flex gap-3 mt-6">
                <input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 px-4 py-2 rounded-lg border border-purple-400 bg-zinc-900 text-white placeholder:text-zinc-400 focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
                />
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all text-sm font-semibold shadow-md"
                >
                  Post
                </button>
              </form>

              {/* 💬 Comments */}
              {blog.comments?.length > 0 && (
                <div className="mt-8 max-h-72 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-zinc-700 space-y-5">
                  {blog.comments.map((c) => {
                    console.log("Rendering comment:", c);
                    return (
                      <div
                        key={c._id}
                        className={`border px-6 py-4 rounded-md shadow-sm hover:shadow-md transition duration-300 ${
                          c.flagged
                            ? "bg-red-100 border-red-300 text-red-800"
                            : "bg-white border-gray-200 text-gray-800"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm flex items-center gap-1">
                            👤 {c.user?.name || "Anonymous"}
                          </span>
                          <span className="text-xs">
                            {c.createdAt
                              ? new Date(c.createdAt).toLocaleString("en-IN", {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                })
                              : "Unknown"}
                          </span>
                        </div>
                        <p className="text-[16px] leading-[1.8] tracking-wide font-[500] font-serif">
                          {c.text}
                        </p>
                        {c.flagged && (
                          <p className="text-sm mt-1 italic text-red-600">
                            ⚠️ Hate Level: {c.hatePercent?.toFixed(2)}%
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-400 text-lg">Blog not found.</p>
        )}
      </div>
    </div>
  );
}
