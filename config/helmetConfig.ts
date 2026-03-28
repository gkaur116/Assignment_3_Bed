import helmet from "helmet";

/**
 * Returns a custom Helmet.js configuration appropriate for a JSON REST API.
 * Settings vary between development and production environments.
 */
export const getHelmetConfig = () => {
    const isDevelopment = process.env.NODE_ENV === "development";

    // Base configuration suitable for all JSON API environments
    const baseConfig = {
        // Disabled: CSP is designed for browsers rendering HTML, not JSON APIs
        contentSecurityPolicy: false,
        // Always hide server technology information from response headers
        hidePoweredBy: true,
        // Always prevent MIME type sniffing attacks
        noSniff: true,
    };

    if (isDevelopment) {
        return helmet({
            ...baseConfig,
            // No HTTPS enforcement in development (we use http://localhost)
            hsts: false,
        });
    }

    // Production: full security headers
    return helmet({
        ...baseConfig,
        hsts: {
            // Force HTTPS for 1 year
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
        },
        // Prevent clickjacking by denying framing entirely
        frameguard: { action: "deny" },
        // Do not send referrer information with API responses
        referrerPolicy: { policy: "no-referrer" },
    });
};