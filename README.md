# Event Registration API

A REST API for creating and managing events, built with Node.js, TypeScript, Express, and Firebase Firestore.

## Project Overview

The Event Registration API lets you create and manage events — things like conferences, workshops, and meetups. Each event tracks details like capacity, registration count, status, and category. It's built for developers who need a reliable backend to power an event management frontend or integrate event data into another system.

Requests are validated before hitting the database, responses are consistent JSON, and the whole thing is documented so you don't have to dig through the code to figure out how to use it.

---

## Installation Instructions

### Prerequisites

- Node.js v20.x or higher
- npm v9.x or higher
- A Firebase project with Firestore enabled

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/gkaur116/Assignment_3_Bed.git
cd Assignment_3_Bed
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Copy the example file and fill in your own Firebase credentials:
```bash
cp .env.example .env
```

Open `.env` and replace the placeholder values:
```env
NODE_ENV=development
PORT=3000
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key-here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
SWAGGER_SERVER_URL=http://localhost:3000/api/v1
```

4. **Start the server**
```bash
npm start
```

Server runs at `http://localhost:3000`

---

## API Request Examples

### 1. Health Check

Quick way to confirm the server is up and running.

**Request:**
```bash
curl -X GET http://localhost:3000/api/v1/health \
  -H "Content-Type: application/json"
```

**Response (200 OK):**
```json
{
    "status": "OK",
    "uptime": 35.95,
    "timestamp": "2026-03-28T16:51:08.296Z",
    "version": "1.0.0"
}
```

---

### 2. Create an Event

Creates a new event. `name`, `date`, and `capacity` are required. Everything else has sensible defaults.

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/events \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Conference 2026",
    "date": "2026-12-25T09:00:00.000Z",
    "capacity": 100
  }'
```

**Response (201 Created):**
```json
{
    "message": "Event created",
    "data": {
        "id": "evt_000002",
        "name": "Tech Conference 2026",
        "date": "2026-12-25T09:00:00.000Z",
        "capacity": 100,
        "registrationCount": 0,
        "status": "active",
        "category": "general",
        "createdAt": "2026-03-28T16:50:37.288Z",
        "updatedAt": "2026-03-28T16:50:37.288Z"
    }
}
```

---

### 3. Get All Events

Returns every event currently stored in the database.

**Request:**
```bash
curl -X GET http://localhost:3000/api/v1/events \
  -H "Content-Type: application/json"
```

**Response (200 OK):**
```json
{
    "message": "Events retrieved",
    "count": 1,
    "data": [
        {
            "id": "evt_000002",
            "name": "Tech Conference 2026",
            "date": "2026-12-25T09:00:00.000Z",
            "capacity": 100,
            "registrationCount": 0,
            "status": "active",
            "category": "general",
            "createdAt": "2026-03-28T16:50:37.288Z",
            "updatedAt": "2026-03-28T16:50:37.288Z"
        }
    ]
}
```

---

## API Documentation

### Live Documentation (GitHub Pages)

Full API documentation is available at:
**https://gkaur116.github.io/Assignment_3_Bed/**

### Local Documentation (Swagger UI)

When running locally, the interactive Swagger UI is at:
**http://localhost:3000/api-docs**

You can explore and test every endpoint directly from the browser — no Postman needed.

---

## Security

- **Helmet.js** — Adds secure HTTP headers on every response to guard against common attacks
- **CORS** — Controls which origins can talk to the API
- **Environment Variables** — Firebase credentials and config stay in `.env`, never in the codebase
- **Joi Validation** — Every incoming request is validated before it touches the database

See [SECURITY.md](./SECURITY.md) for the full breakdown of what's configured and why.