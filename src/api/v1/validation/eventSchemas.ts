/**
 * @openapi
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - date
 *         - capacity
 *         - registrationCount
 *         - status
 *         - category
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the event
 *           example: "abc123"
 *         name:
 *           type: string
 *           description: Name of the event
 *           example: "Tech Conference 2025"
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date and time of the event (must be in the future)
 *           example: "2025-12-01T10:00:00Z"
 *         capacity:
 *           type: integer
 *           minimum: 5
 *           description: Maximum number of attendees
 *           example: 100
 *         registrationCount:
 *           type: integer
 *           minimum: 0
 *           description: Current number of registrations
 *           example: 42
 *         status:
 *           type: string
 *           enum: [active, cancelled, completed]
 *           description: Current status of the event
 *           example: "active"
 *         category:
 *           type: string
 *           enum: [conference, workshop, meetup, seminar, general]
 *           description: Category of the event
 *           example: "conference"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the event was created
 *           example: "2024-01-15T10:30:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the event was last updated
 *           example: "2024-01-20T14:45:00Z"
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message
 *           example: "Validation error: name is required"
 */

import Joi from "joi";

export const eventSchemas = {
    create: {
        body: Joi.object({
            name: Joi.string().min(3).required().messages({
                "any.required": '"name" is required',
                "string.min": '"name" length must be at least 3 characters long',
            }),
            date: Joi.date().iso().greater("now").required().messages({
                "any.required": '"date" is required',
                "date.greater": '"date" must be greater than "now"',
            }),
            capacity: Joi.number().integer().min(5).required().messages({
                "any.required": '"capacity" is required',
                "number.min": '"capacity" must be greater than or equal to 5',
                "number.integer": '"capacity" must be an integer',
            }),
            registrationCount: Joi.number()
                .integer()
                .min(0)
                .max(Joi.ref("capacity"))
                .default(0)
                .messages({
                    "number.max":
                        '"registrationCount" must be less than or equal to ref:capacity',
                }),
            status: Joi.string()
                .valid("active", "cancelled", "completed")
                .default("active")
                .messages({
                    "any.only":
                        '"status" must be one of [active, cancelled, completed]',
                }),
            category: Joi.string()
                .valid("conference", "workshop", "meetup", "seminar", "general")
                .default("general")
                .messages({
                    "any.only":
                        '"category" must be one of [conference, workshop, meetup, seminar, general]',
                }),
        }),
    },

    getById: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": '"id" is required',
                "string.empty": '"id" cannot be empty',
            }),
        }),
    },

    update: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": '"id" is required',
                "string.empty": '"id" cannot be empty',
            }),
        }),
        body: Joi.object({
            name: Joi.string().min(3).optional().messages({
                "string.min": '"name" length must be at least 3 characters long',
            }),
            date: Joi.date().iso().greater("now").optional().messages({
                "date.greater": '"date" must be greater than "now"',
            }),
            capacity: Joi.number().integer().min(5).optional().messages({
                "number.min": '"capacity" must be greater than or equal to 5',
                "number.integer": '"capacity" must be an integer',
            }),
            status: Joi.string()
                .valid("active", "cancelled", "completed")
                .optional()
                .messages({
                    "any.only":
                        '"status" must be one of [active, cancelled, completed]',
                }),
            category: Joi.string()
                .valid("conference", "workshop", "meetup", "seminar", "general")
                .optional()
                .messages({
                    "any.only":
                        '"category" must be one of [conference, workshop, meetup, seminar, general]',
                }),
        }),
    },

    delete: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": '"id" is required',
                "string.empty": '"id" cannot be empty',
            }),
        }),
    },
};