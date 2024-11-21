import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { createPost } from "../controllers/post.controller.js";
import { deletePost } from "../controllers/post.controller.js";
import { commentOnPost } from "../controllers/post.controller.js";
import { likeUnlikePost } from "../controllers/post.controller.js";
import { getAllPosts } from "../controllers/post.controller.js";
import { getLikedPosts } from "../controllers/post.controller.js";
import { getFollowingPosts } from "../controllers/post.controller.js";
import { getPostsByUser } from "../controllers/post.controller.js";
import { getPostsByCategory } from "../controllers/post.controller.js";
import { updatePost } from "../controllers/post.controller.js";
import { deleteComment } from "../controllers/post.controller.js";
import { updateComment } from "../controllers/post.controller.js";

const router = express.Router();

router.get("/user/:username/:categoryId?", protectRoute, getPostsByUser);
router.get("/likes/:userId/:categoryId?", protectRoute, getLikedPosts);
router.get("/following/:categoryId?", protectRoute, getFollowingPosts);
router.get("/all/:categoryId?", protectRoute, getAllPosts);
router.get("/:categoryId", protectRoute, getPostsByCategory);

router.post("/create", protectRoute, createPost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/comment/:id", protectRoute, commentOnPost);

router.delete("/:id", protectRoute, deletePost);
router.delete("/comment/:commentId", protectRoute, deleteComment);

router.put("/:id", protectRoute, updatePost);
router.put("/comment/:commentId", protectRoute, updateComment);

export default router;