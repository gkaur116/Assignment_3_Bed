import express, { Router } from "express";
import { validateRequest } from "../middleware/validate";
import * as eventController from "../controllers/eventController";
import { eventSchemas } from "../validation/eventSchemas";

const router: Router = express.Router();

// Create event - validates body
router.post(
    "/",
    validateRequest(eventSchemas.create),
    eventController.createEvent
);

// Get all events
router.get("/", eventController.getAllEvents);

// Get event by ID
router.get("/:id", eventController.getEventById);

// Update event
router.put("/:id", eventController.updateEvent);

// Delete event
router.delete("/:id", eventController.deleteEvent);

export default router;