import { commentOnPost, likeUnlikePost } from "../controllers/post.controller";
import Post from "../models/post.model";
import User from "../models/user.model";
import Notification from "../models/notification.model";
import mongoose from "mongoose";

jest.mock("../models/post.model");
jest.mock("../models/notification.model");
jest.mock("../models/user.model");

describe("commentOnPost", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      user: { _id: new mongoose.Types.ObjectId() },
      params: { id: new mongoose.Types.ObjectId() },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return 400 if comment text is missing", async () => {
    // Given
    // req.body.text is not set

    // When
    await commentOnPost(req, res);

    // Then
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Comment text is required",
    });
  });

  it("should return 404 if post is not found", async () => {
    // Given
    const mockPopulate = jest.fn().mockResolvedValue(null);
    Post.findById.mockReturnValue({ populate: mockPopulate });
    req.body.text = "Test comment";

    // When
    await commentOnPost(req, res);

    // Then
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Post not found" });
  });

  it("should add a comment and return 201", async () => {
    // Given
    const post = {
      comments: [],
      save: jest.fn(),
      user: { _id: new mongoose.Types.ObjectId() },
    };
    const mockPopulate = jest.fn().mockResolvedValue(post);
    Post.findById.mockReturnValue({ populate: mockPopulate });
    Notification.prototype.save = jest.fn();
    req.body.text = "Test comment";

    // When
    await commentOnPost(req, res);

    // Then
    expect(post.comments).toHaveLength(1);
    expect(post.save).toHaveBeenCalled();
    expect(Notification.prototype.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(post);
  });

  it("should return 500 if there is an error saving the post", async () => {
    // Given
    const post = {
      comments: [],
      save: jest.fn().mockRejectedValue(new Error("Save error")),
      user: { _id: new mongoose.Types.ObjectId() },
    };
    const mockPopulate = jest.fn().mockResolvedValue(post);
    Post.findById.mockReturnValue({ populate: mockPopulate });
    req.body.text = "Test comment";

    // When
    await commentOnPost(req, res);

    // Then
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
  });
});

describe("likeUnlikePost", () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { _id: new mongoose.Types.ObjectId() },
      params: { id: new mongoose.Types.ObjectId() },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return 404 if post is not found", async () => {
    // Given
    Post.findById.mockResolvedValue(null);

    // When
    await likeUnlikePost(req, res);

    // Then
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Post not found" });
  });

  it("should return 404 if user is not found", async () => {
    // Given
    const post = { likes: [], user: new mongoose.Types.ObjectId() };
    Post.findById.mockResolvedValue(post);
    User.findById.mockResolvedValue(null);

    // When
    await likeUnlikePost(req, res);

    // Then
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
  });

  it("should like a post and return 200", async () => {
    // Given
    const post = {
      likes: [],
      save: jest.fn(),
      user: new mongoose.Types.ObjectId(),
    };
    const user = { likedPost: [], save: jest.fn() };
    Post.findById.mockResolvedValue(post);
    User.findById.mockResolvedValue(user);
    Notification.prototype.save = jest.fn();

    // When
    await likeUnlikePost(req, res);

    // Then
    expect(post.likes).toContain(req.user._id);
    expect(user.likedPost).toContain(req.params.id);
    expect(post.save).toHaveBeenCalled();
    expect(user.save).toHaveBeenCalled();
    expect(Notification.prototype.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(post.likes);
  });

  it("should unlike a post and return 200", async () => {
    // Given
    const post = {
      likes: [req.user._id],
      save: jest.fn(),
      user: new mongoose.Types.ObjectId(),
    };
    const user = { likedPost: [req.params.id], save: jest.fn() };
    Post.findById.mockResolvedValue(post);
    User.findById.mockResolvedValue(user);

    // When
    await likeUnlikePost(req, res);

    // Then
    expect(post.likes).not.toContain(req.user._id);
    expect(user.likedPost).not.toContain(req.params.id);
    expect(post.save).toHaveBeenCalled();
    expect(user.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(post.likes);
  });
});
