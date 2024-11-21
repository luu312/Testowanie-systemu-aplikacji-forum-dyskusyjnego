import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  getCategories,
} from "../controllers/category.controller.js";

const router = express.Router();

router.get("/", protectRoute, getCategories);

export default router;