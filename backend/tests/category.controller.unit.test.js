
import { getPostsByCategory } from "../controllers/post.controller";
import Post from "../models/post.model";

jest.mock("../models/post.model");

describe("getPostsByCategory", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { categoryId: "testCategoryId" },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it("should return posts for a valid categoryId", async () => {
    // Given
    const mockPosts = [
      {
        _id: "postId1",
        text: "This is a test post",
        user: { _id: "userId1", name: "Test User" },
        comments: [
          { user: { _id: "userId2", name: "Commenter" }, text: "Test comment" },
        ],
        category: { _id: "testCategoryId", name: "Tech", color: "#0000FF" },
      },
    ];

    Post.find.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue(mockPosts),
          }),
        }),
      }),
    });

    // When
    await getPostsByCategory(req, res);

    // Then
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockPosts);
  });

  it("should return an empty array if no posts are found", async () => {
    // Given
    Post.find.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue([]),
          }),
        }),
      }),
    });

    // When
    await getPostsByCategory(req, res);

    // Then
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it("should return a 500 error if an exception is thrown", async () => {
    // Given
    Post.find.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockRejectedValue(new Error("Database error")),
          }),
        }),
      }),
    });

    // When
    await getPostsByCategory(req, res);

    // Then
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
  });
});
