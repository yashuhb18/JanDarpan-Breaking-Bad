import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import apiRoutes from "./routes/index.js"; // Main routes file
import { secureApiMiddleware, setBrowserIdentification } from "./middlewares/securityMiddleware.js";

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

// Middleware Setup
const corsOptions = {
    origin: ["http://localhost:3000", "https://scheme-seva-gov.vercel.app"], // Allow your frontend domain and others
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Enable cookies in requests and responses
};
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json()); // Parse JSON requests

// Set browser identification for all routes - this happens first
app.use(setBrowserIdentification);

// Apply API security for API routes only
app.use("/api", secureApiMiddleware);

// Declare API routes
app.use("/api", apiRoutes); // Attach all API routes

// health check api
app.get("/", (req, res) => {
    res.send("API is runningg");
});

export { app };
