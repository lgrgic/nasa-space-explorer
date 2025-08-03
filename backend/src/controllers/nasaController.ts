import { Request, Response } from "express";
import { nasaService } from "../services/nasaService";

export const nasaController = {
  async getAsteroidsFeed(req: Request, res: Response): Promise<void> {
    try {
      const { start_date, end_date, page = "1", limit = "9" } = req.query;

      if (!start_date || !end_date) {
        res.status(400).json({
          error: "start_date and end_date are required",
        });
        return;
      }

      const startDate = new Date(start_date as string);
      const endDate = new Date(end_date as string);
      const daysDiff = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff > 7) {
        res.status(400).json({
          error: "Date range cannot exceed 7 days. NASA API limitation.",
          details: `Requested range: ${daysDiff} days. Maximum allowed: 7 days.`,
        });
        return;
      }

      if (daysDiff < 0) {
        res.status(400).json({
          error: "Start date must be before or equal to end date",
        });
        return;
      }

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);

      const data = await nasaService.getAsteroidsFeed(
        start_date as string,
        end_date as string
      );

      const allAsteroids = Object.values(data.near_earth_objects).flat();
      const totalAsteroids = allAsteroids.length;
      const totalPages = Math.ceil(totalAsteroids / limitNum);
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;
      const paginatedAsteroids = allAsteroids.slice(startIndex, endIndex);

      const result = {
        ...data,
        near_earth_objects: { [start_date as string]: paginatedAsteroids },
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalAsteroids,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
          limit: limitNum,
        },
      };

      res.json(result);
    } catch (error) {
      console.error("Asteroids API error:", error);
      res.status(500).json({
        error: "Failed to fetch asteroids data",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
};
