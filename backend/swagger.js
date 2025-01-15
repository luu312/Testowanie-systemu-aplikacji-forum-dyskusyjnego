import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";

// Uproszczona obsługa ścieżek - zakładamy, że plik będzie używany w kontekście `process.cwd()`
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Backend API Documentation",
    version: "1.0.0",
    description: "Dokumentacja API aplikacji backendowej",
  },
  servers: [
    {
      url: "http://localhost:8000/api",
      description: "Development Server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "string" },
          username: { type: "string", example: "john_doe" },
          fullName: { type: "string", example: "John Doe" },
          email: { type: "string", example: "john@example.com" },
          profileImg: { type: "string", example: "https://example.com/profile.jpg" },
          bio: { type: "string", example: "Software Developer" },
          role: { type: "string", enum: ["user", "admin"], example: "user" },
          isVerified: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          token: { type: "string", example: "jwt-token-example" },
          user: { $ref: "#/components/schemas/User" },
        },
      },
      Category: {
        type: "object",
        properties: {
          _id: { type: "string", description: "ID kategorii" },
          name: { type: "string", example: "Technology" },
          color: { type: "string", example: "#ff5733" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Post: {
        type: "object",
        properties: {
          _id: { type: "string", description: "ID of the post" },
          user: {
            type: "object",
            properties: {
              _id: { type: "string" },
              username: { type: "string" },
              profileImg: { type: "string" },
            },
          },
          text: { type: "string", example: "This is a post text" },
          img: { type: "string", example: "https://example.com/image.jpg" },
          likes: {
            type: "array",
            items: { $ref: "#/components/schemas/User" },
          },
          comments: {
            type: "array",
            items: {
              type: "object",
              properties: {
                user: { $ref: "#/components/schemas/User" },
                text: { type: "string", required: true },
              },
            },
          },
          category: { $ref: "#/components/schemas/Category" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
};

const options = {
  swaggerDefinition,
  apis: [path.resolve(process.cwd(), "backend/routes/*.js")], 
};

const swaggerSpec = swaggerJsDoc(options);

export const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
