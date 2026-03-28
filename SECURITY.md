# Security Configuration

This document outlines the security configuration choices made for the Events API,
including justifications and external sources for each decision.

---

## Helmet.js Configuration

### Configuration Applied
```typescript
helmet({
    contentSecurityPolicy: false,
    hidePoweredBy: true,
    noSniff: true,
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
    },
    frameguard: { action: "deny" },
    referrerPolicy: { policy: "no-referrer" },
});
```

### Justification

**`contentSecurityPolicy: false`** — CSP is built for browsers rendering HTML,
not for JSON APIs. Since this API never serves HTML, enabling CSP would add
processing overhead without providing any real protection. Disabling it keeps
things clean and avoids unnecessary header bloat.

**`hidePoweredBy: true`** — By default Express adds an `X-Powered-By: Express`
header to every response. There's no reason to advertise what the server is
built with — it just gives attackers a head start on finding known exploits.

**`noSniff: true`** — This sets `X-Content-Type-Options: nosniff`, which stops
browsers from guessing the content type of a response. Without it, a browser
might interpret a JSON response as something else entirely, which can open the
door to MIME confusion attacks.

**`hsts`** — Strict Transport Security tells clients to only ever connect over
HTTPS. The 1-year max-age with `includeSubDomains` and `preload` is the
recommended production setup according to OWASP. This is only applied in
production since local development runs on plain HTTP.

**`frameguard: { action: "deny" }`** — Prevents the API from being embedded
inside an iframe on another site. Not something that typically affects a JSON
API directly, but it's a cheap header to add and closes off a potential
clickjacking vector.

**`referrerPolicy: { policy: "no-referrer" }`** — Stops the browser from
sending referrer information along with API responses. Internal route paths
and query strings stay private and don't leak to third parties.

### Sources

1. Helmet.js Official Documentation — https://helmetjs.github.io/
2. OWASP Secure Headers Project — https://owasp.org/www-project-secure-headers/
3. MDN Web Docs: HTTP Headers — https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers
4. OWASP HTTP Security Response Headers Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html

---

## CORS Configuration

### Configuration Applied
```typescript
// Development
cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
});

// Production
cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || [],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
});
```

### Justification

**`origin: true` (development)** — In development, locking down origins just
gets in the way. Allowing all origins means Postman, Bruno, and any local
frontend can hit the API without friction while building and testing.

**`origin: process.env.ALLOWED_ORIGINS` (production)** — Production is a
different story. Only domains explicitly listed in the environment variable
are allowed to make requests. This stops random sites from calling the API
and keeps control in our hands.

**`credentials: true`** — Needed so that Authorization headers are included
in cross-origin requests. Without this, Bearer token authentication simply
won't work when the frontend and API are on different origins.

**`methods`** — Only the HTTP methods this API actually uses are listed.
There's no reason to leave DELETE or PUT open if a route doesn't need them,
and blocking unexpected methods reduces the surface area for abuse.

**`allowedHeaders: ["Content-Type", "Authorization"]`** — Whitelisting headers
explicitly means anything outside `Content-Type` and `Authorization` gets
rejected. These are the only two headers the API needs — one for JSON bodies,
one for authentication.

**`OPTIONS` in development methods** — Browsers send a preflight OPTIONS
request before certain cross-origin calls to check what's allowed. Including
OPTIONS in development ensures those preflight checks don't silently fail
during testing.

### Sources

1. MDN Web Docs: Cross-Origin Resource Sharing (CORS) — https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
2. OWASP CORS Security Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/CORS_Cheat_Sheet.html
3. W3C CORS Specification — https://www.w3.org/TR/cors/
4. npm cors package documentation — https://www.npmjs.com/package/cors