import express from "express";
import cors from "cors"; 
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv";
import connectMongoDB from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import postRoutes from "./routes/post.route.js";
import categoryRoutes from "./routes/category.route.js"; 
import "./lib/utils/cleanup.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: "http://localhost:5000", 
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(express.json({ limit: "5mb" })); 
app.use(express.urlencoded({ extended: true })); 

app.use(cookieParser());

app.use("/api/auth", authRoutes); 
app.use("/api/post", postRoutes); 
app.use("/api/categories", categoryRoutes); 

app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
  connectMongoDB(); 
});
