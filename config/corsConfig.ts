import cors from "cors";

/**
 * Returns a custom CORS configuration appropriate for a JSON REST API.
 * Settings vary between development and production environments.
 */
export const getCorsConfig = () => {
    const isDevelopment = process.env.NODE_ENV === "development";

    if (isDevelopment) {
        // Allow all origins in development for easy testing with Postman/Bruno
        return cors({
            origin: true,
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
        });
    }

    // Production: strict origin control
    return cors({
        origin: process.env.ALLOWED_ORIGINS?.split(",") || [],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    });
};