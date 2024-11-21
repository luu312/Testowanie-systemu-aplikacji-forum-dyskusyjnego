import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";
import Category from "../models/category.model.js";

export const createPost = async (req, res) => {
  try {
    const { text, categoryId } = req.body;
    let { img } = req.body;
    const userId = req.user._id.toString();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!text && !img) {
      return res.status(400).json({ error: "Text or image is required" });
    }

    if (!categoryId) {
      return res.status(400).json({ error: "Category is required" });
    }

    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
    }

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newPost = new Post({
      user: userId,
      text,
      img,
      category: categoryId,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("user");
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (
      post.user.role === "admin" &&
      post.user._id.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ error: "Cannot delete posts from other admin users" });
    }

    if (
      post.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(401)
        .json({ error: "Unauthorized to delete this post" });
    }

    if (post.img) {
      const img = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(img);
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("Delete post controller error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user._id;
    const postId = req.params.id;

    if (!text) {
      return res.status(400).json({ error: "Comment text is required" });
    }

    const post = await Post.findById(postId).populate("user");

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comment = {
      user: userId,
      text,
    };

    post.comments.push(comment);
    await post.save();

    const notification = new Notification({
      from: userId,
      to: post.user._id,
      type: "comment",
    });
    await notification.save();

    res.status(201).json(post);
  } catch (error) {
    console.log("Comment on post controller error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.likedPost) {
      user.likedPost = [];
    }

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      user.likedPost = user.likedPost.filter(
        (id) => id.toString() !== postId.toString()
      );

      console.log("Before saving (unlike):", user.likedPost);
      await post.save();
      await user.save();
      console.log("After saving (unlike):", user.likedPost);

      res.status(200).json(post.likes);
    } else {
      post.likes.push(userId);
      user.likedPost.push(postId);

      console.log("Before saving (like):", user.likedPost);
      await post.save();
      await user.save();
      console.log("After saving (like):", user.likedPost);

      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
      });
      await notification.save();

      res.status(200).json(post.likes);
    }
  } catch (error) {
    console.error("Error in likeUnlikePost controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const query = {};
    if (categoryId) {
      query.category = categoryId;
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" })
      .populate({ path: "category", select: "name color" });

    if (posts.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(posts);
  } catch (error) {
    console.log("Get all posts controller error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getLikedPosts = async (req, res) => {
  const { userId, categoryId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.likedPost) {
      user.likedPost = [];
    }

    console.log("User likedPosts:", user.likedPost);

    const query = { _id: { $in: user.likedPost } };
    if (categoryId) {
      query.category = categoryId;
    }

    const likedPosts = await Post.find(query)
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" })
      .populate({ path: "category", select: "name color" });

    console.log("Liked posts:", likedPosts);

    res.status(200).json(likedPosts);
  } catch (error) {
    console.error("Get liked posts controller error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const following = user.following;
    const { categoryId } = req.params;

    const query = { user: { $in: following } };
    if (categoryId) {
      query.category = categoryId;
    }

    const feedPosts = await Post.find(query)
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" })
      .populate({ path: "category", select: "name color" });

    res.status(200).json(feedPosts);
  } catch (error) {
    console.log("Get following posts controller error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPostsByUser = async (req, res) => {
  try {
    const { username, categoryId } = req.params;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const query = { user: user._id };
    if (categoryId) {
      query.category = categoryId;
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" })
      .populate({ path: "category", select: "name color" });

    res.status(200).json(posts);
  } catch (error) {
    console.log("Get posts by user controller error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPostsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const posts = await Post.find({ category: categoryId })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" })
      .populate({ path: "category", select: "name color" });

    if (posts.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(posts);
  } catch (error) {
    console.log("Error fetching posts by category: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { text, categoryId, img } = req.body;
    const postId = req.params.id;
    const post = await Post.findById(postId).populate("user");

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (
      post.user.role === "admin" &&
      req.user.role === "admin" &&
      post.user._id.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ error: "Cannot edit posts of other admins" });
    }

    if (
      post.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(401)
        .json({ error: "Unauthorized to update this post" });
    }

    if (text) post.text = text;
    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      post.category = categoryId;
    }
    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      post.img = uploadedResponse.secure_url;
    }

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const post = await Post.findOne({ "comments._id": commentId }).populate(
      "comments.user"
    );

    if (!post) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (
      comment.user.role === "admin" &&
      req.user.role === "admin" &&
      comment.user._id.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ error: "Cannot delete comments of other admins" });
    }

    if (
      comment.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(401)
        .json({ error: "Unauthorized to delete this comment" });
    }

    post.comments.pull(commentId);
    await post.save();

    await Notification.findOneAndDelete({
      from: comment.user._id,
      to: post.user._id,
      type: "comment",
    });

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.log("Delete comment controller error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;
    const post = await Post.findOne({ "comments._id": commentId }).populate(
      "comments.user"
    );

    if (!post) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (
      comment.user.role === "admin" &&
      req.user.role === "admin" &&
      comment.user._id.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ error: "Cannot edit comments of other admins" });
    }

    if (
      comment.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(401)
        .json({ error: "Unauthorized to update this comment" });
    }

    comment.text = text;
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.log("Update comment controller error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
