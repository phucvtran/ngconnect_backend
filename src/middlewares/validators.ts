import { Request, Response, NextFunction } from "express";
import Joi from "joi";

const createRequestSchema = Joi.object({
  listingId: Joi.number(),
  message: Joi.string().min(1).max(500).required().messages({
    "string.empty": "Message is required",
    "string.min": "Message must be at least 1 character",
    "string.max": "Message cannot exceed 500 characters",
  }),
  reservationDates: Joi.array()
    .items(
      Joi.date()
        .iso()
        .required()
        .greater(Date.now() + 24 * 60 * 60 * 1000)
    )
    .min(1)
    .required()
    .messages({
      "array.min": "At least one dateTime is required",
      "date.iso": "Each dateTime must be in ISO format",
      "date.greater": "Each dateTime must be 1 day in the future",
    }),
});

/**
 * listing request api schema validation.
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const validateListingRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = createRequestSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      message: "Validation Error",
      errors: error.details.map((error) => ({
        field: error.path,
        message: error.message,
      })),
    });
  }

  next();
};
