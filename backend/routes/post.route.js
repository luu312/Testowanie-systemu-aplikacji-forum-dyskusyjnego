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

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: API for managing posts
 */

/**
 * @swagger
 * /posts/user/{username}/{categoryId}?:
 *   get:
 *     summary: Get posts by a user
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         description: Username of the user
 *       - in: path
 *         name: categoryId
 *         required: false
 *         description: Optional category ID to filter posts by category
 *     responses:
 *       200:
 *         description: List of posts by the user
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/user/:username/:categoryId?", protectRoute, getPostsByUser);

/**
 * @swagger
 * /posts/likes/{userId}/{categoryId}?:
 *   get:
 *     summary: Get liked posts by a user
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user
 *       - in: path
 *         name: categoryId
 *         required: false
 *         description: Optional category ID to filter liked posts by category
 *     responses:
 *       200:
 *         description: List of liked posts
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/likes/:userId/:categoryId?", protectRoute, getLikedPosts);

/**
 * @swagger
 * /posts/following/{categoryId}?:
 *   get:
 *     summary: Get posts from users that the current user is following
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: false
 *         description: Optional category ID to filter posts by category
 *     responses:
 *       200:
 *         description: List of posts from followed users
 *       500:
 *         description: Internal server error
 */
router.get("/following/:categoryId?", protectRoute, getFollowingPosts);

/**
 * @swagger
 * /posts/all/{categoryId}?:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: false
 *         description: Optional category ID to filter posts by category
 *     responses:
 *       200:
 *         description: List of all posts
 *       500:
 *         description: Internal server error
 */
router.get("/all/:categoryId?", protectRoute, getAllPosts);

/**
 * @swagger
 * /posts/{categoryId}:
 *   get:
 *     summary: Get posts by category
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         description: Category ID to filter posts by
 *     responses:
 *       200:
 *         description: List of posts for the category
 *       500:
 *         description: Internal server error
 */
router.get("/:categoryId", protectRoute, getPostsByCategory);

/**
 * @swagger
 * /posts/create:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               img:
 *                 type: string
 *               categoryId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Bad request (missing required fields)
 *       500:
 *         description: Internal server error
 */
router.post("/create", protectRoute, createPost);

/**
 * @swagger
 * /posts/like/{id}:
 *   post:
 *     summary: Like or unlike a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Post ID to like or unlike
 *     responses:
 *       200:
 *         description: Post liked/unliked successfully
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
router.post("/like/:id", protectRoute, likeUnlikePost);

/**
 * @swagger
 * /posts/comment/{id}:
 *   post:
 *     summary: Comment on a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Post ID to comment on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       400:
 *         description: Bad request (missing comment text)
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
router.post("/comment/:id", protectRoute, commentOnPost);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Post ID to delete
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", protectRoute, deletePost);

/**
 * @swagger
 * /posts/comment/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: Comment ID to delete
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
router.delete("/comment/:commentId", protectRoute, deleteComment);

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Post ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               img:
 *                 type: string
 *               categoryId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       400:
 *         description: Bad request (missing required fields)
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", protectRoute, updatePost);

/**
 * @swagger
 * /posts/comment/{commentId}:
 *   put:
 *     summary: Update a comment
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: Comment ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
router.put("/comment/:commentId", protectRoute, updateComment);

export default router;
