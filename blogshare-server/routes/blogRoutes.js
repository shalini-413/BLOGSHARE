import express from "express";
import auth from "../middleware/authMiddleware.js";
import { createBlog, getBlogs, likedislikeBlog, deleteBlog, createComment, deleteComment } from "../controllers/blogController.js";

const router = express.Router();

router.post("/", auth, createBlog);


router.get("/", getBlogs);

router.patch("/:id/like", auth, likedislikeBlog);

router.delete("/:id", auth, deleteBlog);

router.post("/:id/comments", auth, createComment);

router.delete("/:blogId/comments/:commentId", auth, deleteComment);


export default router;
