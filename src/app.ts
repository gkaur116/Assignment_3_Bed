import dotenv from "dotenv";

// Load environment variables BEFORE your internal imports!
dotenv.config();

import express, { Express } from "express";
import { getHelmetConfig } from "../config/helmetConfig";
import { getCorsConfig } from "../config/corsConfig";
import healthRoutes from "./api/v1/routes/healthRoutes";
import eventRoutes from "./api/v1/routes/eventRoutes";

// Initialize Express application
const app: Express = express();

// Security Middleware
app.use(getHelmetConfig());
app.use(getCorsConfig());

// Middleware
app.use(express.json());

// Define a route
app.use("/api/v1", healthRoutes);
app.use("/api/v1/events", eventRoutes);

export default app;