import express from "express";
import mongoose from "mongoose";  
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import authRoutes from "./routes/authRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";

const app = express();
// app.use(cors());

app.use(cors({
  origin: "https://blog-project-opal-six.vercel.app",
  credentials: true,
  methods: ["GET","POST","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}));

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Credentials", "true");
//   next();
// });

app.use(cookieParser());
app.use(express.json());
// app.use(cookieParser());


app.get("/", (req, res) => res.send("Welcome to the blogShare API"));
app.get("/ping", (req, res) => res.send("pong")); 
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on http://localhost:${process.env.PORT || 5000}`)
    );
  })
  .catch(console.error);
