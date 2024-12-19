
import request from "supertest";
import app from "../server.js";
import Post from "../models/post.model.js";
import Category from "../models/category.model.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

describe("Post Controller - Create Post", () => {
  let createdCategoryId;
  let token;

  beforeAll(async () => {
    const url = process.env.MONGO_URI;
    await mongoose.connect(url);

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ username: "Jan", password: "12345678" });

    token = loginRes.headers["set-cookie"][0].split(";")[0].split("=")[1];

    let category = await Category.findOne({ name: "Test Category" });
    if (!category) {
      category = await Category.create({
        name: "Test Category",
        color: "blue",
      });
    }
    createdCategoryId = category._id;
  }, 30000);

  afterAll(async () => {
    try {
      await Post.deleteMany({ category: createdCategoryId });
      await Category.deleteMany({ _id: createdCategoryId });
      await mongoose.connection.close();
    } catch (error) {
      console.error("Error in afterAll:", error);
    }
  }, 30000);

  it("should create a new post with text and image", async () => {
    // Given
    const imagePath = path.join(__dirname, "test-image.jpg");
    const imageContent = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/gnlZAAAAABJRU5ErkJggg==",
      "base64"
    );
    fs.writeFileSync(imagePath, imageContent);

    const uploadRes = await cloudinary.uploader.upload(imagePath);

    const postData = {
      text: "Test post",
      img: uploadRes.secure_url,
      categoryId: createdCategoryId,
    };

    // When
    const res = await request(app)
      .post("/api/post/create")
      .send(postData)
      .set("Cookie", `jwt=${token}`);

    // Then
    expect(res.status).toBe(201);
    expect(res.body.text).toBe("Test post");
    expect(res.body.img).toContain("https://res.cloudinary.com/");
    expect(res.body.category).toBe(createdCategoryId.toString());

    // Cleanup
    fs.unlinkSync(imagePath);
  }, 30000);

  it("should return 400 if text and image are missing", async () => {
    // Given
    const postData = { categoryId: createdCategoryId };

    // When
    const res = await request(app)
      .post("/api/post/create")
      .send(postData)
      .set("Cookie", `jwt=${token}`);

    // Then
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Text or image is required");
  }, 30000);

  it("should return 400 if category is missing", async () => {
    // Given
    const postData = { text: "Test post" };

    // When
    const res = await request(app)
      .post("/api/post/create")
      .send(postData)
      .set("Cookie", `jwt=${token}`);

    // Then
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Category is required");
  }, 30000);

  it("should return 404 if category is not found", async () => {
    // Given
    const postData = {
      text: "Test post",
      categoryId: "60d21b4667d0d8992e610c85",
    };

    // When
    const res = await request(app)
      .post("/api/post/create")
      .send(postData)
      .set("Cookie", `jwt=${token}`);

    // Then
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Category not found");
  }, 30000);

  it("should return 401 if user is not authenticated", async () => {
    // Given
    const postData = {
      text: "Test post",
      categoryId: createdCategoryId,
    };

    // When
    const res = await request(app).post("/api/post/create").send(postData);

    // Then
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Not authorized, no token");
  }, 30000);
});
