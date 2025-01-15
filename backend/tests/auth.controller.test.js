import request from "supertest";
import app from "../server.js";
import User from "../models/user.model.js";
import { sendVerificationEmail } from "../lib/utils/sendEmail.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

jest.mock("../lib/utils/sendEmail.js");

// Disable the cron job during tests
jest.mock("../lib/utils/cleanup.js", () => ({
  cleanupUnverifiedUsers: jest.fn(),
}));

dotenv.config();

describe("Auth Controller - Signup", () => {
  let createdUserIds = [];

  beforeAll(async () => {
    const url = process.env.MONGO_URI;
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }, 30000);

  afterEach(async () => {
    try {
      await User.deleteMany({ _id: { $in: createdUserIds } });
      createdUserIds = [];
    } catch (error) {
      console.error("Error in afterEach:", error);
    }
  }, 30000);

  afterAll(async () => {
    try {
      await mongoose.connection.close();
    } catch (error) {
      console.error("Error in afterAll:", error);
    }
  }, 30000);

  it("should return 400 if email format is invalid", async () => {
    // Given
    const invalidEmail = "invalidemail";
    const userData = {
      fullName: "Test User",
      username: "testuser",
      email: invalidEmail,
      password: "password123",
    };

    // When
    const res = await request(app).post("/api/auth/signup").send(userData);

    // Then
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid email format");
  }, 30000);

  it("should return 400 if username is already taken", async () => {
    // Given
    const existingUser = {
      fullName: "Existing User",
      username: "existinguser",
      email: "existinguser@example.com",
      password: "password123",
    };
    const createdUser = await User.create(existingUser);
    createdUserIds.push(createdUser._id);

    const newUser = {
      fullName: "Test User",
      username: "existinguser",
      email: "testuser@example.com",
      password: "password123",
    };

    // When
    const res = await request(app).post("/api/auth/signup").send(newUser);

    // Then
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Username is already taken");
  }, 30000);

  it("should return 400 if email is already taken", async () => {
    // Given
    const existingUser = {
      fullName: "Existing User",
      username: "existinguser",
      email: "existinguser@example.com",
      password: "password123",
    };
    const createdUser = await User.create(existingUser);
    createdUserIds.push(createdUser._id);

    const newUser = {
      fullName: "Test User",
      username: "testuser",
      email: "existinguser@example.com",
      password: "password123",
    };

    // When
    const res = await request(app).post("/api/auth/signup").send(newUser);

    // Then
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Email is already taken");
  }, 30000);

  it("should return 400 if password is less than 6 characters", async () => {
    // Given
    const userData = {
      fullName: "Test User",
      username: "testuser",
      email: "testuser@example.com",
      password: "123",
    };

    // When
    const res = await request(app).post("/api/auth/signup").send(userData);

    // Then
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Password must be at least 6 characters long");
  }, 30000);

  it("should create a new user and send verification email", async () => {
    // Given
    const userData = {
      fullName: "Test User",
      username: "testuser",
      email: "testuser@example.com",
      password: "password123",
    };

    // When
    const res = await request(app).post("/api/auth/signup").send(userData);

    // Then
    expect(res.status).toBe(201);
    expect(res.body.message).toBe(
      "User registered successfully. Please check your email to verify your account."
    );

    const user = await User.findOne({ email: "testuser@example.com" });
    expect(user).not.toBeNull();
    expect(user.username).toBe("testuser");
    expect(user.isVerified).toBe(false);

    // Track created user
    createdUserIds.push(user._id);

    expect(sendVerificationEmail).toHaveBeenCalledWith(
      "testuser@example.com",
      expect.any(String)
    );
  }, 30000);
});
