import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const AsteroidFeedSchema = z
  .object({
    start_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
    end_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(9),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);
      const daysDiff = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysDiff <= 7;
    },
    {
      message: "Date range cannot exceed 7 days",
      path: ["end_date"],
    }
  );

export const AsteroidIdSchema = z.object({
  asteroid_id: z.string().min(1),
});

export const AsteroidSearchSchema = z.object({
  query: z.string().min(1).max(100),
});

export type AsteroidFeedParams = z.infer<typeof AsteroidFeedSchema>;
export type AsteroidIdParams = z.infer<typeof AsteroidIdSchema>;
export type AsteroidSearchParams = z.infer<typeof AsteroidSearchSchema>;

// Validation middleware factory
export const createValidationMiddleware = <T>(
  schema: z.ZodSchema<T>,
  source: "query" | "params" = "query"
): ((req: Request, res: Response, next: NextFunction) => void) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const dataToValidate = source === "query" ? req.query : req.params;
      const validatedData = schema.parse(dataToValidate);
      (req as any).validatedQuery = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: "Validation failed",
          details: error.issues.map(
            (e: z.ZodIssue) => `${e.path.join(".")}: ${e.message}`
          ),
        });
        return;
      }
      next(error);
    }
  };
};

export const validateAsteroidFeed = createValidationMiddleware(
  AsteroidFeedSchema,
  "query"
);
export const validateAsteroidId = createValidationMiddleware(
  AsteroidIdSchema,
  "params"
);
export const validateAsteroidSearch = createValidationMiddleware(
  AsteroidSearchSchema,
  "query"
);
