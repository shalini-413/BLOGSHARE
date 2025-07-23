import React, { useEffect, useState } from "react";
import { getBlogs, deleteBlog, deleteComment } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import GifComponent from "../components/LoadingGif";

export default function Profile() {
  const { user, loadingUser } = useAuth();
  const [myBlogs, setMyBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchMyBlogs = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const res = await getBlogs();
      const userId = user?._id;

      const filteredBlogs = res.data.filter((q) => {
        const blogUserId = typeof q.user === "string" ? q.user : q.user?._id;
        return blogUserId === userId;
      });

      console.log("Fetched blogs:", filteredBlogs); // Debug log
      setMyBlogs(filteredBlogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteBlog(id);
    fetchMyBlogs();
  };

  const handleDeleteComment = async (blogId, commentId) => {
    await deleteComment(blogId, commentId);
    fetchMyBlogs();
  };

  useEffect(() => {
    if (user && !loadingUser) {
      fetchMyBlogs();
    }
  }, [user, loadingUser]);

  return (
    <div className="min-h-screen bg-black px-4 sm:px-6 py-12 md:py-16 transition-all duration-500">
      <div className="max-w-7xl mx-auto relative">
        <div className="absolute -top-6 -left-6 w-16 h-16 bg-orange-200 rounded-full blur-2xl opacity-30 animate-pulse"></div>
        <h2 className="text-3xl sm:text-4xl font-bold text-left text-white mb-8 border-l-4 border-orange-400 pl-4 py-2">
          📝 My Blogs
        </h2>
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <GifComponent />
          </div>
        )}
        <div className="mb-8">
          <input
            type="text"
            placeholder="🔍 Search by blog title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 bg-zinc-800 text-white border border-purple-600 rounded-[1vw] shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-zinc-300"
          />
        </div>

        {myBlogs.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            You haven't posted any blog entries yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {myBlogs
              .filter((q) =>
                q.title?.toLowerCase().includes(search.toLowerCase())
              )
              .map((q, index) => {
                const themes = ["from-purple-900 via-indigo-800 to-gray-900"];
                const bg = themes[index % themes.length];
                const isFlagged =
                  q.flagged || q.comments.some((c) => c.flagged);
                const isOwner = q.user === user._id || q.user?._id === user._id;

                return (
                  <div
                    key={q._id}
                    className={`bg-gradient-to-br ${bg} p-6 border transition-all duration-300 hover:shadow-lg ${
                      isFlagged
                        ? "border-red-400 bg-red-50"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    <h3 className="text-2xl md:text-2xl font-extrabold text-center uppercase tracking-wider text-white mb-6 border-b-4 border-orange-400 inline-block pb-2 px-4 shadow-sm mx-auto">
                      🧾 {q.title || "Untitled Blog"}
                    </h3>
                    <p className="text-white text-justify whitespace-pre-wrap leading-loose tracking-wide px-1 md:px-2 font-sans text-[17px]">
                      {q.text}
                    </p>
                    <div className="mt-6 flex items-center justify-between border-t pt-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full shadow-inner text-orange-700 font-semibold tracking-wide">
                        💜 {q.likes.length}
                      </div>
                      <button
                        onClick={() => handleDelete(q._id)}
                        className="group flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-400 text-red-600 font-semibold transition-all duration-200 hover:bg-red-600 hover:text-white shadow-md hover:shadow-lg"
                      >
                        <span className="transition-transform duration-200 group-hover:rotate-12">
                          🗑️
                        </span>
                        <span>Delete</span>
                      </button>
                    </div>
                    {q.comments?.length > 0 && (
                      <div className="mt-6 space-y-4">
                        {q.comments.some((c) => c.flagged) && (
                          <div className="border-l-4 border-red-400 pl-4 bg-red-50/50 rounded-md py-2">
                            <h4 className="text-base font-semibold text-red-800 mb-2 flex items-center gap-1">
                              ⚠️ Flagged Comments
                            </h4>
                            <div className="space-y-2">
                              {q.comments
                                .filter((c) => c.flagged)
                                .map((c) => {
                                  console.log("Rendering flagged comment:", c); // Debug log
                                  return (
                                    <div
                                      key={c._id}
                                      className="relative bg-red-100 border border-red-300 px-4 py-2 rounded-md shadow-sm text-sm text-red-800"
                                    >
                                      <p className="leading-relaxed mb-1">
                                        {c.text}
                                      </p>
                                      <div className="flex justify-between text-xs italic text-red-700">
                                        <span>
                                          👤 {c.user?.name || "Anonymous"}
                                        </span>
                                        <span>
                                          {new Date(c.createdAt).toLocaleString(
                                            "en-IN",
                                            {
                                              dateStyle: "medium",
                                              timeStyle: "short",
                                            }
                                          )}
                                        </span>
                                      </div>
                                      <p className="text-xs mt-1 italic text-red-600">
                                        🔥 Hate Level:{" "}
                                        {c.hatePercent?.toFixed(2)}%
                                      </p>
                                      {isOwner && (
                                        <button
                                          onClick={() =>
                                            handleDeleteComment(q._id, c._id)
                                          }
                                          className="absolute top-2 right-3 text-xs font-semibold text-red-500 hover:underline"
                                        >
                                          Delete
                                        </button>
                                      )}
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        )}
                        {q.comments.some((c) => !c.flagged) && (
                          <div className="border-l-4 border-purple-300 pl-4 bg-gray-50 rounded-md py-2">
                            <h4 className="text-base font-semibold text-gray-800 mb-2 flex items-center gap-1">
                              💬 Comments
                            </h4>
                            <div className="space-y-2">
                              {q.comments
                                .filter((c) => !c.flagged)
                                .map((c) => (
                                  <div
                                    key={c._id}
                                    className="bg-white border border-gray-200 px-4 py-2 rounded-md shadow-sm text-sm text-gray-800"
                                  >
                                    <p className="leading-relaxed mb-1">
                                      {c.text}
                                    </p>
                                    <div className="flex justify-between text-xs italic text-gray-500">
                                      <span>
                                        👤 {c.user?.name || "Anonymous"}
                                      </span>
                                      <span>
                                        {new Date(c.createdAt).toLocaleString(
                                          "en-IN",
                                          {
                                            dateStyle: "medium",
                                            timeStyle: "short",
                                          }
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
