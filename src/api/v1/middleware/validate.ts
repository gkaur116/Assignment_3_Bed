import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import { HTTP_STATUS } from "../../../constants/httpConstants";

interface RequestSchemas {
    body?: ObjectSchema;
    params?: ObjectSchema;
    query?: ObjectSchema;
}

interface ValidationOptions {
    stripBody?: boolean;
    stripQuery?: boolean;
    stripParams?: boolean;
}

/**
 * Creates an Express middleware function that validates different parts of the request
 * against separate Joi schemas and strips unknown fields appropriately.
 *
 * @param schemas - Object containing separate schemas for body, params, and query
 * @param options - Validation options for stripping behavior
 * @returns Express middleware function that performs the validation
 */
export const validateRequest = (
    schemas: RequestSchemas,
    options: ValidationOptions = {}
) => {
    // stripParams - Usually don't strip params as they're route-defined
    const defaultOptions = {
        stripBody: true,
        stripQuery: true,
        stripParams: false,
        ...options,
    };

    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors: string[] = [];

            /**
             * Validates a specific part of the request (body, params, or query) against a Joi schema.
             * Collects validation errors and optionally strips unknown fields from the data.
             */
            const validatePart = (
                schema: ObjectSchema,
                data: any,
                partName: string,
                shouldStrip: boolean
            ) => {
                const { error, value } = schema.validate(data, {
                    abortEarly: false,
                    stripUnknown: shouldStrip,
                });

                if (error) {
                    errors.push(
                        ...error.details.map(
                            (detail) => detail.message
                        )
                    );
                } else if (shouldStrip) {
                    return value;
                }
                return data;
            };

            // Validate each request part if schema is provided
            if (schemas.body) {
                req.body = validatePart(
                    schemas.body,
                    req.body,
                    "Body",
                    defaultOptions.stripBody
                );
            }

            if (schemas.params) {
                req.params = validatePart(
                    schemas.params,
                    req.params,
                    "Params",
                    defaultOptions.stripParams
                );
            }

            if (schemas.query) {
                req.query = validatePart(
                    schemas.query,
                    req.query,
                    "Query",
                    defaultOptions.stripQuery
                );
            }

            // If there are any validation errors, return them
            if (errors.length > 0) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    message: `Validation error: ${errors.join(", ")}`,
                });
            }

            next();
        } catch (error: unknown) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: (error as Error).message,
            });
        }
    };
};