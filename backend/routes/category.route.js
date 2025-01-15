import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getCategories } from "../controllers/category.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API for managing categories
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get a list of categories
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter categories by name
 *         example: "electronics"
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Unique identifier for the category
 *                     example: "63b92e3a5294b5e5e2c8fabc"
 *                   name:
 *                     type: string
 *                     description: Name of the category
 *                     example: "Electronics"
 *                   color:
 *                     type: string
 *                     description: Color associated with the category
 *                     example: "#FF5733"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch categories"
 */

router.get("/", protectRoute, getCategories);

export default router;
