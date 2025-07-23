import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_EXPRESS_URL}/api`,
  withCredentials: true,
});
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const logoutUser = () => API.post("/auth/logout");
export const createBlog = (data) => API.post("/blogs", data);
export const getBlogs = () => API.get("/blogs");
export const likeBlog = (id) => API.patch(`/blogs/${id}/like`);
export const deleteBlog = (id) => API.delete(`/blogs/${id}`);
export const addComment = (blogId, commentData) => {
  return API.post(`/blogs/${blogId}/comments`, commentData);
};
export const deleteComment = (blogId, commentId) => API.delete(`/blogs/${blogId}/comments/${commentId}`);
export const getCurrentUser = () => API.get("/auth/me");

