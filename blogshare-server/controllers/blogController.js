import Blog from "../models/Blog.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const checkHateSpeech = async (text) => {
  try {
    const url = process.env.AI_URL + "/predict";
    console.log("Calling AI_URL:", url);

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();
    console.log("Model response:", data);

    const flagged = data.prediction === "Hate Speech";
    const hatePercent = (data.probabilities?.hate || 0) * 100;

    return { flagged, hatePercent };
  } catch (err) {
    console.error("Error in hate speech detection:", err);
    return { flagged: false, hatePercent: 0 };
  }
};


export const createBlog = async (req, res) => {
  console.log("req.userId:", req.userId);
  const { title, text, flagged = false } = req.body;

  if (!title || !text) {
    return res.status(400).json({ message: "Title and text are required" });
  }

  if (title.length < 5 || title.length > 100) {
    return res.status(400).json({ message: "Title must be between 5 and 100 characters" });
  }

  if (text.length < 20 || text.length > 5000) {
    return res.status(400).json({ message: "Text must be between 20 and 5000 characters" });
  }

  try {
    const newblog = new Blog({
      title,
      text,
      user: req.userId,
      flagged,
    });

    await newblog.save();
    res.status(201).json(newblog);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
}

export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("user", "name")                // blog author name
      .populate("comments.user", "name");      // comment author name

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const likedislikeBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: "Not found" });

  const userId = req.userId;
  const index = blog.likes.indexOf(userId);

  if (index > -1) {
    blog.likes.splice(index, 1); // Unlike
  } else {
    blog.likes.push(userId); // Like
  }

  await blog.save();
  res.json({ likes: blog.likes.length });
}

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "blog not found" });
    console.log(blog.user.toString());
    console.log(req.userId);
    if (!blog.user.equals(req.userId)) {
      return res.status(403).json({ message: "You are not allowed to delete this blog" });
    }

    await blog.deleteOne();
    res.json({ message: "blog deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export const createComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "blog not found" });

    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    if (text.length > 1000) {
      return res.status(400).json({ message: "Comment too long (max 1000 characters)" });
    }

    let userId = null;

    // Try to extract user ID from cookie token (if exists)
    const token = req.cookies?.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        console.log("Token invalid or expired — treating as anonymous");
      }
    }

    const { flagged, hatePercent } = await checkHateSpeech(text);
    console.log("Comment data:", { text, flagged, hatePercent, userId });

    const comment = {
      text,
      flagged,
      hatePercent,
      user: userId, // Either ObjectId or null (for anonymous)
    };

    blog.comments.push(comment);
    await blog.save();

    const populatedBlog = await Blog.findById(req.params.id)
      .populate("user", "name")
      .populate("comments.user", "name");

    console.log("Returning populated blog:", populatedBlog); // Debug log
    res.status(201).json({ message: "Comment added", blog: populatedBlog });
  } catch (err) {
    console.error("Add comment error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const deleteComment = async (req, res) => {
  try {
    const { blogId, commentId } = req.params;

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "blog not found" });

    if (blog.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not the author of this blog" });
    }

    const comment = blog.comments.find(
      (c) => c._id.toString() === commentId.trim()
    );

    if (!comment) return res.status(404).json({ message: "Comment not found" });

    blog.comments = blog.comments.filter(
      (c) => c._id.toString() !== commentId.trim()
    );

    await blog.save();

    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
