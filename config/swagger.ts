import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import { generateSwaggerSpec } from "./swaggerOptions";

/**
 * Sets up Swagger UI documentation for the Express application
 * @param app - The Express application instance
 */
const setupSwagger = (app: Express): void => {
    const specs = generateSwaggerSpec();
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};

export default setupSwagger;