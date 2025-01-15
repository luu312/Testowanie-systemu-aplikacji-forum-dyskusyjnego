import Category from "../models/category.model.js";

export const getCategories = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = { name: { $regex: search, $options: "i" } }; 
    }

    const categories = await Category.find(query).sort({ name: 1 }); 
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};


